
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChannelGrid } from './components/ChannelGrid';
import { AILiveAssistant } from './components/AILiveAssistant';
import { CHANNELS, CATEGORIES } from './constants';
import { MenuSection, NavigationState } from './types';

const App: React.FC = () => {
  const [navState, setNavState] = useState<NavigationState>({
    section: 'sidebar',
    sidebarIndex: 0,
    contentIndex: { row: 0, col: 0 }
  });

  const [activeSection, setActiveSection] = useState<MenuSection>('home');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setNavState(prev => {
      const newState = { ...prev };

      switch (e.key) {
        case 'ArrowRight':
          if (newState.section === 'sidebar') {
            newState.section = 'content';
            newState.contentIndex = { row: 0, col: 0 };
          } else if (newState.section === 'content') {
            if (newState.contentIndex.col < CHANNELS.length - 1) {
              newState.contentIndex.col += 1;
            }
          }
          break;

        case 'ArrowLeft':
          if (newState.section === 'content') {
            if (newState.contentIndex.col === 0) {
              newState.section = 'sidebar';
            } else {
              newState.contentIndex.col -= 1;
            }
          }
          break;

        case 'ArrowDown':
          if (newState.section === 'sidebar') {
            newState.sidebarIndex = Math.min(newState.sidebarIndex + 1, 3);
          } else if (newState.section === 'content') {
            // In this demo grid is simple, but we can expand rows
          }
          break;

        case 'ArrowUp':
          if (newState.section === 'sidebar') {
            newState.sidebarIndex = Math.max(newState.sidebarIndex - 1, 0);
          } else if (newState.section === 'content') {
            // Row logic
          }
          break;

        case 'Enter':
          if (newState.section === 'sidebar') {
            const sections: MenuSection[] = ['home', 'channels', 'ai-live', 'settings'];
            setActiveSection(sections[newState.sidebarIndex]);
          }
          break;
      }

      return newState;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        isFocused={navState.section === 'sidebar'}
        focusedIndex={navState.sidebarIndex}
      />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-12">
        {activeSection === 'home' || activeSection === 'channels' ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="mb-8">
              <h1 className="text-6xl font-black mb-4 tracking-tight">VisionStream</h1>
              <p className="text-2xl text-gray-400">O que você quer assistir hoje?</p>
            </header>

            <ChannelGrid 
              channels={CHANNELS} 
              focusedIndex={navState.contentIndex}
              isFocused={navState.section === 'content'}
              category="Canais Recomendados"
            />

            <ChannelGrid 
              channels={[...CHANNELS].reverse()} 
              focusedIndex={{ row: 1, col: -1 }} // Just for visual demo
              isFocused={false}
              category="Recentemente Assistidos"
            />
          </div>
        ) : activeSection === 'ai-live' ? (
          <AILiveAssistant isActive={activeSection === 'ai-live'} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Configurações</h2>
              <p className="text-gray-500">Área em desenvolvimento para Android TV v2.0</p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Remote Helper for Demo Purposes */}
      <div className="fixed bottom-8 right-8 bg-black/80 p-4 rounded-2xl border border-white/10 hidden md:block text-xs text-gray-400">
        <div className="mb-2 font-bold uppercase text-white/60">Simulador de Controle Remoto</div>
        <div className="grid grid-cols-3 gap-1 w-24 mx-auto mb-2">
          <div /> <div className="p-1 border border-white/20 rounded">↑</div> <div />
          <div className="p-1 border border-white/20 rounded">←</div> 
          <div className="p-1 border border-blue-500 bg-blue-500/20 rounded text-blue-400 font-bold">OK</div>
          <div className="p-1 border border-white/20 rounded">→</div>
          <div /> <div className="p-1 border border-white/20 rounded">↓</div> <div />
        </div>
        <div className="text-center italic">Use as setas e Enter</div>
      </div>
    </div>
  );
};

export default App;
