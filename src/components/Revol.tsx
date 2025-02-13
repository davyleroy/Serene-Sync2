import React from 'react';
import { Shield, Heart, Users } from 'lucide-react';

export const Revol = () => {
  const stats = [
    {
      icon: <Users className="h-10 w-10 text-purple-600" />,
      number: "10,000+",
      label: "Active Members"
    },
    {
      icon: <Heart className="h-10 w-10 text-purple-600" />,
      number: "24/7",
      label: "Support Available"
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-600" />,
      number: "100%",
      label: "Safe & Secure"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600">Making a difference in mental health, one person at a time.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};