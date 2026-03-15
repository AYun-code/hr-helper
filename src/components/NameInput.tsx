import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, ClipboardList, Trash2, Users } from 'lucide-react';
import { Person } from '../types';
import { cn } from '../utils';

interface NameInputProps {
  names: Person[];
  setNames: (names: Person[]) => void;
}

export const NameInput: React.FC<NameInputProps> = ({ names, setNames }) => {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const duplicateNames = names.filter((person, index) => 
    names.findIndex(p => p.name === person.name) !== index
  ).map(p => p.name);

  const uniqueDuplicateNames = Array.from(new Set(duplicateNames));

  const handleTextSubmit = () => {
    const newNames = textInput
      .split('\n')
      .map(n => n.trim())
      .filter(n => n !== '')
      .map(name => ({ id: Math.random().toString(36).substr(2, 9), name }));
    
    setNames([...names, ...newNames]);
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames = results.data
          .flat()
          .map(n => String(n).trim())
          .filter(n => n !== '')
          .map(name => ({ id: Math.random().toString(36).substr(2, 9), name }));
        
        setNames([...names, ...parsedNames]);
      },
      header: false,
    });
  };

  const loadMockData = () => {
    const mockNames = [
      '陳小明', '林美惠', '張大華', '李志強', '王淑芬', 
      '劉建國', '蔡依林', '周杰倫', '郭台銘', '張忠謀',
      '陳小明', '林美惠' // Intentional duplicates
    ].map(name => ({ id: Math.random().toString(36).substr(2, 9), name }));
    setNames(mockNames);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const unique = names.filter(person => {
      const isDuplicate = seen.has(person.name);
      seen.add(person.name);
      return !isDuplicate;
    });
    setNames(unique);
  };

  const clearAll = () => {
    if (confirm('確定要清除所有名單嗎？')) {
      setNames([]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Input */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">貼上姓名名單</h2>
            </div>
            <button 
              onClick={loadMockData}
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
            >
              載入模擬名單
            </button>
          </div>
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-sans text-sm"
            placeholder="每行輸入一個姓名..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            新增至名單
          </button>
        </div>

        {/* File Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">上傳 CSV 檔案</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              請上傳包含姓名列表的 CSV 檔案。
            </p>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
          >
            <Upload className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-700">點擊或拖曳檔案至此</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* List Display */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">目前名單 ({names.length} 人)</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {uniqueDuplicateNames.length > 0 && (
              <button
                onClick={removeDuplicates}
                className="text-sm bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 flex items-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                移除重複姓名 ({uniqueDuplicateNames.length})
              </button>
            )}
            {names.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清除全部
              </button>
            )}
          </div>
        </div>

        {names.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            尚未新增任何名單
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1">
            {names.map((person, idx) => {
              const isDuplicate = names.some((p, i) => p.name === person.name && i !== idx);
              return (
                <div
                  key={person.id}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm border flex items-center justify-between group transition-all",
                    isDuplicate 
                      ? "bg-amber-50 border-amber-200 text-amber-700" 
                      : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-sm"
                  )}
                >
                  <span className="truncate flex items-center gap-1">
                    {person.name}
                    {isDuplicate && <span className="text-[10px] bg-amber-200 px-1 rounded">重</span>}
                  </span>
                  <button
                    onClick={() => setNames(names.filter(n => n.id !== person.id))}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
