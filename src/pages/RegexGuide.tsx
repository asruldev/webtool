
export default function RegexGuidePage() {
  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Regex Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn regular expressions with comprehensive examples and explanations.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Regular Expression Basics</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Character Classes</h3>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="text-black"><code className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-mono">\d</code> - Any digit (0-9)</div>
                  <div className="text-black"><code className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-mono">\w</code> - Word character (a-z, A-Z, 0-9, _)</div>
                  <div className="text-black"><code className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-mono">\s</code> - Whitespace character</div>
                  <div className="text-black"><code className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-mono">.</code> - Any character except newline</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantifiers</h3>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="text-black"><code className="bg-green-200 text-green-900 px-2 py-1 rounded font-mono">*</code> - Zero or more</div>
                  <div className="text-black"><code className="bg-green-200 text-green-900 px-2 py-1 rounded font-mono">+</code> - One or more</div>
                  <div className="text-black"><code className="bg-green-200 text-green-900 px-2 py-1 rounded font-mono">?</code> - Zero or one</div>
                  <div className="text-black"><code className="bg-green-200 text-green-900 px-2 py-1 rounded font-mono">{'{n}'}</code> - Exactly n times</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Anchors</h3>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="text-black"><code className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded font-mono">^</code> - Start of string/line</div>
                  <div className="text-black"><code className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded font-mono">$</code> - End of string/line</div>
                  <div className="text-black"><code className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded font-mono">\b</code> - Word boundary</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Flags</h3>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="text-black"><code className="bg-purple-200 text-purple-900 px-2 py-1 rounded font-mono">g</code> - Global search</div>
                  <div className="text-black"><code className="bg-purple-200 text-purple-900 px-2 py-1 rounded font-mono">i</code> - Case insensitive</div>
                  <div className="text-black"><code className="bg-purple-200 text-purple-900 px-2 py-1 rounded font-mono">m</code> - Multiline</div>
                  <div className="text-black"><code className="bg-purple-200 text-purple-900 px-2 py-1 rounded font-mono">s</code> - Dot matches newline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
