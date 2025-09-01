import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JSONValidator } from '@/components/JSONValidator';
import { SEO } from '@/components/SEO';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

export default function JSONValidatorPage() {
  const [jsonInput, setJsonInput] = useState('');

  return (
    <>
      <SEO 
        title="JSON Validator - Free Online JSON Syntax Checker"
        description="Free online JSON validator to check syntax errors and validate JSON structure. Get detailed analysis and error reports for your JSON data."
        keywords="JSON validator, JSON syntax checker, validate JSON, JSON error checker, JSON lint, free JSON tools"
        url="https://webtool.asrul.dev/validator"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              JSON Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Validate your JSON data for syntax errors and get detailed analysis. 
              Free online JSON validation tool.
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
                textareaId="json-validator-input"
                placeholder="Paste your JSON data here to validate..."
              />
              <div className="h-64 overflow-auto rounded-lg">
                <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: '#f8fafc', color: '#222', fontSize: 14, borderRadius: 8, padding: 16, minHeight: '100%' }}>
                  {jsonInput || '// JSON preview will appear here...'}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Validation Result */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Result</h3>
              <div className="h-96">
                <JSONValidator jsonData={jsonInput} />
              </div>
            </div>
          </div>

          {/* Sample JSON for Testing */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample JSON for Testing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Valid JSON',
                  json: '{"name":"Asrul","age":30,"city":"Indonesia"}'
                },
                {
                  name: 'Invalid JSON (Missing Quote)',
                  json: '{"name":"Asrul,"age":30,"city":"Indonesia"}'
                },
                {
                  name: 'Valid Array',
                  json: '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]'
                },
                {
                  name: 'Invalid JSON (Extra Comma)',
                  json: '{"name":"Asrul","age":30,}'
                }
              ].map((sample, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{sample.name}</h4>
                  <button
                    onClick={() => setJsonInput(sample.json)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Use this sample
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
