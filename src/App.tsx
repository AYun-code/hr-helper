/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Users, Trophy, LayoutGrid, Settings } from 'lucide-react';
import { NameInput } from './components/NameInput';
import { LuckyDraw } from './components/LuckyDraw';
import { AutoGrouping } from './components/AutoGrouping';
import { Person, Tab } from './types';
import { cn } from './utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [names, setNames] = useState<Person[]>([]);

  const tabs = [
    { id: 'input', label: '名單管理', icon: Users },
    { id: 'raffle', label: '獎品抽籤', icon: Trophy },
    { id: 'grouping', label: '自動分組', icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Settings className="w-6 h-6 text-white animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-gray-900">HR Smart Tool</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Efficiency & Fun</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                    activeTab === tab.id 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Members</p>
                <p className="text-sm font-black text-indigo-600">{names.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              activeTab === tab.id ? "text-indigo-600" : "text-gray-400"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {names.length === 0 && activeTab !== 'input' ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-indigo-200" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-800">名單是空的</h2>
              <p className="text-gray-500 max-w-xs mx-auto">請先前往「名單管理」上傳 CSV 或貼上姓名，才能開始抽籤或分組。</p>
            </div>
            <button
              onClick={() => setActiveTab('input')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              前往新增名單
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'input' && <NameInput names={names} setNames={setNames} />}
            {activeTab === 'raffle' && <LuckyDraw names={names} />}
            {activeTab === 'grouping' && <AutoGrouping names={names} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">HR Smart Tool &copy; 2026</p>
          <p className="text-[10px] text-gray-300 mt-2 italic">Designed for professional HR management</p>
        </div>
      </footer>
    </div>
  );
}
