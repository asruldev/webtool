'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { Tooltip } from 'react-tooltip';
import { FiCopy, FiInfo } from 'react-icons/fi';

const regexExplain = (pattern: string) => {
  // Penjelasan sederhana, bisa dikembangkan
  if (!pattern) return '';
  return pattern
    .replace(/\\d/g, 'digit')
    .replace(/\\w/g, 'word char')
    .replace(/\\s/g, 'whitespace')
    .replace(/\./g, 'any char')
    .replace(/\*/g, 'zero or more')
    .replace(/\+/g, 'one or more')
    .replace(/\?/g, 'zero or one')
    .replace(/\^/g, 'start')
    .replace(/\$/g, 'end');
};

const MODES = ['Match', 'Search', 'Replace'] as const;
type Mode = typeof MODES[number];

export default function RegexPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replaceString, setReplaceString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('Match');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [isTrulyValid, setIsTrulyValid] = useState<boolean | null>(null);
  const [quickTestMsg, setQuickTestMsg] = useState<string | null>(null);

  const regex = useMemo(() => {
    try {
      setError(null);
      if (!pattern.trim()) {
        setIsTrulyValid(null);
        return null;
      }
      const newRegex = new RegExp(pattern, flags);
      setIsTrulyValid(true);
      return newRegex;
    } catch (e: any) {
      setError(e.message);
      setIsTrulyValid(false);
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !testString) return [];
    let m;
    const result = [];
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
    while ((m = re.exec(testString)) !== null) {
      result.push({
        match: m[0],
        index: m.index,
        groups: m.groups,
        length: m[0].length,
        allGroups: m.slice(1),
      });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    return result;
  }, [regex, testString]);

  // Highlight hasil match di test string (dengan highlight grup)
  const highlightedTestString = useMemo(() => {
    if (!matches.length) return testString;
    let lastIndex = 0;
    let result = '';
    matches.forEach((m, i) => {
      result +=
        Prism.util.encode(testString.slice(lastIndex, m.index)) +
        `<mark style="background:#fde68a;color:#b45309;">` +
        (m.allGroups && m.allGroups.length > 0 && regex
          ? highlightGroups(m.match, m.allGroups, regex)
          : Prism.util.encode(testString.slice(m.index, m.index + m.length))) +
        '</mark>';
      lastIndex = m.index + m.length;
    });
    result += Prism.util.encode(testString.slice(lastIndex));
    return result;
  }, [matches, testString, regex]);

  function highlightGroups(full: string, groups: string[], regex: RegExp) {
    if (!groups.length) return Prism.util.encode(full);
    let result = '';
    let last = 0;
    let idx = 0;
    for (const g of groups) {
      if (g == null) continue;
      const pos = full.indexOf(g, last);
      if (pos !== -1) {
        result += Prism.util.encode(full.slice(last, pos));
        result += `<span style="background:#a7f3d0;color:#065f46;">${Prism.util.encode(g)}</span>`;
        last = pos + g.length;
      }
      idx++;
    }
    result += Prism.util.encode(full.slice(last));
    return result;
  }

  // Replace result
  const replacedString = useMemo(() => {
    if (!regex || !testString || mode !== 'Replace') return '';
    try {
      return testString.replace(regex, replaceString);
    } catch {
      return '';
    }
  }, [regex, testString, replaceString, mode]);

  // Navigasi hasil search
  const goToMatch = (dir: 1 | -1) => {
    if (!matches.length) return;
    setCurrentMatch((prev) => (prev + dir + matches.length) % matches.length);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1200);
  };

  useEffect(() => {
    if (!pattern.trim()) {
      setIsTrulyValid(null);
      return;
    }
    try {
      const re = new RegExp(pattern, flags);
      if (testString && testString.split('\n').some(line => re.test(line))) {
        setIsTrulyValid(true);
      } else {
        setIsTrulyValid(false);
      }
    } catch {
      setIsTrulyValid(false);
    }
  }, [pattern, flags, testString]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Regex 101 for JS/TS
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Test, debug, and learn JavaScript/TypeScript regular expressions interactively.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regex Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-lg font-semibold text-gray-900">Regex Pattern</label>
                {isTrulyValid !== null && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isTrulyValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isTrulyValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                )}
                <span data-tooltip-id="regex-pattern-tip"><FiInfo className="text-blue-400 cursor-pointer" /></span>
                <Tooltip id="regex-pattern-tip" place="top" content="Masukkan pola regex JS/TS. Contoh: (\\w+)@(\\w+)." />
                <button onClick={() => handleCopy(pattern, 'pattern')} className="ml-auto text-gray-500 hover:text-blue-600" data-tooltip-id="copy-pattern-tip">
                  <FiCopy />
                </button>
                <Tooltip id="copy-pattern-tip" place="top" content={copied==='pattern' ? 'Copied!' : 'Copy regex pattern'} />
              </div>
              <Editor
                value={pattern}
                onValueChange={setPattern}
                highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                padding={12}
                style={{ fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', fontSize: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e5e7eb', color: '#222', outline: 'none', marginBottom: 16, resize: 'none' }}
                textareaId="regex-pattern-input"
                placeholder="e.g. (\\w+)@([\\w.]+)"
              />
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-700">Flags:</label>
                <span data-tooltip-id="flags-tip"><FiInfo className="text-blue-400 cursor-pointer" /></span>
                <Tooltip id="flags-tip" place="top" content="g: global, i: ignore case, m: multiline, s: dotAll, u: unicode, y: sticky" />
                {['g','i','m','s','u','y'].map(f => (
                  <label key={f} className="inline-flex items-center mr-2">
                    <input type="checkbox" checked={flags.includes(f)} onChange={e => setFlags(flags => e.target.checked ? flags + f : flags.replace(f, ''))} className="form-checkbox text-blue-600" />
                    <span className="ml-1 text-xs">{f}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-gray-500 mb-2">Current flags: <span className="font-mono">{flags || '(none)'}</span></div>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-2 mb-2">{error}</div>}
              
              {/* Validation Summary */}
              {pattern.trim() && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Validation Summary</div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>Pattern Length: <span className="font-mono text-blue-600">{pattern.length}</span></div>
                    <div>Flag Count: <span className="font-mono text-blue-600">{flags.length}</span></div>
                    <div>Status: <span className={`font-bold ${isTrulyValid ? 'text-green-600' : 'text-red-600'}`}>{isTrulyValid ? 'Ready & Matching' : 'Not matching or invalid'}</span></div>
                    <div>Can Match: <span className={`font-bold ${isTrulyValid ? 'text-green-600' : 'text-red-600'}`}>{isTrulyValid ? 'Yes' : 'No'}</span></div>
                  </div>
                  <div className="text-xs text-gray-500">A pattern is <span className="font-bold">valid</span> if it compiles <span className="font-mono">dan</span> matches at least one line in the test string.</div>
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-2 mb-2">
                <label className="block text-lg font-semibold text-gray-900">Pattern Explanation</label>
                <span data-tooltip-id="explain-tip"><FiInfo className="text-blue-400 cursor-pointer" /></span>
                <Tooltip id="explain-tip" place="top" content="Penjelasan otomatis dari pola regex Anda." />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700 font-mono min-h-[40px] whitespace-pre-line break-words">
                {regexExplain(pattern) || <span className="text-gray-400">Explanation will appear here...</span>}
              </div>
              {mode === 'Replace' && (
                <div className="mt-4">
                  <label className="block text-md font-semibold text-gray-900 mb-2">Replacement String</label>
                  <Editor
                    value={replaceString}
                    onValueChange={setReplaceString}
                    highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                    padding={12}
                    style={{ fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', fontSize: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e5e7eb', color: '#222', outline: 'none', marginBottom: 16, resize: 'none', minHeight: 40 }}
                    textareaId="regex-replace-input"
                    placeholder="Replacement string (e.g. $1@domain.com)"
                  />
                </div>
              )}
              {/* Example Regex Section */}
              <div className="mt-6">
                <div className="font-semibold text-gray-800 mb-2">Contoh Regex Populer:</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-mono hover:bg-blue-200 transition"
                    onClick={() => {
                      setPattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
                      setTestString('user@example.com\ninvalid-email@\nhello@domain.id');
                    }}
                  >
                    Email
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-mono hover:bg-blue-200 transition"
                    onClick={() => {
                      setPattern('^(https?:\\/\\/)?([\\w-]+\\.)+[a-zA-Z]{2,}(\\/\\S*)?$');
                      setTestString('https://google.com\nwww.example.co.id\nhttp://site.org/path\ninvalid-url');
                    }}
                  >
                    Website
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-mono hover:bg-blue-200 transition"
                    onClick={() => {
                      setPattern('^(\\+62|62|0)8[1-9][0-9]{6,9}$');
                      setTestString('+6281234567890\n081234567890\n6281234567890\n+6281abc');
                    }}
                  >
                    No HP Indo
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-mono">Email</span>: <span className="text-gray-700">user@example.com</span> &nbsp;|&nbsp;
                  <span className="font-mono">Website</span>: <span className="text-gray-700">https://google.com</span> &nbsp;|&nbsp;
                  <span className="font-mono">No HP Indo</span>: <span className="text-gray-700">+6281234567890</span>
                </div>
                
                {/* Quick Test Button */}
                {isTrulyValid && pattern.trim() && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      className="px-4 py-2 rounded bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition"
                      onClick={() => {
                        if (!testString.trim()) {
                          setTestString('test string\nsample text\n12345');
                          setQuickTestMsg('Test data added!');
                          setTimeout(() => setQuickTestMsg(null), 1500);
                        } else {
                          setQuickTestMsg('Test string already filled.');
                          setTimeout(() => setQuickTestMsg(null), 1500);
                        }
                      }}
                    >
                      🧪 Quick Test
                    </button>
                    <span className="ml-2 text-xs text-gray-500">Add test data if empty</span>
                    {quickTestMsg && (
                      <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 inline-block animate-fade-in">
                        {quickTestMsg}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Test String & Result */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-lg font-semibold text-gray-900">Test String</label>
                <span data-tooltip-id="teststring-tip"><FiInfo className="text-blue-400 cursor-pointer" /></span>
                <Tooltip id="teststring-tip" place="top" content="Masukkan teks yang ingin diuji dengan regex di sini." />
                <button onClick={() => handleCopy(testString, 'teststring')} className="ml-auto text-gray-500 hover:text-blue-600" data-tooltip-id="copy-teststring-tip">
                  <FiCopy />
                </button>
                <Tooltip id="copy-teststring-tip" place="top" content={copied==='teststring' ? 'Copied!' : 'Copy test string'} />
              </div>
              <Editor
                value={testString}
                onValueChange={setTestString}
                highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                padding={12}
                style={{ fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', fontSize: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e5e7eb', color: '#222', outline: 'none', marginBottom: 16, resize: 'none', minHeight: 80 }}
                textareaId="regex-teststring-input"
                placeholder="Type or paste your test string here..."
              />
              {mode === 'Replace' && (
                <div className="mt-4">
                  <label className="block text-lg font-semibold text-gray-900 mb-2">Replace Result</label>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm font-mono min-h-[40px] overflow-x-auto" style={{whiteSpace:'pre-wrap'}}>
                    {replacedString || <span className="text-gray-400">No replace result.</span>}
                  </div>
                </div>
              )}
              {mode === 'Search' && matches.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => goToMatch(-1)} className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold">Prev</button>
                  <span className="text-sm">Match {currentMatch+1} of {matches.length}</span>
                  <button onClick={() => goToMatch(1)} className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold">Next</button>
                </div>
              )}
              {mode === 'Search' && matches.length > 0 && (
                <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3 text-sm font-mono min-h-[40px] overflow-x-auto" style={{whiteSpace:'pre-wrap'}}>
                  <span dangerouslySetInnerHTML={{__html: highlightSearch(testString, matches, currentMatch)}} />
                </div>
              )}
              {mode === 'Match' && (
                <div className="mt-4 flex items-center gap-2 mb-2">
                  <label className="block text-lg font-semibold text-gray-900">Match Result</label>
                  <span data-tooltip-id="matchresult-tip"><FiInfo className="text-blue-400 cursor-pointer" /></span>
                  <Tooltip id="matchresult-tip" place="top" content="Setiap baris test string akan ditandai valid/tidak valid." />
                </div>
              )}
              {mode === 'Match' && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm font-mono min-h-[40px] overflow-x-auto" style={{whiteSpace:'pre-wrap'}}>
                  {testString.trim() === '' ? (
                    <span className="text-gray-400">No test string.</span>
                  ) : (
                    testString.split('\n').map((line, idx) => {
                      let isLineValid = false;
                      try {
                        if (regex && regex.test(line)) isLineValid = true;
                      } catch {}
                      return (
                        <div key={idx} className={`flex items-center gap-2 mb-1 ${isLineValid ? 'text-green-700' : 'text-red-700'}`}>
                          <span className={`inline-block w-5 text-lg font-bold ${isLineValid ? 'text-green-500' : 'text-red-400'}`}>{isLineValid ? '✓' : '✗'}</span>
                          <span className="break-all">{line || <span className="text-gray-400">(empty)</span>}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              {/* Statistik */}
              <div className="mt-4 text-xs text-gray-500">
                <div>Match count: <span className="font-bold text-blue-700">{matches.length}</span></div>
                <div>Flags: <span className="font-mono">{flags || '(none)'}</span></div>
                <div>Group count: <span className="font-mono">{matches[0]?.allGroups?.length ?? 0}</span></div>
              </div>
              {/* Match details */}
              {matches.length > 0 && (
                <div className="mt-4">
                  <label className="block text-md font-semibold text-gray-900 mb-2">Match Details</label>
                  <div className="bg-white border border-gray-200 rounded p-3 text-xs font-mono">
                    {matches.map((m, i) => (
                      <div key={i} className="mb-2">
                        <span className="text-blue-700">[{i+1}]</span> <span className="text-green-700">{JSON.stringify(m.match)}</span> at <span className="text-purple-700">{m.index}</span> {m.groups && <span className="text-orange-700">groups: {JSON.stringify(m.groups)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  // Highlight search mode
  function highlightSearch(str: string, matches: any[], current: number) {
    if (!matches.length) return str;
    let lastIndex = 0;
    let result = '';
    matches.forEach((m, i) => {
      result +=
        Prism.util.encode(str.slice(lastIndex, m.index)) +
        `<mark style="background:${i===current?'#a7f3d0':'#fde68a'};color:${i===current?'#065f46':'#b45309'};">` +
        Prism.util.encode(str.slice(m.index, m.index + m.length)) +
        '</mark>';
      lastIndex = m.index + m.length;
    });
    result += Prism.util.encode(str.slice(lastIndex));
    return result;
  }
} 