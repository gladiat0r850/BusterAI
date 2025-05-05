'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does Buster help with my homework?',
    answer: 'Buster uses advanced AI to analyze your homework questions and provide detailed explanations and solutions. It can help with math problems, essay writing, science concepts, and more.'
  },
  {
    question: 'What subjects does Buster support?',
    answer: 'Buster supports a wide range of subjects including mathematics, science (physics, chemistry, biology), language arts, history, geography, foreign languages, and more.'
  },
  {
    question: 'Is my data secure on Buster?',
    answer: 'Absolutely. We take data privacy seriously. All information shared with Buster is encrypted and we do not store your homework assignments beyond what is needed to provide our service.'
  },
  {
    question: 'Can Buster help with college-level coursework?',
    answer: 'Yes, Buster is designed to assist with homework from elementary school through college-level coursework.'
  },
  {
    question: 'How much does Buster cost?',
    answer: 'Buster offers both free and premium plans. The free plan allows a limited number of questions per day while premium plans offer unlimited questions and additional features.'
  },
  {
    question: 'How accurate are the solutions provided by Buster?',
    answer: 'Buster strives for high accuracy in all responses. However, it\'s always good practice to verify important answers, especially for crucial assignments or exams.'
  },
  {
    question: 'Does using Buster count as cheating?',
    answer: 'Buster is designed as a learning aid to help you understand concepts and check your work. We encourage using Buster as a tutoring tool rather than simply copying answers.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions about Buster
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Still have questions?
          </h2>
          <p className="mt-2 text-gray-600">
            If you couldn&apos;t find the answer you were looking for, please contact us.
          </p>
          <div className="mt-4">
            <a
              href="/contact"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}