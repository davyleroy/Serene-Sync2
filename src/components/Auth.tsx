import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Heart, Stethoscope, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form fields
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, isDoctor);
        await signIn(email, password); // Automatically log in after sign up
      }
      // Navigate based on the user role
      if (isDoctor) {
        navigate("/dashboard/patients");
      } else {
        navigate("/mood");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during authentication"
      );
    } finally {
      setIsLoading(false);
    }
  };

  //  const handleSkipAuth = () => {
  //    navigate("/dashboard");
  //  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Heart className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                required
                title="Name"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              required
              title="Email"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              required
              title="Password"
              placeholder="Enter your password"
            />
          </div>
          {!isLogin && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDoctor"
                checked={isDoctor}
                onChange={(e) => setIsDoctor(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                title="I am a mental health professional"
                placeholder="I am a mental health professional"
              />
              <label
                htmlFor="isDoctor"
                className="flex items-center text-sm text-gray-700"
              >
                I am a mental health professional
                <Stethoscope className="h-4 w-4 ml-1 text-purple-500" />
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              <>{isLogin ? "Sign In" : "Create Account"}</>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="text-purple-600 hover:text-purple-500"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};
