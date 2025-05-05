'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain, Sparkles, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Smart Analysis',
    description: 'Get instant feedback on your homework with our advanced AI.',
  },
  {
    icon: Sparkles,
    title: 'Multiple Subjects',
    description: 'Support for math, science, language arts, and more.',
  },
  {
    icon: Clock,
    title: 'Quick Results',
    description: 'Receive detailed explanations in seconds.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your data is always protected and private.',
  },
];

export default function Home() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl"
            >
              Homework Help,
              <span className="text-blue-600"> Powered by AI</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Get instant help with your homework using our advanced AI. Upload your
              questions and receive detailed explanations in seconds.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex justify-center gap-4"
            >
              <Link
                href="/chat"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Start Chat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Buster.AI?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the future of homework help with our powerful features
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="inline-flex p-3 rounded-lg bg-blue-600 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-semibold text-gray-900 text-center">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of students already using Buster.AI
            </p>
            <div className="mt-8">
              <Link
                href="/chat"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Try it for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}