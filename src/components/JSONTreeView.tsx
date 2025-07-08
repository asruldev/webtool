'use client';

import { useState, useMemo } from 'react';

interface TreeNodeProps {
  data: any;
  name: string;
  level: number;
}

function TreeNode({ data, name, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isPrimitive = !isObject && !isArray;
  
  const toggleExpanded = () => {
    if (isObject || isArray) {
      setIsExpanded(!isExpanded);
    }
  };

  const getValueColor = (value: any) => {
    if (typeof value === 'string') return 'text-green-600';
    if (typeof value === 'number') return 'text-blue-600';
    if (typeof value === 'boolean') return 'text-purple-600';
    if (value === null) return 'text-gray-500';
    return 'text-gray-900';
  };

  const getTypeIcon = () => {
    if (isObject) return '🔷';
    if (isArray) return '🔶';
    return '';
  };

  const getTypeLabel = () => {
    if (isObject) return 'object';
    if (isArray) return 'array';
    if (typeof data === 'string') return 'string';
    if (typeof data === 'number') return 'number';
    if (typeof data === 'boolean') return 'boolean';
    if (data === null) return 'null';
    return typeof data;
  };

  return (
    <div className="font-mono text-sm">
      <div 
        className={`flex items-center cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 ${
          isObject || isArray ? 'hover:bg-gray-50' : ''
        }`}
        onClick={toggleExpanded}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {/* Expand/Collapse Icon */}
        {(isObject || isArray) && (
          <span className="mr-1 text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        
        {/* Type Icon */}
        <span className="mr-2">{getTypeIcon()}</span>
        
        {/* Key */}
        <span className="text-blue-600 font-medium">"{name}"</span>
        
        {/* Separator */}
        <span className="mx-2 text-gray-400">:</span>
        
        {/* Value or Type Info */}
        {isPrimitive ? (
          <span className={getValueColor(data)}>
            {typeof data === 'string' ? `"${data}"` : String(data)}
          </span>
        ) : (
          <span className="text-gray-500">
            {isExpanded ? '' : `${getTypeLabel()} (${isArray ? data.length : Object.keys(data).length} items)`}
          </span>
        )}
      </div>
      
      {/* Children */}
      {isExpanded && (isObject || isArray) && (
        <div>
          {isObject && Object.entries(data).map(([key, value]) => (
            <TreeNode
              key={key}
              data={value}
              name={key}
              level={level + 1}
            />
          ))}
          {isArray && data.map((item: any, index: number) => (
            <TreeNode
              key={index}
              data={item}
              name={String(index)}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface JSONTreeViewProps {
  jsonData: string;
}

export function JSONTreeView({ jsonData }: JSONTreeViewProps) {
  const parsedData = useMemo(() => {
    if (!jsonData.trim()) {
      return null;
    }
    
    try {
      return JSON.parse(jsonData);
    } catch (error) {
      return null;
    }
  }, [jsonData]);

  if (!jsonData.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Enter JSON data to see tree view
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Invalid JSON format
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <TreeNode
        data={parsedData}
        name="root"
        level={0}
      />
    </div>
  );
} 