import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Edit,
  Trash,
  Share2,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase-client";

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
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [randomPosts, setRandomPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [showOptions, setShowOptions] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    fetchPosts();
    generateRandomPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
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
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedPosts = data.map((post) => ({
        ...post,
        likes: post.likes?.length || 0,
        user_has_liked:
          post.likes?.some(
            (like: { user_id: string }) => like.user_id === user?.id
          ) || false,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPosts = () => {
    const randomPosts = Array.from({ length: 5 }, (_, index) => ({
      id: `random-${index}`,
      content: `This is a randomly generated post #${index + 1}`,
      user_id: `random-user-${index + 1}`,
      created_at: new Date().toISOString(),
      users: {
        name: `Random User ${index + 1}`,
        is_doctor: false,
      },
      likes: Math.floor(Math.random() * 100),
      comments: [],
      user_has_liked: false,
    }));

    setRandomPosts(randomPosts);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const randomUserId = `random-user-${Math.floor(Math.random() * 1000)}`;
      const { data, error } = await supabase
        .from("posts")
        .insert({
          content: newPost.trim(),
          user_id: randomUserId,
        })
        .select(
          `
          *,
          users (name, is_doctor)
        `
        );

      if (error) throw error;

      const newPostData = data[0];
      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const toggleLike = async (
    postId: string,
    currentlyLiked: boolean,
    isRandom: boolean = false
  ) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, post_id: postId });
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: postId });
      }

      if (isRandom) {
        setRandomPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  user_has_liked: !currentlyLiked,
                  likes: currentlyLiked ? post.likes - 1 : post.likes + 1,
                }
              : post
          )
        );
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const addComment = async (postId: string, isRandom: boolean = false) => {
    if (!commentText[postId]?.trim()) return;

    try {
      const randomUserId = `random-user-${Math.floor(Math.random() * 1000)}`;
      const { error } = await supabase.from("comments").insert({
        content: commentText[postId].trim(),
        user_id: randomUserId,
        post_id: postId,
      });

      if (error) throw error;

      setCommentText((prev) => ({ ...prev, [postId]: "" }));

      if (isRandom) {
        setRandomPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: `comment-${Date.now()}`,
                      content: commentText[postId].trim(),
                      user_id: randomUserId,
                      post_id: postId,
                      created_at: new Date().toISOString(),
                      users: {
                        name: `Random User ${Math.floor(Math.random() * 1000)}`,
                        is_doctor: false,
                      },
                    },
                  ],
                }
              : post
          )
        );
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const editPost = async (postId: string) => {
    if (!editingContent.trim()) return;

    try {
      const { error } = await supabase
        .from("posts")
        .update({ content: editingContent.trim() })
        .eq("id", postId);

      if (error) throw error;

      setEditingPostId(null);
      setEditingContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;

      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const sharePost = (postId: string) => {
    // Implement sharing functionality here
    console.log(`Sharing post with ID: ${postId}`);
  };

  const markNotInterested = (postId: string) => {
    // Implement mark not interested functionality here
    console.log(`Marking post with ID: ${postId} as not interested`);
  };

  const toggleOptions = (postId: string) => {
    setShowOptions((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="relative max-w-2xl mx-auto space-y-6 pb-24">
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

      {/* Random Posts */}
      {randomPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-800">
                  {post.users.name}
                </h3>
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
            <div className="relative">
              <button
                className="text-gray-500 hover:text-gray-700"
                title="More options"
                onClick={() => toggleOptions(post.id)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {showOptions[post.id] && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {post.user_id === user?.id ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingPostId(post.id);
                          setEditingContent(post.content);
                          toggleOptions(post.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 mr-2 inline" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deletePost(post.id);
                          toggleOptions(post.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Trash className="h-4 w-4 mr-2 inline" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        markNotInterested(post.id);
                        toggleOptions(post.id);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <XCircle className="h-4 w-4 mr-2 inline" />
                      Not Interested
                    </button>
                  )}
                  <button
                    onClick={() => {
                      sharePost(post.id);
                      toggleOptions(post.id);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4 mr-2 inline" />
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>

          {editingPostId === post.id ? (
            <div className="mb-4">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                rows={3}
                placeholder="Edit your post..."
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingPostId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editPost(post.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-4">{post.content}</p>
          )}

          <div className="flex items-center space-x-6 text-gray-500 mb-4">
            <button
              onClick={() => toggleLike(post.id, post.user_has_liked, true)}
              className={`flex items-center space-x-2 transition-colors ${
                post.user_has_liked
                  ? "text-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  post.user_has_liked ? "fill-current" : ""
                }`}
              />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments */}
          {showComments[post.id] && (
            <div className="space-y-4">
              {post.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="pl-6 border-l-2 border-gray-100"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">
                      {comment.users.name}
                    </span>
                    {comment.users.is_doctor && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                        Professional
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {comment.content}
                  </p>
                </div>
              ))}

              {/* Add Comment */}
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="text"
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                  onKeyPress={(e) => e.key === "Enter" && addComment(post.id)}
                />
                <button
                  onClick={() => addComment(post.id)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Send Comment"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Actual Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-800">
                  {post.users.name}
                </h3>
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
            <div className="relative">
              <button
                className="text-gray-500 hover:text-gray-700"
                title="More options"
                onClick={() => toggleOptions(post.id)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {showOptions[post.id] && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {post.user_id === user?.id ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingPostId(post.id);
                          setEditingContent(post.content);
                          toggleOptions(post.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 mr-2 inline" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deletePost(post.id);
                          toggleOptions(post.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Trash className="h-4 w-4 mr-2 inline" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        markNotInterested(post.id);
                        toggleOptions(post.id);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <XCircle className="h-4 w-4 mr-2 inline" />
                      Not Interested
                    </button>
                  )}
                  <button
                    onClick={() => {
                      sharePost(post.id);
                      toggleOptions(post.id);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4 mr-2 inline" />
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>

          {editingPostId === post.id ? (
            <div className="mb-4">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                rows={3}
                placeholder="Edit your post..."
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingPostId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editPost(post.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-4">{post.content}</p>
          )}

          <div className="flex items-center space-x-6 text-gray-500 mb-4">
            <button
              onClick={() => toggleLike(post.id, post.user_has_liked)}
              className={`flex items-center space-x-2 transition-colors ${
                post.user_has_liked
                  ? "text-purple-600"
                  : "hover:text-purple-600"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  post.user_has_liked ? "fill-current" : ""
                }`}
              />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments */}
          {showComments[post.id] && (
            <div className="space-y-4">
              {post.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="pl-6 border-l-2 border-gray-100"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">
                      {comment.users.name}
                    </span>
                    {comment.users.is_doctor && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                        Professional
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {comment.content}
                  </p>
                </div>
              ))}

              {/* Add Comment */}
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="text"
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                  onKeyPress={(e) => e.key === "Enter" && addComment(post.id)}
                />
                <button
                  onClick={() => addComment(post.id)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Send Comment"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
