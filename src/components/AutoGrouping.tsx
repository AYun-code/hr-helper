import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, LayoutGrid, Shuffle, Download } from 'lucide-react';
import { Person } from '../types';
import { cn, shuffleArray } from '../utils';

interface AutoGroupingProps {
  names: Person[];
}

export const AutoGrouping: React.FC<AutoGroupingProps> = ({ names }) => {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<Person[][]>([]);

  const handleGrouping = () => {
    if (names.length === 0) return;
    
    const shuffled = shuffleArray<Person>(names);
    const result: Person[][] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push(shuffled.slice(i, i + groupSize));
    }
    
    setGroups(result);
  };

  const downloadResults = () => {
    const csvContent = groups.map((group, idx) => {
      return group.map(p => `Group ${idx + 1},${p.name}`).join('\n');
    }).join('\n');
    
    const bom = '\uFEFF'; // Add BOM for Excel compatibility with Chinese characters
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '分組結果.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">每組人數</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max={Math.max(2, names.length)}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-48 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xl font-black text-indigo-600 w-8">{groupSize}</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">預計組數</p>
            <p className="text-xl font-black text-gray-700">{Math.ceil(names.length / groupSize)} 組</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {groups.length > 0 && (
            <button
              onClick={downloadResults}
              className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="下載結果"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleGrouping}
            disabled={names.length === 0}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            開始自動分組
          </button>
        </div>
      </div>

      {/* Visualization Area */}
      {groups.length === 0 ? (
        <div className="h-96 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 space-y-4">
          <LayoutGrid className="w-16 h-16 opacity-20" />
          <p className="font-medium">設定人數並點擊開始分組</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="bg-gray-50 px-4 py-3 border-bottom border-gray-100 flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Group {idx + 1}</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{group.length} 人</span>
              </div>
              <div className="p-4 space-y-2">
                {group.map((person) => (
                  <div key={person.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {person.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{person.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
