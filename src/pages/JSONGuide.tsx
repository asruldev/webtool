
export default function JSONGuidePage() {
  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              JSON Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn JSON (JavaScript Object Notation) with examples and best practices.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">JSON Basics</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Types</h3>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="text-black"><code className="bg-blue-200 text-blue-900 px-2 py-1 rounded font-mono">"string"</code> - Text values</div>
                  <div className="text-black"><code className="bg-green-200 text-green-900 px-2 py-1 rounded font-mono">123</code> - Numbers</div>
                  <div className="text-black"><code className="bg-purple-200 text-purple-900 px-2 py-1 rounded font-mono">true/false</code> - Booleans</div>
                  <div className="text-black"><code className="bg-gray-200 text-gray-900 px-2 py-1 rounded font-mono">null</code> - Null value</div>
                  <div className="text-black"><code className="bg-orange-200 text-orange-900 px-2 py-1 rounded font-mono">[]</code> - Arrays</div>
                  <div className="text-black"><code className="bg-indigo-200 text-indigo-900 px-2 py-1 rounded font-mono">{'{}'}</code> - Objects</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Example JSON</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto text-gray-100 font-mono">
{`{
  "name": "Asrul Harahap",
  "age": 30,
  "email": "asrul@example.com",
  "isActive": true,
  "hobbies": ["reading", "gaming"],
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Mistakes</h3>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <div className="text-black">❌ Trailing commas: <code className="bg-red-200 text-red-900 px-2 py-1 rounded font-mono">{`{"name": "Asrul",}`}</code></div>
                  <div className="text-black">❌ Unquoted keys: <code className="bg-red-200 text-red-900 px-2 py-1 rounded font-mono">{`{name: "Asrul"}`}</code></div>
                  <div className="text-black">❌ Single quotes: <code className="bg-red-200 text-red-900 px-2 py-1 rounded font-mono">{`{"name": 'Asrul'}`}</code></div>
                  <div className="text-black">❌ Comments: <code className="bg-red-200 text-red-900 px-2 py-1 rounded font-mono">// Not allowed in JSON</code></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
