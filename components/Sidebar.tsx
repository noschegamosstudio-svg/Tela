
import React from 'react';
import { Home, Tv, Bot, Settings, Search } from 'lucide-react';
import { MenuSection } from '../types';

interface SidebarProps {
  activeSection: MenuSection;
  isFocused: boolean;
  focusedIndex: number;
}

const menuItems = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'channels', icon: Tv, label: 'Canais' },
  { id: 'ai-live', icon: Bot, label: 'AI Live' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, isFocused, focusedIndex }) => {
  return (
    <div className={`w-24 md:w-64 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 ${isFocused ? 'bg-black/60' : ''}`}>
      <div className="p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hidden md:block">
          VisionStream
        </h1>
        <div className="md:hidden flex justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">V</div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-4">
        {menuItems.map((item, index) => {
          const isActive = activeSection === item.id;
          const isItemFocused = isFocused && focusedIndex === index;
          
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer
                ${isActive ? 'bg-white/10 text-white' : 'text-gray-400'}
                ${isItemFocused ? 'bg-blue-600 text-white scale-105 shadow-lg shadow-blue-500/20' : ''}
              `}
            >
              <item.icon size={24} strokeWidth={isItemFocused ? 3 : 2} />
              <span className="hidden md:block font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="p-8 text-xs text-gray-500 hidden md:block">
        <p>© 2025 VisionStream</p>
        <p>Beta v1.0.4</p>
      </div>
    </div>
  );
};
