
import React from 'react';
import { Channel } from '../types';

interface ChannelGridProps {
  channels: Channel[];
  focusedIndex: { row: number; col: number };
  isFocused: boolean;
  category: string;
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, focusedIndex, isFocused, category }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{category}</h2>
        <div className="text-sm text-gray-400">Ver todos &rarr;</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {channels.map((channel, index) => {
          const isItemFocused = isFocused && focusedIndex.col === index;
          
          return (
            <div
              key={channel.id}
              className={`relative group rounded-2xl overflow-hidden bg-white/5 transition-all duration-300 border border-transparent
                ${isItemFocused ? 'ring-4 ring-blue-500 scale-105 shadow-2xl z-10' : ''}
              `}
            >
              <div className="aspect-video relative">
                <img src={channel.thumbnail} alt={channel.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {channel.isLive && (
                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AO VIVO</span>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-blue-400 font-semibold mb-1">{channel.category}</div>
                  <h3 className="text-xl font-bold truncate">{channel.title}</h3>
                  <div className="text-sm text-gray-400 mt-1">{channel.viewers} assistindo agora</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
