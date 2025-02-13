import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero2 } from './Hero2';
import { Popular } from './Popular';
import { Revol } from './Revol';

const quotes = [
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400"
  }
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Journey to <span className="text-purple-600">Mental Wellness</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our supportive community where you can share, heal, and grow together. Professional guidance meets peer support in a safe, understanding space.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <Hero2 />
      <Popular />
      <Revol />

      {/* Quotes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Inspiring Voices
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {quotes.map((quote, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
              <img
                src={quote.image}
                alt={`Portrait ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-gray-800 text-lg mb-4 font-medium italic">"{quote.text}"</p>
                <p className="text-purple-600 font-medium">- {quote.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};