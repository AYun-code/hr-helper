import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Play, Settings2, UserCheck } from 'lucide-react';
import { Person } from '../types';
import { cn, shuffleArray } from '../utils';

interface LuckyDrawProps {
  names: Person[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ names }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [history, setHistory] = useState<Person[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const availableNames = allowRepeat 
    ? names 
    : names.filter(n => !history.find(h => h.id === n.id));

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % names.length);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isRolling, names.length]);

  const startDraw = () => {
    if (availableNames.length === 0) {
      alert('沒有可抽取的名單了！');
      return;
    }

    setIsRolling(true);
    setWinner(null);

    // Simulate rolling for 2 seconds
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      const selectedWinner = availableNames[randomIndex];
      
      setIsRolling(false);
      setWinner(selectedWinner);
      setHistory(prev => [selectedWinner, ...prev]);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
      });
    }, 2000);
  };

  const reset = () => {
    setWinner(null);
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">設定：</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              className={cn(
                "w-10 h-5 rounded-full transition-colors relative",
                allowRepeat ? "bg-indigo-600" : "bg-gray-200"
              )}
              onClick={() => setAllowRepeat(!allowRepeat)}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform",
                allowRepeat ? "left-6" : "left-1"
              )} />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">允許重複中獎</span>
          </label>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重設歷史
          </button>
          <button
            onClick={startDraw}
            disabled={isRolling || names.length === 0}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            {isRolling ? '抽籤中...' : '開始抽籤'}
          </button>
        </div>
      </div>

      {/* Display Area */}
      <div className="relative h-80 bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f5f3ff,transparent)] opacity-50" />
        
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-6xl md:text-8xl font-black text-indigo-600 tracking-tighter"
            >
              {names[currentIndex]?.name}
            </motion.div>
          ) : winner ? (
            <motion.div
              key="winner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block p-4 bg-yellow-100 rounded-full mb-4"
              >
                <Trophy className="w-12 h-12 text-yellow-600" />
              </motion.div>
              <h3 className="text-xl text-gray-500 font-medium">恭喜中獎者！</h3>
              <div className="text-6xl md:text-8xl font-black text-indigo-600 tracking-tighter">
                {winner.name}
              </div>
            </motion.div>
          ) : (
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">準備好開始抽籤了嗎？</p>
              <p className="text-xs text-gray-300">目前可抽取人數：{availableNames.length}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* History */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <div className="flex items-center gap-2 mb-6">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">中獎記錄 ({history.length})</h2>
        </div>
        
        {history.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm italic">尚無中獎記錄</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {history.map((person, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={`${person.id}-${idx}`}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2",
                  idx === 0 ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600"
                )}
              >
                {idx === 0 && <Trophy className="w-3 h-3" />}
                {person.name}
                <span className="text-[10px] opacity-50">#{history.length - idx}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
