import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase-client";
import { Plus, X } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender: { name: string; is_doctor: boolean };
}

interface User {
  id: string;
  name: string;
  is_doctor: boolean;
}

export const Messages = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(name, is_doctor)
      `
      )
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
  }, [selectedUser, user?.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, is_doctor")
        .neq("id", user?.id);

      if (!error && data) {
        setUsers(data);
      }
    };

    if (user) {
      fetchUsers();
      fetchMessages();
    }
  }, [user, selectedUser, fetchMessages]);

  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (
            payload.new.sender_id === selectedUser ||
            payload.new.receiver_id === selectedUser
          ) {
            setMessages((prevMessages) => [
              ...prevMessages,
              payload.new as Message,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user?.id,
      receiver_id: selectedUser,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      fetchMessages();
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setShowUserPopup(false);
    fetchMessages();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-4">
          {/* Users list */}
          <div className="border-r border-gray-200 p-4 space-y-2 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Conversations</h3>
              <button
                onClick={() => setShowUserPopup(true)}
                className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                title="Start a new conversation"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => handleUserSelect(u.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedUser === u.id
                    ? "bg-purple-50 text-purple-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{u.name}</div>
                {u.is_doctor && (
                  <div className="text-sm text-purple-600">Professional</div>
                )}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="col-span-3 flex flex-col h-[600px]">
            {selectedUser ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-sm rounded-lg p-3 ${
                          message.sender_id === user?.id
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.sender.name}
                          {message.sender.is_doctor && " (Professional)"}
                        </div>
                        <div>{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Selection Popup */}
      {showUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Select User</h3>
              <button
                onClick={() => setShowUserPopup(false)}
                className="text-gray-600 hover:text-gray-900"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleUserSelect(u.id)}
                  className="w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-50"
                >
                  <div className="font-medium">{u.name}</div>
                  {u.is_doctor && (
                    <div className="text-sm text-purple-600">Professional</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
