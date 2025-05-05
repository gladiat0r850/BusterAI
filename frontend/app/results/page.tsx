'use client';

import { Download, RefreshCw, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
          <p className="mt-2 text-gray-600">
            Here&apos;s what we found in your homework
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                <span>Strong argument development in the introduction</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-2" />
                <span>Consider adding more supporting evidence in paragraph 3</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                <span>Effective use of transition sentences</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Grammar & Style
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-2" />
                <div>
                  <p className="font-medium">Run-on sentence detected</p>
                  <p className="text-sm text-gray-600">
                    Consider breaking this sentence into two separate ones for clarity
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                <div>
                  <p className="font-medium">Consistent verb tense</p>
                  <p className="text-sm text-gray-600">
                    Good job maintaining consistent verb tense throughout
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subject Analysis
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Main Topics</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Historical Analysis', 'World War II', 'Economic Impact'].map(
                  (topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-5 w-5" />
            Download Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="mr-2 h-5 w-5" />
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}