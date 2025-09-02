import React, { useState, useEffect } from 'react';
import { FaCopy, FaEyeDropper, FaPalette } from 'react-icons/fa';

interface ColorPickerProps {
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ className = '' }) => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [hexValue, setHexValue] = useState('#3B82F6');
  const [rgbValue, setRgbValue] = useState({ r: 59, g: 130, b: 246 });
  const [hslValue, setHslValue] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState<string | null>(null);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Update all color values when hex changes
  useEffect(() => {
    const rgb = hexToRgb(hexValue);
    if (rgb) {
      setRgbValue(rgb);
      setHslValue(rgbToHsl(rgb.r, rgb.g, rgb.b));
      setSelectedColor(hexValue);
    }
  }, [hexValue]);

  // Update hex when RGB changes
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValue, [component]: Math.max(0, Math.min(255, value)) };
    setRgbValue(newRgb);
    setHexValue(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // Update hex when HSL changes
  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hslValue, [component]: Math.max(0, Math.min(component === 'h' ? 360 : 100, value)) };
    setHslValue(newHsl);
    
    // Convert HSL to RGB then to Hex
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgbValue(rgb);
    setHexValue(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  // Copy color value to clipboard
  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate color palette variations
  const generatePalette = () => {
    const variations = [];
    const baseHsl = hslValue;
    
    // Generate tints and shades
    for (let i = 0; i <= 100; i += 20) {
      if (i !== baseHsl.l) {
        const rgb = hslToRgb(baseHsl.h, baseHsl.s, i);
        variations.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
    }
    
    return variations;
  };

  const paletteColors = generatePalette();

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FaPalette className="text-blue-600" />
          Color Picker
        </h2>
        <p className="text-gray-600">Pick, convert, and copy colors in various formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Preview */}
        <div className="space-y-4">
          <div className="text-center">
            <div 
              className="w-32 h-32 mx-auto rounded-lg shadow-lg border-2 border-gray-200"
              style={{ backgroundColor: selectedColor }}
            />
            <p className="text-sm text-gray-600 mt-2">Color Preview</p>
          </div>

          {/* Color Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              <FaEyeDropper className="inline mr-2" />
              Pick Color
            </label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setHexValue(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Color Values */}
        <div className="space-y-4">
          {/* Hex Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hex</label>
            <div className="flex">
              <input
                type="text"
                value={hexValue}
                onChange={(e) => setHexValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#000000"
              />
              <button
                onClick={() => copyToClipboard(hexValue, 'hex')}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                {copied === 'hex' ? '✓' : <FaCopy />}
              </button>
            </div>
          </div>

          {/* RGB Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RGB</label>
            <div className="grid grid-cols-3 gap-2">
              {(['r', 'g', 'b'] as const).map((component) => (
                <div key={component} className="flex">
                  <input
                    type="number"
                    value={rgbValue[component]}
                    onChange={(e) => handleRgbChange(component, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="255"
                  />
                  <span className="px-2 py-2 bg-gray-100 border border-gray-300 rounded-r-lg text-sm font-mono">
                    {component.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                type="text"
                value={`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`, 'rgb')}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                {copied === 'rgb' ? '✓' : <FaCopy />}
              </button>
            </div>
          </div>

          {/* HSL Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HSL</label>
            <div className="grid grid-cols-3 gap-2">
              {(['h', 's', 'l'] as const).map((component) => (
                <div key={component} className="flex">
                  <input
                    type="number"
                    value={hslValue[component]}
                    onChange={(e) => handleHslChange(component, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max={component === 'h' ? 360 : 100}
                  />
                  <span className="px-2 py-2 bg-gray-100 border border-gray-300 rounded-r-lg text-sm font-mono">
                    {component.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                type="text"
                value={`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`, 'hsl')}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                {copied === 'hsl' ? '✓' : <FaCopy />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Variations</h3>
        <div className="grid grid-cols-5 gap-2">
          {paletteColors.map((color, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-12 h-12 rounded-lg shadow-md border border-gray-200 mx-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setHexValue(color)}
                title={color}
              />
              <p className="text-xs text-gray-600 mt-1 font-mono">{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Colors */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preset Colors</h3>
        <div className="grid grid-cols-8 gap-2">
          {[
            '#FF0000', '#FF4500', '#FFA500', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
            '#800000', '#FF6347', '#FFD700', '#ADFF2F', '#32CD32', '#40E0D0', '#4169E1', '#DA70D6',
            '#000000', '#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#DCDCDC', '#FFFFFF'
          ].map((color, index) => (
            <div 
              key={index}
              className="w-8 h-8 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => setHexValue(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
