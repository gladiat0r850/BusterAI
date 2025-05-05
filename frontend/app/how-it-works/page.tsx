'use client';

import { FileText, Upload, Search, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Work',
    description: 'Start by pasting your text or uploading images of your homework.',
  },
  {
    icon: Search,
    title: 'AI Analysis',
    description: 'Our AI system analyzes your work for insights, suggestions, and improvements.',
  },
  {
    icon: Download,
    title: 'Get Results',
    description: 'Review detailed feedback and download a comprehensive report.',
  },
];

const faqs = [
  {
    question: 'What kind of images are supported?',
    answer: 'We support PNG, JPG, and GIF formats. Images should be clear and well-lit for best results.',
  },
  {
    question: 'How accurate is the analysis?',
    answer: 'Our AI system provides highly accurate results, but we recommend using it as a supplementary tool alongside traditional learning methods.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data privacy seriously. All uploads are encrypted and automatically deleted after analysis.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">How HWork.AI Works</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get your homework analyzed in three simple steps
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-8 text-center"
              >
                <div className="flex justify-center">
                  <step.icon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-lg p-6 mb-4"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}