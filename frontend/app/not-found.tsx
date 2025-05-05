'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, XCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            transition: { duration: 1, repeat: Infinity },
          }}
        >
          <XCircle className="mx-auto h-24 w-24 text-red-500" />
        </motion.div>
        <h1 className="mt-8 text-4xl font-bold text-gray-900">Oops!</h1>
        <p className="mt-4 text-xl text-gray-600">
          This page seems to be missing.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}