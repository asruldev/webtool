'use client';

import { useState, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { JSONTreeView } from './JSONTreeView';
import { JSONValidator } from './JSONValidator';

interface JSONFormatterProps {
  SyntaxHighlighter?: typeof SyntaxHighlighter;
  syntaxStyle?: any;
}

export function JSONFormatter({ SyntaxHighlighter, syntaxStyle }: JSONFormatterProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [indentation, setIndentation] = useState(2);
  const [activeTab, setActiveTab] = useState<'formatter' | 'tree' | 'validator'>('formatter');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJSON = useCallback((input: string, spaces: number = 2) => {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, spaces);
    } catch (err) {
      throw new Error('Invalid JSON format');
    }
  }, []);

  const handleFormat = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const formatted = formatJSON(jsonInput, indentation);
      setFormattedJson(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setIsValid(false);
    }
  }, [jsonInput, indentation, formatJSON]);

  const handleMinify = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setIsValid(false);
    }
  }, [jsonInput]);

  const handleClear = useCallback(() => {
    setJsonInput('');
    setFormattedJson('');
    setError(null);
    setIsValid(null);
  }, []);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
      };
      reader.readAsText(file);
    }
  }, []);

  const downloadJSON = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    // Ensure JSON grammar is loaded for PrismJS
    if (!Prism.languages.json) {
      // @ts-ignore
      import('prismjs/components/prism-json').catch(console.error);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">JSON Tools</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'formatter', label: 'Formatter' },
              { id: 'tree', label: 'Tree View' },
              { id: 'validator', label: 'Validator' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Indentation:</label>
            <select
              value={indentation}
              onChange={(e) => setIndentation(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 spaces</option>
              <option value={3}>3 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleFormat}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Format JSON
            </button>
            <button
              onClick={handleMinify}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Minify
            </button>
            <button
              onClick={handleClear}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex space-x-2">
            <label className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer">
              Upload File
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => downloadJSON(formattedJson || jsonInput, 'formatted.json')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Success Display */}
      {isValid && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800">JSON is valid and formatted successfully!</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Input JSON</h3>
            <button
              onClick={() => handleCopy(jsonInput)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Copy
            </button>
          </div>
          <Editor
            value={jsonInput}
            onValueChange={setJsonInput}
            highlight={code =>
              Prism.languages.json
                ? Prism.highlight(code, Prism.languages.json, 'json')
                : code
            }
            padding={16}
            style={{
              fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
              fontSize: 14,
              minHeight: '24rem',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              color: '#222',
              outline: 'none',
              marginBottom: 16,
              resize: 'none',
            }}
            textareaId="json-formatter-input"
            placeholder="Paste your JSON data here..."
          />
        </div>

        {/* Output Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'formatter' && 'Formatted JSON'}
              {activeTab === 'tree' && 'Tree View'}
              {activeTab === 'validator' && 'Validation Result'}
            </h3>
            {activeTab === 'formatter' && formattedJson && (
              <button
                onClick={() => handleCopy(formattedJson)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Copy
              </button>
            )}
          </div>
          
          <div className="h-96 overflow-auto">
            {activeTab === 'formatter' && (
              SyntaxHighlighter ? (
                <SyntaxHighlighter language="json" style={syntaxStyle} customStyle={{ background: '#f8fafc', color: '#222', fontSize: 14, borderRadius: 8, padding: 16, minHeight: '100%' }}>
                  {formattedJson || 'Formatted JSON will appear here...'}
                </SyntaxHighlighter>
              ) : (
                <pre className="w-full h-full p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm overflow-auto">
                  {formattedJson || 'Formatted JSON will appear here...'}
                </pre>
              )
            )}
            
            {activeTab === 'tree' && (
              <JSONTreeView jsonData={jsonInput} />
            )}
            
            {activeTab === 'validator' && (
              <JSONValidator jsonData={jsonInput} />
            )}
          </div>
        </div>
      </div>

      {/* Sample JSON */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample JSON</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Simple Object',
              json: '{"name":"Asrul","age":30,"city":"Indonesia"}'
            },
            {
              name: 'Array Example',
              json: '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]'
            },
            {
              name: 'Nested Object',
              json: '{"user":{"name":"Asrul","profile":{"email":"asrul@example.com","verified":true}}}'
            },
            {
              name: 'Complex Example',
              json: '{"company":"Tech Corp","employees":[{"name":"Alice","skills":["JavaScript","React"]},{"name":"Bob","skills":["Python","Django"]}]}'
            }
          ].map((sample, index) => (
            <button
              key={index}
              onClick={() => setJsonInput(sample.json)}
              className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">{sample.name}</h4>
              <p className="text-sm text-gray-600 font-mono truncate">{sample.json}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 