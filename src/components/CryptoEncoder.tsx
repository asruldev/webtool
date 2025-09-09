import { useState, useCallback, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { FiCopy, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import CryptoJS from 'crypto-js';

interface CryptoEncoderProps {
  // Props can be added here if needed in the future
}

interface CryptoResult {
  input: string;
  secret: string;
  algorithm: string;
  result: string;
  isValid: boolean;
  error?: string;
}

const createSignatureSHA256 = (message: string, secret: string): string => {
  try {
    const hmac = CryptoJS.HmacSHA256(message, secret);
    return hmac.toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to generate HMAC: ', err);
    return '';
  }
};

const createSignatureSHA1 = (message: string, secret: string): string => {
  try {
    const hmac = CryptoJS.HmacSHA1(message, secret);
    return hmac.toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to generate HMAC: ', err);
    return '';
  }
};

const createSignatureSHA512 = (message: string, secret: string): string => {
  try {
    const hmac = CryptoJS.HmacSHA512(message, secret);
    return hmac.toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to generate HMAC: ', err);
    return '';
  }
};

const createSignatureMD5 = (message: string, secret: string): string => {
  try {
    const hmac = CryptoJS.HmacMD5(message, secret);
    return hmac.toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to generate HMAC: ', err);
    return '';
  }
};

const encryptAES = (message: string, secret: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(message, secret).toString();
    return encrypted;
  } catch (err) {
    console.error('Failed to encrypt: ', err);
    return '';
  }
};

const decryptAES = (encryptedMessage: string, secret: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, secret);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Failed to decrypt: ', err);
    return '';
  }
};

const hashSHA256 = (message: string): string => {
  try {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to hash: ', err);
    return '';
  }
};

const hashSHA1 = (message: string): string => {
  try {
    return CryptoJS.SHA1(message).toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to hash: ', err);
    return '';
  }
};

const hashMD5 = (message: string): string => {
  try {
    return CryptoJS.MD5(message).toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error('Failed to hash: ', err);
    return '';
  }
};

const base64Encode = (message: string): string => {
  try {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(message));
  } catch (err) {
    console.error('Failed to encode: ', err);
    return '';
  }
};

const base64Decode = (encodedMessage: string): string => {
  try {
    return CryptoJS.enc.Base64.parse(encodedMessage).toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Failed to decode: ', err);
    return '';
  }
};

