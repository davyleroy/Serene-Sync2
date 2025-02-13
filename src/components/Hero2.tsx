import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero2 = () => {
  return (
    <section className="bg-gradient-to-br from-purple-100 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Begin Your Journey to <span className="text-purple-600">Better Mental Health</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our platform provides a safe space for you to express yourself, connect with others, and receive professional support when needed. Start your journey today.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Join Our Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=400"
              alt="Meditation"
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
              alt="Support Group"
              className="rounded-lg shadow-lg w-full h-48 object-cover mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};