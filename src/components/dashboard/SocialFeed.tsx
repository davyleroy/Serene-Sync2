import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase-client';

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  users: {
    name: string;
    is_doctor: boolean;
  };
  likes: number;
  comments: Comment[];
  user_has_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  users: {
    name: string;
    is_doctor: boolean;
  };
}

export const SocialFeed = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (name, is_doctor),
          comments (
            id,
            content,
            user_id,
            created_at,
            users (name, is_doctor)
          ),
          likes (user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data.map(post => ({
        ...post,
        likes: post.likes?.length || 0,
        user_has_liked: post.likes?.some((like: any) => like.user_id === user?.id) || false
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: newPost.trim(),
          user_id: user.id
        });

      if (error) throw error;

      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, post_id: postId });
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, post_id: postId });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!commentText[postId]?.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: commentText[postId].trim(),
          user_id: user.id,
          post_id: postId
        });

      if (error) throw error;

      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={createPost}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-800">{post.users.name}</h3>
                {post.users.is_doctor && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                    Professional
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{post.content}</p>

          <div className="flex items-center space-x-6 text-gray-500 mb-4">
            <button
              onClick={() => toggleLike(post.id, post.user_has_liked)}
              className={`flex items-center space-x-2 transition-colors ${
                post.user_has_liked ? 'text-purple-600' : 'hover:text-purple-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${post.user_has_liked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="pl-6 border-l-2 border-gray-100">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">{comment.users.name}</span>
                  {comment.users.is_doctor && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                      Professional
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
              </div>
            ))}

            {/* Add Comment */}
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                value={commentText[post.id] || ''}
                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
              />
              <button
                onClick={() => addComment(post.id)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};