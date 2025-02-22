import { supabase } from "../supabase-client";
import type { Database } from "../../types/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export async function sendMessage(receiverId: string, content: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.user.id,
      receiver_id: receiverId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages(otherUserId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.user.id},receiver_id.eq.${user.user.id}`)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Message[];
}

export async function markMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", messageId);

  if (error) throw error;
}
