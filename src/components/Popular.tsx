import React from 'react';
import { Users, MessageCircle, Activity } from 'lucide-react';

export const Popular = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Supportive Community",
      description: "Connect with others who understand your journey and share similar experiences."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
      title: "Professional Support",
      description: "Access to licensed mental health professionals who can provide guidance when needed."
    },
    {
      icon: <Activity className="h-8 w-8 text-purple-600" />,
      title: "Daily Mood Tracking",
      description: "Track your emotional well-being and identify patterns to better understand yourself."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose MindfulSpace
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-purple-50 rounded-xl">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};