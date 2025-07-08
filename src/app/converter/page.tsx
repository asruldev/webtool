'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

export default function ConverterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [convertedOutput, setConvertedOutput] = useState('');
  const [conversionType, setConversionType] = useState<'xml' | 'csv' | 'yaml'>('xml');
  const [error, setError] = useState<string | null>(null);

  const convertToXML = useCallback((jsonData: any, rootName: string = 'root'): string => {
    if (Array.isArray(jsonData)) {
      return `<${rootName}>\n${jsonData.map((item, index) => 
        convertToXML(item, `item${index}`)
      ).join('\n')}\n</${rootName}>`;
    }
    
    if (typeof jsonData === 'object' && jsonData !== null) {
      const xmlParts = Object.entries(jsonData).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return convertToXML(value, key);
        } else {
          return `  <${key}>${value}</${key}>`;
        }
      });
      return `<${rootName}>\n${xmlParts.join('\n')}\n</${rootName}>`;
    }
    
    return `<${rootName}>${jsonData}</${rootName}>`;
  }, []);

  const convertToCSV = useCallback((jsonData: any): string => {
    if (Array.isArray(jsonData)) {
      if (jsonData.length === 0) return '';
      
      const headers = Object.keys(jsonData[0]);
      const csvHeaders = headers.join(',');
      const csvRows = jsonData.map(obj => 
        headers.map(header => {
          const value = obj[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      );
      
      return [csvHeaders, ...csvRows].join('\n');
    }
    
    return 'CSV conversion only supports arrays of objects';
  }, []);

  const convertToYAML = useCallback((jsonData: any, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    
    if (Array.isArray(jsonData)) {
      if (jsonData.length === 0) return '[]';
      return jsonData.map(item => 
        `${spaces}- ${convertToYAML(item, indent + 1)}`
      ).join('\n');
    }
    
    if (typeof jsonData === 'object' && jsonData !== null) {
      const yamlParts = Object.entries(jsonData).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${spaces}${key}:\n${convertToYAML(value, indent + 1)}`;
        } else {
          return `${spaces}${key}: ${value}`;
        }
      });
      return yamlParts.join('\n');
    }
    
    return String(jsonData);
  }, []);

  const handleConvert = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      setError(null);
      
      let output = '';
      switch (conversionType) {
        case 'xml':
          output = convertToXML(parsed);
          break;
        case 'csv':
          output = convertToCSV(parsed);
          break;
        case 'yaml':
          output = convertToYAML(parsed);
          break;
      }
      
      setConvertedOutput(output);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setConvertedOutput('');
    }
  }, [jsonInput, conversionType, convertToXML, convertToCSV, convertToYAML]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  const downloadFile = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              JSON Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convert JSON to XML, CSV, YAML and other formats. 
              Free online JSON conversion tool.
            </p>
          </div>

          {/* Conversion Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Convert to:</label>
                <select
                  value={conversionType}
                  onChange={(e) => setConversionType(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="xml">XML</option>
                  <option value="csv">CSV</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>

              <button
                onClick={handleConvert}
                className="bg-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Convert
              </button>

              <button
                onClick={() => {
                  setJsonInput('');
                  setConvertedOutput('');
                  setError(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Input JSON</h3>
                <button
                  onClick={() => handleCopy(jsonInput)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Copy
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
                textareaId="json-converter-input"
                placeholder="Paste your JSON data here to convert..."
              />
              <div className="h-64 overflow-auto rounded-lg">
                <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: '#f8fafc', color: '#222', fontSize: 14, borderRadius: 8, padding: 16, minHeight: '100%' }}>
                  {jsonInput || '// JSON preview will appear here...'}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Output Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Converted {conversionType.toUpperCase()}
                </h3>
                <div className="flex space-x-2">
                  {convertedOutput && (
                    <>
                      <button
                        onClick={() => handleCopy(convertedOutput)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => downloadFile(convertedOutput, `converted.${conversionType}`)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="h-96 overflow-auto rounded-lg">
                <SyntaxHighlighter
                  language={conversionType === 'xml' ? 'xml' : conversionType === 'csv' ? 'csv' : 'yaml'}
                  style={vscDarkPlus}
                  customStyle={{ background: '#f8fafc', color: '#222', fontSize: 14, borderRadius: 8, padding: 16, minHeight: '100%' }}
                >
                  {convertedOutput || `// Converted ${conversionType.toUpperCase()} will appear here...`}
                </SyntaxHighlighter>
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
                  name: 'Array of Objects',
                  json: '[{"id":1,"name":"Alice","age":25},{"id":2,"name":"Bob","age":30}]'
                },
                {
                  name: 'Nested Object',
                  json: '{"user":{"name":"Asrul","profile":{"email":"asrul@example.com","verified":true}}}'
                },
                {
                  name: 'Complex Data',
                  json: '{"company":"Tech Corp","employees":[{"name":"Alice","skills":["JavaScript","React"]},{"name":"Bob","skills":["Python","Django"]}]}'
                }
              ].map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setJsonInput(sample.json)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
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