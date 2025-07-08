'use client';

import { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  parsedData?: any;
  statistics: {
    totalKeys: number;
    totalValues: number;
    maxDepth: number;
    size: number;
  };
}

interface JSONValidatorProps {
  jsonData: string;
}

const analyzeJSON = (obj: any, depth: number = 0) => {
  let totalKeys = 0;
  let totalValues = 0;
  let maxDepth = depth;

  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      totalValues = obj.length;
      obj.forEach((item, index) => {
        totalKeys++;
        const childStats = analyzeJSON(item, depth + 1);
        maxDepth = Math.max(maxDepth, childStats.maxDepth);
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        totalKeys++;
        totalValues++;
        const childStats = analyzeJSON(value, depth + 1);
        maxDepth = Math.max(maxDepth, childStats.maxDepth);
      });
    }
  } else {
    totalValues = 1;
  }

  return {
    totalKeys,
    totalValues,
    maxDepth,
    size: JSON.stringify(obj).length
  };
};

const generateWarnings = (obj: any, stats: any): string[] => {
  const warnings: string[] = [];

  if (stats.maxDepth > 10) {
    warnings.push('Deep nesting detected (>10 levels). Consider flattening the structure.');
  }

  if (stats.size > 1000000) {
    warnings.push('Large JSON detected (>1MB). Consider chunking or compression.');
  }

  if (stats.totalKeys > 1000) {
    warnings.push('Many keys detected (>1000). Consider using arrays for better performance.');
  }

  // Check for common issues
  const checkForIssues = (data: any, path: string = '') => {
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          checkForIssues(item, `${path}[${index}]`);
        });
      } else {
        Object.entries(data).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (value === '') {
            warnings.push(`Empty string found at: ${currentPath}`);
          }
          if (typeof value === 'string' && value.length > 1000) {
            warnings.push(`Very long string found at: ${currentPath} (${value.length} characters)`);
          }
          checkForIssues(value, currentPath);
        });
      }
    }
  };
  checkForIssues(obj);
  return warnings;
};

export function JSONValidator({ jsonData }: JSONValidatorProps) {
  const validationResult = useMemo(() => {
    if (!jsonData.trim()) {
      return {
        isValid: false,
        errors: ['No JSON data provided'],
        warnings: [],
        statistics: { totalKeys: 0, totalValues: 0, maxDepth: 0, size: 0 },
        parsedData: undefined,
      };
    }
    try {
      const parsed = JSON.parse(jsonData);
      const statistics = analyzeJSON(parsed);
      return {
        isValid: true,
        errors: [],
        warnings: generateWarnings(parsed, statistics),
        parsedData: parsed,
        statistics,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Invalid JSON format'],
        warnings: [],
        statistics: { totalKeys: 0, totalValues: 0, maxDepth: 0, size: 0 },
        parsedData: undefined,
      };
    }
  }, [jsonData]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!jsonData.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Enter JSON data to validate
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 bg-gray-50 border border-gray-200 rounded-lg">
      {/* Validation Status */}
      <div className={`mb-4 p-3 rounded-lg ${
        validationResult.isValid 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          {validationResult.isValid ? (
            <>
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">Valid JSON</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Invalid JSON</span>
            </>
          )}
        </div>
      </div>

      {/* Statistics */}
      {validationResult.isValid && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{validationResult.statistics.totalKeys}</div>
              <div className="text-sm text-gray-600">Total Keys</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{validationResult.statistics.totalValues}</div>
              <div className="text-sm text-gray-600">Total Values</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{validationResult.statistics.maxDepth}</div>
              <div className="text-sm text-gray-600">Max Depth</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">{formatFileSize(validationResult.statistics.size)}</div>
              <div className="text-sm text-gray-600">Size</div>
            </div>
          </div>
        </div>
      )}

      {/* Pretty Print JSON */}
      {validationResult.isValid && validationResult.parsedData && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Pretty JSON</h4>
          <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: '#f8fafc', color: '#222', fontSize: 14, borderRadius: 8, padding: 16, minHeight: '100%' }}>
            {JSON.stringify(validationResult.parsedData, null, 2)}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Errors */}
      {validationResult.errors.length > 0 && !validationResult.isValid && (
        <div className="mb-4">
          <h4 className="font-semibold text-red-900 mb-2">Errors</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <ul className="list-disc list-inside space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="text-red-800 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Warnings */}
      {validationResult.warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Warnings</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <ul className="list-disc list-inside space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-800 text-sm">{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* JSON Structure Info */}
      {validationResult.isValid && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Structure Information</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-sm text-gray-600">
              <p>• Type: {Array.isArray(validationResult.parsedData) ? 'Array' : 'Object'}</p>
              <p>• Encoding: UTF-8</p>
              <p>• Format: JSON (JavaScript Object Notation)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 