export function CryptoEncoder({}: CryptoEncoderProps) {
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('asrulganteng');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('HMAC-SHA256');

  const cryptoResult = useMemo((): CryptoResult => {
    if (!input.trim()) {
      return {
        input: '',
        secret: '',
        algorithm: '',
        result: '',
        isValid: false,
        error: 'Please enter input text'
      };
    }

    try {
      let result = '';
      let isValid = true;
      let error = '';

      switch (selectedAlgorithm) {
        case 'HMAC-SHA256':
          result = createSignatureSHA256(input, secret);
          break;
        case 'HMAC-SHA1':
          result = createSignatureSHA1(input, secret);
          break;
        case 'HMAC-SHA512':
          result = createSignatureSHA512(input, secret);
          break;
        case 'HMAC-MD5':
          result = createSignatureMD5(input, secret);
          break;
        case 'AES-Encrypt':
          result = encryptAES(input, secret);
          break;
        case 'AES-Decrypt':
          result = decryptAES(input, secret);
          if (!result) {
            isValid = false;
            error = 'Failed to decrypt. Check your secret key or encrypted data.';
          }
          break;
        case 'SHA256':
          result = hashSHA256(input);
          break;
        case 'SHA1':
          result = hashSHA1(input);
          break;
        case 'MD5':
          result = hashMD5(input);
          break;
        case 'Base64-Encode':
          result = base64Encode(input);
          break;
        case 'Base64-Decode':
          result = base64Decode(input);
          if (!result) {
            isValid = false;
            error = 'Failed to decode. Check if input is valid Base64.';
          }
          break;
        default:
          result = '';
          isValid = false;
          error = 'Unknown algorithm';
      }

      return {
        input,
        secret,
        algorithm: selectedAlgorithm,
        result,
        isValid,
        error
      };
    } catch (error) {
      return {
        input,
        secret,
        algorithm: selectedAlgorithm,
        result: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [input, secret, selectedAlgorithm]);

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
    setInput('1757145068');
    setSecret('asrulganteng');
    setSelectedAlgorithm('HMAC-SHA256');
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const handleResetToDefaults = useCallback(() => {
    setSecret('asrulganteng');
    setSelectedAlgorithm('HMAC-SHA256');
  }, []);

  const getAlgorithmDescription = (algorithm: string): string => {
    const descriptions: { [key: string]: string } = {
      'HMAC-SHA256': 'HMAC with SHA-256 - Secure message authentication code',
      'HMAC-SHA1': 'HMAC with SHA-1 - Message authentication code (less secure)',
      'HMAC-SHA512': 'HMAC with SHA-512 - Strong message authentication code',
      'HMAC-MD5': 'HMAC with MD5 - Message authentication code (not recommended)',
      'AES-Encrypt': 'AES Encryption - Advanced Encryption Standard',
      'AES-Decrypt': 'AES Decryption - Decrypt AES encrypted data',
      'SHA256': 'SHA-256 Hash - Secure hash function',
      'SHA1': 'SHA-1 Hash - Hash function (less secure)',
      'MD5': 'MD5 Hash - Hash function (not secure)',
      'Base64-Encode': 'Base64 Encoding - Binary to text encoding',
      'Base64-Decode': 'Base64 Decoding - Text to binary decoding'
    };
    return descriptions[algorithm] || 'Unknown algorithm';
  };

  const requiresSecret = (algorithm: string): boolean => {
    return algorithm.startsWith('HMAC-') || algorithm.startsWith('AES-');
  };


  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Crypto Encoder/Decoder</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'encode', label: 'Encode' },
              { id: 'decode', label: 'Decode' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'encode' | 'decode')}
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
            <button
              onClick={handleResetToDefaults}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Reset Defaults
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
              {activeTab === 'encode' ? 'Input Text' : 'Encrypted/Encoded Text'}
            </h3>
            <button
              onClick={() => handleCopy(input, 'input')}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Copy Input"
            >
              <FiCopy />
            </button>
          </div>

          <div className="space-y-4">
            <Editor
              value={input}
              onValueChange={setInput}
              highlight={code => Prism.highlight(code, Prism.languages.text, 'text')}
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
              placeholder={activeTab === 'encode' ? 'Enter text to encode/encrypt...' : 'Enter encrypted/encoded text to decode...'}
            />

            {/* Algorithm Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <optgroup label="HMAC Algorithms">
                  <option value="HMAC-SHA256">HMAC-SHA256</option>
                  <option value="HMAC-SHA1">HMAC-SHA1</option>
                  <option value="HMAC-SHA512">HMAC-SHA512</option>
                  <option value="HMAC-MD5">HMAC-MD5</option>
                </optgroup>
                <optgroup label="AES Encryption">
                  <option value="AES-Encrypt">AES Encrypt</option>
                  <option value="AES-Decrypt">AES Decrypt</option>
                </optgroup>
                <optgroup label="Hash Functions">
                  <option value="SHA256">SHA-256</option>
                  <option value="SHA1">SHA-1</option>
                  <option value="MD5">MD5</option>
                </optgroup>
                <optgroup label="Base64 Encoding">
                  <option value="Base64-Encode">Base64 Encode</option>
                  <option value="Base64-Decode">Base64 Decode</option>
                </optgroup>
              </select>
              <div className="mt-2 text-xs text-gray-500">
                {getAlgorithmDescription(selectedAlgorithm)}
              </div>
            </div>

            {/* Secret Input */}
            {requiresSecret(selectedAlgorithm) && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter secret key..."
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedAlgorithm.startsWith('HMAC-') && 'For HMAC algorithms, use a strong secret key'}
                  {selectedAlgorithm.startsWith('AES-') && 'For AES encryption, use a strong secret key'}
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
                    {getAlgorithmDescription(selectedAlgorithm)}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  requiresSecret(selectedAlgorithm) ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {requiresSecret(selectedAlgorithm) ? '🔒 Requires Secret' : '🔓 No Secret'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'encode' ? 'Encoded/Encrypted Result' : 'Decoded/Decrypted Result'}
            </h3>
            {cryptoResult.result && (
              <button
                onClick={() => handleCopy(cryptoResult.result, 'result')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Copy Result"
              >
                <FiCopy />
              </button>
            )}
          </div>
          
          {!input.trim() ? (
            <div className="text-center text-gray-500 py-8">
              <FiShield className="mx-auto text-4xl mb-4 text-gray-300" />
              <p>Enter text to {activeTab === 'encode' ? 'encode/encrypt' : 'decode/decrypt'}</p>
            </div>
          ) : cryptoResult.isValid ? (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ {activeTab === 'encode' ? 'Encoded' : 'Decoded'} Successfully
                </span>
                {requiresSecret(selectedAlgorithm) && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🔒 Using Secret Key
                  </span>
                )}
              </div>

              {/* Result */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-gray-700 break-all font-mono whitespace-pre-wrap">
                    {cryptoResult.result}
                  </code>
                </div>
              </div>

              {/* Algorithm Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Algorithm Details:</div>
                  <div className="space-y-1 text-xs">
                    <div><strong>Algorithm:</strong> {cryptoResult.algorithm}</div>
                    <div><strong>Input Length:</strong> {cryptoResult.input.length} characters</div>
                    <div><strong>Output Length:</strong> {cryptoResult.result.length} characters</div>
                    {requiresSecret(selectedAlgorithm) && (
                      <div><strong>Secret Used:</strong> {cryptoResult.secret ? 'Yes' : 'No'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500 py-8">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-2">{cryptoResult.error}</p>
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
            <FiShield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                <strong>All cryptographic operations happen in your browser.</strong> 
                Your data is not sent to any server. However, be careful with secret keys and sensitive data. 
                This tool is for educational and development purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
