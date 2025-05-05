'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  Calculator,
  BookOpen,
  Microscope,
  Languages,
  Clock,
  Shield,
  History,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description:
      'Get instant, accurate feedback on your homework using advanced artificial intelligence.',
  },
  {
    icon: Calculator,
    title: 'Math Support',
    description:
      'Step-by-step solutions for algebra, calculus, geometry, and more.',
  },
  {
    icon: BookOpen,
    title: 'Essay Review',
    description:
      'Grammar checks, style suggestions, and structural improvements for your writing.',
  },
  {
    icon: Microscope,
    title: 'Science Help',
    description:
      'Clear explanations for physics, chemistry, and biology concepts.',
  },
  {
    icon: Languages,
    title: 'Language Learning',
    description:
      'Support for multiple languages including Spanish, French, and German.',
  },
  {
    icon: Clock,
    title: 'Quick Results',
    description:
      'Get answers within seconds, not minutes. Perfect for last-minute studying.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Your data is encrypted and secure. We never share your information.',
  },
  {
    icon: History,
    title: 'Chat History',
    description:
      'Access your past conversations and solutions whenever you need them.',
  },
];

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-900"
          >
            Powerful Features for Better Learning
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-600"
          >
            Everything you need to excel in your studies
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}