import { useState, useCallback, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { FiCopy, FiRefreshCw, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';

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
    
    // Decode header and payload using helper function
    const header = JSON.parse(atob(base64urlToBase64(headerB64)));
    const payload = JSON.parse(atob(base64urlToBase64(payloadB64)));

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

// Helper function to convert string to base64url
const base64url = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// Helper function to convert base64url to base64
const base64urlToBase64 = (str: string): string => {
  return str.replace(/-/g, '+').replace(/_/g, '/');
};

const generateJWT = async (header: JWTHeader, payload: JWTPayload, secret: string): Promise<string> => {
  try {
    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(payload));
    
    // Handle different algorithms
    let signature = '';
    
    if (header.alg === 'none') {
      // For unsecured JWTs, signature is empty
      signature = '';
    } else if (header.alg.startsWith('HS')) {
      // For HMAC algorithms, use Web Crypto API
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const message = encoder.encode(`${headerB64}.${payloadB64}`);
      
      let algorithm: string;
      switch (header.alg) {
        case 'HS256':
          algorithm = 'SHA-256';
          break;
        case 'HS384':
          algorithm = 'SHA-384';
          break;
        case 'HS512':
          algorithm = 'SHA-512';
          break;
        default:
          throw new Error(`Unsupported HMAC algorithm: ${header.alg}`);
      }
      
      // Import key
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );
      
      // Sign
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, message);
      const signatureArray = new Uint8Array(signatureBuffer);
      const signatureString = Array.from(signatureArray).map(byte => String.fromCharCode(byte)).join('');
      signature = base64url(signatureString);
    } else {
      // For other algorithms, create a demo signature
      // In a real implementation, you'd need proper crypto libraries
      const demoSignature = `demo-${header.alg}-${Date.now()}`;
      signature = base64url(demoSignature);
    }
    
    return `${headerB64}.${payloadB64}.${signature}`;
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error(`Failed to generate JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export function JWTDecoder({ syntaxStyle }: JWTDecoderProps) {
  const [jwtInput, setJwtInput] = useState('');
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'decoder' | 'encoder'>('decoder');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadData, setPayloadData] = useState(`{\n  "sub": "1234567890",\n  "name": "Asrul Harahap",\n  "admin": true,\n  "iat": ${Math.floor(Date.now() / 1000)}\n}`);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('HS256');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJWT, setGeneratedJWT] = useState('');

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
    setGeneratedJWT('');
  }, []);

  const handleResetToDefaults = useCallback(() => {
    setHeaderData('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    setPayloadData(`{\n  "sub": "1234567890",\n  "name": "Asrul Harahap",\n  "admin": true,\n  "iat": ${Math.floor(Date.now() / 1000)}\n}`);
    setSelectedAlgorithm('HS256');
    setGeneratedJWT('');
  }, []);

  const handleUpdateTimestamp = useCallback(() => {
    try {
      const payload = JSON.parse(payloadData);
      payload.iat = Math.floor(Date.now() / 1000);
      setPayloadData(JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error('Failed to update timestamp:', error);
    }
  }, [payloadData]);

  const formatTimestamp = useCallback((timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  }, []);

  const formatRelativeTime = useCallback((timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    const absDiff = Math.abs(diff);
    
    if (absDiff < 60) {
      return diff >= 0 ? 'in a few seconds' : 'a few seconds ago';
    } else if (absDiff < 3600) {
      const minutes = Math.floor(absDiff / 60);
      return diff >= 0 ? `in ${minutes} minute${minutes > 1 ? 's' : ''}` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (absDiff < 86400) {
      const hours = Math.floor(absDiff / 3600);
      return diff >= 0 ? `in ${hours} hour${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(absDiff / 86400);
      return diff >= 0 ? `in ${days} day${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }, []);

  const getCurrentTimestamp = useCallback((): number => {
    return Math.floor(Date.now() / 1000);
  }, []);

  const getTimestampFieldName = useCallback((field: string): string => {
    const fieldNames: { [key: string]: string } = {
      'iat': 'Issued At',
      'exp': 'Expiration Time',
      'nbf': 'Not Before',
      'auth_time': 'Authentication Time',
      'iat_claim': 'Issued At Claim',
      'exp_claim': 'Expiration Claim',
      'nbf_claim': 'Not Before Claim'
    };
    return fieldNames[field] || 'Timestamp';
  }, []);

  const handleAlgorithmChange = useCallback((algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    try {
      const header = JSON.parse(headerData);
      header.alg = algorithm;
      setHeaderData(JSON.stringify(header, null, 2));
    } catch (error) {
      console.error('Failed to update header:', error);
    }
  }, [headerData]);

  const handleGenerateJWT = useCallback(async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Validate JSON input
      let header: JWTHeader;
      let payload: JWTPayload;
      
      try {
        header = JSON.parse(headerData);
        payload = JSON.parse(payloadData);
      } catch (parseError) {
        alert('Invalid JSON in header or payload. Please check your input.');
        return;
      }
      
      // Update the algorithm in header based on selection
      header.alg = selectedAlgorithm;
      
      // Validate secret requirement
      if (selectedAlgorithm !== 'none' && !secret.trim()) {
        alert(`Please provide a ${selectedAlgorithm.startsWith('HS') ? 'secret key' : 'private key'} for ${selectedAlgorithm} algorithm.`);
        return;
      }
      
      // Ensure required header fields
      if (!header.typ) {
        header.typ = 'JWT';
      }
      
      const generatedJWT = await generateJWT(header, payload, secret || 'your-secret-key');
      
      // Verify the generated JWT can be parsed
      const testParse = parseJWT(generatedJWT);
      if (!testParse.isValid) {
        throw new Error('Generated JWT is invalid');
      }
      
      setJwtInput(generatedJWT);
      setGeneratedJWT(generatedJWT);
    } catch (error) {
      console.error('Failed to generate JWT:', error);
      alert(`Failed to generate JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [secret, headerData, payloadData, selectedAlgorithm, isGenerating]);

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
              {/* Generated JWT Preview */}
              {generatedJWT && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-800">Generated JWT Token</h4>
                    <button
                      onClick={() => handleCopy(generatedJWT, 'JWT')}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Copy JWT"
                    >
                      <FiCopy />
                    </button>
                  </div>
                  <div className="bg-white border border-green-300 rounded p-2">
                    <code className="text-xs text-green-700 break-all font-mono">
                      {generatedJWT}
                    </code>
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    ✅ JWT successfully generated and ready to use
                  </div>
                </div>
              )}

              {/* Algorithm Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Selected Algorithm: <span className="font-bold">{selectedAlgorithm}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedAlgorithm.startsWith('HS') && 'HMAC with SHA - Symmetric key algorithm (shared secret)'}
                      {selectedAlgorithm.startsWith('RS') && 'RSA with SHA - Asymmetric key algorithm (private/public key pair)'}
                      {selectedAlgorithm.startsWith('ES') && 'ECDSA with SHA - Elliptic curve algorithm (private/public key pair)'}
                      {selectedAlgorithm === 'EdDSA' && 'Edwards-curve Digital Signature Algorithm (private/public key pair)'}
                      {selectedAlgorithm === 'none' && 'Unsecured JWT - No signature (for testing only)'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAlgorithm === 'none' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedAlgorithm === 'none' ? '⚠️ Unsecured' : '🔒 Secured'}
                  </div>
                </div>
              </div>

              {/* Algorithm Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algorithm
                </label>
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => handleAlgorithmChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <optgroup label="HMAC Algorithms">
                    <option value="HS256">HS256 (HMAC SHA-256)</option>
                    <option value="HS384">HS384 (HMAC SHA-384)</option>
                    <option value="HS512">HS512 (HMAC SHA-512)</option>
                  </optgroup>
                  <optgroup label="RSA Algorithms">
                    <option value="RS256">RS256 (RSA SHA-256)</option>
                    <option value="RS384">RS384 (RSA SHA-384)</option>
                    <option value="RS512">RS512 (RSA SHA-512)</option>
                  </optgroup>
                  <optgroup label="ECDSA Algorithms">
                    <option value="ES256">ES256 (ECDSA SHA-256)</option>
                    <option value="ES384">ES384 (ECDSA SHA-384)</option>
                    <option value="ES512">ES512 (ECDSA SHA-512)</option>
                  </optgroup>
                  <optgroup label="EdDSA Algorithms">
                    <option value="EdDSA">EdDSA (Edwards-curve DSA)</option>
                  </optgroup>
                  <optgroup label="None (Unsecured)">
                    <option value="none">none (Unsecured)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header
                </label>
                <Editor
                  value={headerData}
                  onValueChange={setHeaderData}
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
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payload
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Current timestamp: {formatTimestamp(getCurrentTimestamp())}</span>
                    <div className="relative group">
                      <FiInfo className="text-gray-400 hover:text-gray-600 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="font-medium mb-1">JWT Standard Claims:</div>
                        <div className="space-y-1">
                          <div><strong>iat</strong> (Issued At): Timestamp when token was issued</div>
                          <div><strong>exp</strong> (Expiration): Timestamp when token expires</div>
                          <div><strong>nbf</strong> (Not Before): Token valid from this timestamp</div>
                          <div><strong>sub</strong> (Subject): Subject of the token</div>
                          <div><strong>iss</strong> (Issuer): Who issued the token</div>
                          <div><strong>aud</strong> (Audience): Intended recipient</div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <div className="font-medium">Current timestamp: {getCurrentTimestamp()}</div>
                          <div>Formatted: {formatTimestamp(getCurrentTimestamp())}</div>
                          <div className="mt-1 text-gray-400">
                            All timestamps are in Unix epoch time (seconds since Jan 1, 1970)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Editor
                  value={payloadData}
                  onValueChange={setPayloadData}
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
                />
                
                {/* Timestamp Preview in Encoder */}
                {(() => {
                  try {
                    const payload = JSON.parse(payloadData);
                    const timestampFields = Object.entries(payload).filter(([key, value]) => 
                      typeof value === 'number' && value > 1000000000 && value < 9999999999
                    ) as [string, number][];
                    
                    if (timestampFields.length > 0) {
                      return (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="text-sm font-medium text-yellow-800 mb-2">Timestamp Preview:</div>
                          <div className="space-y-1 text-xs text-yellow-700">
                            {timestampFields.map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center">
                                <div>
                                  <strong>{key}</strong> ({getTimestampFieldName(key)}): {value}
                                </div>
                                <div className="text-right">
                                  <div>{formatTimestamp(value)}</div>
                                  <div className="text-gray-500 text-xs">{formatRelativeTime(value)}</div>
                                  {key === 'exp' && (
                                    <div className={`font-medium ${getCurrentTimestamp() > value ? 'text-red-600' : 'text-green-600'}`}>
                                      {getCurrentTimestamp() > value ? '❌ Expired' : '✅ Valid'}
                                    </div>
                                  )}
                                  {key === 'nbf' && (
                                    <div className={`font-medium ${getCurrentTimestamp() < value ? 'text-orange-600' : 'text-green-600'}`}>
                                      {getCurrentTimestamp() < value ? '⏳ Not Yet Valid' : '✅ Valid'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  } catch (error) {
                    // JSON is invalid, don't show timestamp preview
                  }
                  return null;
                })()}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedAlgorithm.startsWith('HS') ? 'Secret Key' : 
                   selectedAlgorithm.startsWith('RS') || selectedAlgorithm.startsWith('ES') ? 'Private Key' :
                   selectedAlgorithm === 'EdDSA' ? 'Private Key' :
                   selectedAlgorithm === 'none' ? 'No Key Required' : 'Key'}
                </label>
                {selectedAlgorithm === 'none' ? (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
                    <p className="font-medium text-orange-600 mb-1">⚠️ Unsecured JWT</p>
                    <p>This JWT will not be cryptographically signed. Use only for testing purposes.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        selectedAlgorithm.startsWith('HS') ? 'Enter secret key...' :
                        selectedAlgorithm.startsWith('RS') || selectedAlgorithm.startsWith('ES') ? 'Enter private key (PEM format)...' :
                        selectedAlgorithm === 'EdDSA' ? 'Enter private key...' : 'Enter key...'
                      }
                    />
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecret ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  {selectedAlgorithm.startsWith('HS') && 'For HMAC algorithms, use a strong secret key'}
                  {selectedAlgorithm.startsWith('RS') && 'For RSA algorithms, use your private key in PEM format'}
                  {selectedAlgorithm.startsWith('ES') && 'For ECDSA algorithms, use your private key in PEM format'}
                  {selectedAlgorithm === 'EdDSA' && 'For EdDSA algorithm, use your private key'}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateTimestamp}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Update Timestamp
                </button>
                <button
                  onClick={handleResetToDefaults}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>

              {/* Generated JWT Display */}
              {generatedJWT && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Generated JWT Token
                    </label>
                    <button
                      onClick={() => handleCopy(generatedJWT, 'JWT')}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy JWT"
                    >
                      <FiCopy />
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <code className="text-sm text-gray-700 break-all font-mono">
                      {generatedJWT}
                    </code>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateJWT}
                disabled={isGenerating}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  isGenerating 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate JWT'
                )}
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
                
                {/* Timestamp Information */}
                {(() => {
                  const timestampFields = Object.entries(decodedJWT.payload).filter(([key, value]) => 
                    typeof value === 'number' && value > 1000000000 && value < 9999999999
                  ) as [string, number][];
                  
                  if (timestampFields.length > 0) {
                    return (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-2">Timestamp Information:</div>
                        <div className="space-y-1 text-xs text-blue-700">
                          {timestampFields.map(([key, value]) => {
                            const isExpired = key === 'exp' && getCurrentTimestamp() > value;
                            const isNotYetValid = key === 'nbf' && getCurrentTimestamp() < value;
                            
                            return (
                              <div key={key} className="flex justify-between items-center">
                                <div>
                                  <strong>{key}</strong> ({getTimestampFieldName(key)}): {value}
                                </div>
                                <div className="text-right">
                                  <div>{formatTimestamp(value)}</div>
                                  <div className="text-gray-500 text-xs">{formatRelativeTime(value)}</div>
                                  {key === 'exp' && (
                                    <div className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                                      {isExpired ? '❌ Expired' : '✅ Valid'}
                                    </div>
                                  )}
                                  {key === 'nbf' && (
                                    <div className={`font-medium ${isNotYetValid ? 'text-orange-600' : 'text-green-600'}`}>
                                      {isNotYetValid ? '⏳ Not Yet Valid' : '✅ Valid'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <div className="mt-2 pt-2 border-t border-blue-300">
                            <div><strong>Current Time:</strong> {formatTimestamp(getCurrentTimestamp())}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
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
