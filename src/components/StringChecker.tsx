import React, { useState, useEffect } from 'react';
import { FaCopy, FaFileAlt, FaEquals, FaNotEqual, FaClock, FaAlignLeft } from 'react-icons/fa';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';

interface StringCheckerProps {
  className?: string;
}

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
}

export const StringChecker: React.FC<StringCheckerProps> = ({ className = '' }) => {
  const [string1, setString1] = useState('');
  const [string2, setString2] = useState('');
  const [stats1, setStats1] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });
  const [stats2, setStats2] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });
  const [copied, setCopied] = useState<string | null>(null);

  // Calculate text statistics
  const calculateStats = (text: string): TextStats => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Reading time calculation (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime
    };
  };

  // Update statistics when text changes
  useEffect(() => {
    setStats1(calculateStats(string1));
  }, [string1]);

  useEffect(() => {
    setStats2(calculateStats(string2));
  }, [string2]);

  // Compare strings and highlight differences
  const compareStrings = () => {
    if (string1 === string2) {
      return { areEqual: true, differences: [] };
    }

    const differences: Array<{
      type: 'insert' | 'delete' | 'replace';
      start: number;
      end: number;
      content: string;
    }> = [];

    // Simple character-by-character comparison
    const maxLength = Math.max(string1.length, string2.length);
    
    for (let i = 0; i < maxLength; i++) {
      const char1 = string1[i] || '';
      const char2 = string2[i] || '';
      
      if (char1 !== char2) {
        if (!char1) {
          differences.push({
            type: 'insert',
            start: i,
            end: i,
            content: char2
          });
        } else if (!char2) {
          differences.push({
            type: 'delete',
            start: i,
            end: i,
            content: char1
          });
        } else {
          differences.push({
            type: 'replace',
            start: i,
            end: i,
            content: char2
          });
        }
      }
    }

    return { areEqual: false, differences };
  };

  // Generate highlighted text with differences
  const generateHighlightedText = (text: string, isString1: boolean) => {
    const comparison = compareStrings();
    if (comparison.areEqual) return text;

    const differences = comparison.differences;
    let result = '';
    let lastIndex = 0;

    differences.forEach(diff => {
      // Add text before difference
      result += text.slice(lastIndex, diff.start);
      
      // Add highlighted difference
      if (isString1) {
        if (diff.type === 'delete' || diff.type === 'replace') {
          result += `<span class="bg-red-300 text-red-900 px-1 rounded font-semibold">${diff.content}</span>`;
        }
      } else {
        if (diff.type === 'insert' || diff.type === 'replace') {
          result += `<span class="bg-green-300 text-green-900 px-1 rounded font-semibold">${diff.content}</span>`;
        }
      }
      
      lastIndex = diff.end + 1;
    });

    // Add remaining text
    result += text.slice(lastIndex);
    return result;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Clear all text
  const clearAll = () => {
    setString1('');
    setString2('');
  };

  const comparison = compareStrings();

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FaFileAlt className="text-blue-600" />
          String Checker
        </h2>
        <p className="text-gray-600">Compare two strings, highlight differences, and analyze text statistics</p>
      </div>

      {/* Comparison Result */}
      <div className="mb-6 p-4 rounded-lg border-2 border-dashed">
        <div className="flex items-center justify-center gap-4">
          {comparison.areEqual ? (
            <>
              <FaEquals className="text-green-600 text-2xl" />
              <span className="text-lg font-semibold text-green-600">Strings are identical</span>
            </>
          ) : (
            <>
              <FaNotEqual className="text-red-600 text-2xl" />
              <span className="text-lg font-semibold text-red-600">Strings are different</span>
              <span className="text-sm text-gray-600">({comparison.differences.length} differences)</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* String 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              String 1
            </label>
            <button
              onClick={() => copyToClipboard(string1, 'string1')}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              {copied === 'string1' ? '✓' : <FaCopy />}
            </button>
          </div>

          <Editor
            value={string1}
            onValueChange={setString1}
            highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
            padding={16}
            style={{ fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', fontSize: 14, minHeight: '24rem', borderRadius: 8, background: '#f8fafc', border: '1px solid #e5e7eb', color: '#222', outline: 'none', marginBottom: 16, resize: 'none' }}
            textareaId="string-checker-input"
            placeholder="Enter first string to compare..."
          />
          
          {/* Highlighted String 1 */}
          {string1 && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm font-medium text-gray-800 mb-2">Highlighted String 1:</div>
              <div 
                className="text-base leading-relaxed text-gray-900"
                dangerouslySetInnerHTML={{ __html: generateHighlightedText(string1, true) }}
              />
            </div>
          )}
        </div>

        {/* String 2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              String 2
            </label>
            <button
              onClick={() => copyToClipboard(string2, 'string2')}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              {copied === 'string2' ? '✓' : <FaCopy />}
            </button>
          </div>
          <Editor
            value={string2}
            onValueChange={setString2}
            highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
            padding={16}
            style={{ fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', fontSize: 14, minHeight: '24rem', borderRadius: 8, background: '#f8fafc', border: '1px solid #e5e7eb', color: '#222', outline: 'none', marginBottom: 16, resize: 'none' }}
            textareaId="string-checker-input"
            placeholder="Enter second string to compare..."
          />
          
          {/* Highlighted String 2 */}
          {string2 && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm font-medium text-gray-800 mb-2">Highlighted String 2:</div>
              <div 
                className="text-base leading-relaxed text-gray-900"
                dangerouslySetInnerHTML={{ __html: generateHighlightedText(string2, false) }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Text Statistics */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaAlignLeft className="text-blue-600" />
          Text Statistics
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* String 1 Stats */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">String 1 Statistics</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Characters:</span>
                <span className="font-mono font-bold text-blue-900">{stats1.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">No Spaces:</span>
                <span className="font-mono font-bold text-blue-900">{stats1.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Words:</span>
                <span className="font-mono font-bold text-blue-900">{stats1.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Sentences:</span>
                <span className="font-mono font-bold text-blue-900">{stats1.sentences.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Paragraphs:</span>
                <span className="font-mono font-bold text-blue-900">{stats1.paragraphs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium flex items-center gap-1">
                  <FaClock className="text-xs" />
                  Reading Time:
                </span>
                <span className="font-mono font-bold text-blue-900">{stats1.readingTime} min</span>
              </div>
            </div>
          </div>

          {/* String 2 Stats */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">String 2 Statistics</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Characters:</span>
                <span className="font-mono font-bold text-green-900">{stats2.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">No Spaces:</span>
                <span className="font-mono font-bold text-green-900">{stats2.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Words:</span>
                <span className="font-mono font-bold text-green-900">{stats2.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Sentences:</span>
                <span className="font-mono font-bold text-green-900">{stats2.sentences.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Paragraphs:</span>
                <span className="font-mono font-bold text-green-900">{stats2.paragraphs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium flex items-center gap-1">
                  <FaClock className="text-xs" />
                  Reading Time:
                </span>
                <span className="font-mono font-bold text-green-900">{stats2.readingTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Legend */}
      {!comparison.areEqual && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-3">Difference Legend</h4>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-red-300 text-red-900 px-2 py-1 rounded font-semibold">Text</span>
              <span className="text-gray-700 font-medium">Removed from String 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-300 text-green-900 px-2 py-1 rounded font-semibold">Text</span>
              <span className="text-gray-700 font-medium">Added to String 2</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={() => copyToClipboard(string1, 'string1')}
          disabled={!string1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Copy String 1
        </button>
        <button
          onClick={() => copyToClipboard(string2, 'string2')}
          disabled={!string2}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Copy String 2
        </button>
      </div>
    </div>
  );
};
