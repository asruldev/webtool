'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JSONTreeView } from '@/components/JSONTreeView';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

export default function TreeViewPage() {
  const [jsonInput, setJsonInput] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              JSON Tree View
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visualize your JSON data in an interactive tree structure. 
              Explore nested objects and arrays with ease.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Input JSON</h3>
                <button
                  onClick={() => setJsonInput('')}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
              <Editor
                value={jsonInput}
                onValueChange={setJsonInput}
                highlight={code => Prism.highlight(code, Prism.languages.json, 'json')}
                padding={16}
                style={{
                  fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                  fontSize: 14,
                  minHeight: '8rem',
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  color: '#222',
                  outline: 'none',
                  marginBottom: 16,
                  resize: 'none',
                }}
                textareaId="json-treeview-input"
                placeholder="Paste your JSON data here to see tree view..."
              />
            </div>

            {/* Tree View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tree View</h3>
              <div className="h-96">
                <JSONTreeView jsonData={jsonInput} />
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tree View Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔷</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Objects</h4>
                <p className="text-sm text-gray-600">Expandable objects with key-value pairs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔶</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Arrays</h4>
                <p className="text-sm text-gray-600">Expandable arrays with indexed items</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Color Coded</h4>
                <p className="text-sm text-gray-600">Different colors for different data types</p>
              </div>
            </div>
          </div>

          {/* Sample JSON for Testing */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample JSON for Testing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Simple Object',
                  json: '{"name":"Asrul","age":30,"city":"Indonesia"}'
                },
                {
                  name: 'Nested Object',
                  json: '{"user":{"name":"Asrul","profile":{"email":"asrul@example.com","verified":true}}}'
                },
                {
                  name: 'Array of Objects',
                  json: '[{"id":1,"name":"Alice","skills":["JavaScript","React"]},{"id":2,"name":"Bob","skills":["Python","Django"]}]'
                },
                {
                  name: 'Complex Structure',
                  json: '{"company":"Tech Corp","departments":{"engineering":{"head":"Mike","employees":[{"name":"Alice","role":"Developer"},{"name":"Bob","role":"Designer"}]},"marketing":{"head":"Lisa","budget":50000}}}'
                }
              ].map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setJsonInput(sample.json)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{sample.name}</h4>
                  <p className="text-sm text-gray-600 font-mono truncate">{sample.json}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 