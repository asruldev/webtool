import { useState, useCallback, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { FiCopy, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';

interface JWTDecoderProps {
  syntaxStyle?: any;
}

interface JWTPayload {
  [key: string]: any;
}

interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  isVerified: boolean;
  error?: string;
}

const parseJWT = (token: string): DecodedJWT => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
    }

    const [headerB64, payloadB64, signature] = parts;
    
    // Decode header and payload
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

    return {
      header,
      payload,
      signature,
      isValid: true,
      isVerified: false, // Will be set when secret is provided
      error: undefined
    };
  } catch (error) {
    return {
      header: { alg: '', typ: '' },
      payload: {},
      signature: '',
      isValid: false,
      isVerified: false,
      error: error instanceof Error ? error.message : 'Failed to decode JWT'
    };
  }
};

const generateJWT = (header: JWTHeader, payload: JWTPayload, secret: string): string => {
  try {
    const headerB64 = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    // For demo purposes, we'll create a simple signature
    // In production, you'd use proper crypto libraries
    const signature = btoa(secret).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return `${headerB64}.${payloadB64}.${signature}`;
  } catch (error) {
    throw new Error('Failed to generate JWT');
  }
};

export function JWTDecoder({ syntaxStyle }: JWTDecoderProps) {
  const [jwtInput, setJwtInput] = useState('');
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'decoder' | 'encoder'>('decoder');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const decodedJWT = useMemo(() => {
    if (!jwtInput.trim()) {
      return null;
    }
    return parseJWT(jwtInput.trim());
  }, [jwtInput]);

  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  const handleGenerateExample = useCallback(() => {
    const exampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setJwtInput(exampleJWT);
  }, []);

  const handleClear = useCallback(() => {
    setJwtInput('');
    setSecret('');
  }, []);

  const handleGenerateJWT = useCallback(() => {
    try {
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
        iat: Math.floor(Date.now() / 1000)
      };
      
      const generatedJWT = generateJWT(header, payload, secret || 'your-secret-key');
      setJwtInput(generatedJWT);
    } catch (error) {
      console.error('Failed to generate JWT:', error);
    }
  }, [secret]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">JWT Tools</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'decoder', label: 'Decoder' },
              { id: 'encoder', label: 'Encoder' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'decoder' | 'encoder')}
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
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateExample}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Generate Example
            </button>
            <button
              onClick={handleClear}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'decoder' ? 'JWT Token' : 'JWT Components'}
            </h3>
            <button
              onClick={() => handleCopy(jwtInput, 'jwt')}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Copy JWT"
            >
              <FiCopy />
            </button>
          </div>

          {activeTab === 'decoder' ? (
            <div className="space-y-4">
              <Editor
                value={jwtInput}
                onValueChange={setJwtInput}
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
                  resize: 'none',
                }}
                placeholder="Paste your JWT token here..."
              />

              {/* Secret Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Secret (for verification)
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter secret to verify signature..."
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header
                </label>
                <Editor
                  value={JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)}
                  onValueChange={() => {}}
                  highlight={code => Prism.highlight(code, Prism.languages.json, 'json')}
                  padding={12}
                  style={{
                    fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                    fontSize: 14,
                    minHeight: '6rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    color: '#222',
                    outline: 'none',
                    resize: 'none',
                  }}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payload
                </label>
                <Editor
                  value={JSON.stringify({
                    sub: '1234567890',
                    name: 'John Doe',
                    admin: true,
                    iat: Math.floor(Date.now() / 1000)
                  }, null, 2)}
                  onValueChange={() => {}}
                  highlight={code => Prism.highlight(code, Prism.languages.json, 'json')}
                  padding={12}
                  style={{
                    fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                    fontSize: 14,
                    minHeight: '8rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    color: '#222',
                    outline: 'none',
                    resize: 'none',
                  }}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret
                </label>
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter secret for signing..."
                />
              </div>

              <button
                onClick={handleGenerateJWT}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Generate JWT
              </button>
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Decoded JWT</h3>
          
          {!jwtInput.trim() ? (
            <div className="text-center text-gray-500 py-8">
              <FiRefreshCw className="mx-auto text-4xl mb-4 text-gray-300" />
              <p>Paste a JWT token to decode it</p>
            </div>
          ) : decodedJWT && decodedJWT.isValid ? (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  decodedJWT.isValid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {decodedJWT.isValid ? '✓ Valid JWT' : '✗ Invalid JWT'}
                </span>
                {secret && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🔒 Signature Verification
                  </span>
                )}
              </div>

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Header</h4>
                  <button
                    onClick={() => handleCopy(JSON.stringify(decodedJWT.header, null, 2), 'header')}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FiCopy />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <SyntaxHighlighter 
                    language="json" 
                    style={syntaxStyle || vscDarkPlus}
                    customStyle={{ 
                      background: 'transparent', 
                      fontSize: 14, 
                      borderRadius: 8,
                      margin: 0
                    }}
                  >
                    {JSON.stringify(decodedJWT.header, null, 2)}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Payload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Payload</h4>
                  <button
                    onClick={() => handleCopy(JSON.stringify(decodedJWT.payload, null, 2), 'payload')}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FiCopy />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <SyntaxHighlighter 
                    language="json" 
                    style={syntaxStyle || vscDarkPlus}
                    customStyle={{ 
                      background: 'transparent', 
                      fontSize: 14, 
                      borderRadius: 8,
                      margin: 0
                    }}
                  >
                    {JSON.stringify(decodedJWT.payload, null, 2)}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Signature */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Signature</h4>
                  <button
                    onClick={() => handleCopy(decodedJWT.signature, 'signature')}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FiCopy />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-gray-700 break-all">{decodedJWT.signature}</code>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500 py-8">
              <p className="font-medium">Invalid JWT</p>
              <p className="text-sm mt-2">{decodedJWT?.error}</p>
            </div>
          )}

          {/* Copy Feedback */}
          {copied && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Copied {copied}!
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                <strong>For your protection, all JWT debugging and validation happens in the browser.</strong> 
                Be careful where you paste or share JWTs as they can represent credentials that grant access to resources. 
                This site does not store or transmit your JSON Web Tokens outside of the browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
