
import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Waves, Volume2, Bot } from 'lucide-react';
import { geminiLive } from '../services/geminiService';

interface AILiveAssistantProps {
  isActive: boolean;
}

export const AILiveAssistant: React.FC<AILiveAssistantProps> = ({ isActive }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      handleStart();
    } else {
      geminiLive.stopSession();
      setIsListening(false);
    }
    return () => geminiLive.stopSession();
  }, [isActive]);

  const handleStart = async () => {
    try {
      setError(null);
      await geminiLive.startSession({
        onOpen: () => setIsListening(true),
        onMessage: (text) => console.log('AI Response:', text),
        onError: (e) => {
          console.error(e);
          setError('Houve um erro na conexão com a IA.');
          setIsListening(false);
        }
      });
    } catch (e) {
      setError('Acesso ao microfone negado ou erro na API.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-500
            ${isListening ? 'scale-110 shadow-[0_0_80px_rgba(59,130,246,0.6)]' : 'opacity-50'}
          `}>
            {isListening ? (
              <Waves className="w-24 h-24 text-white animate-pulse" />
            ) : (
              <MicOff className="w-24 h-24 text-white/50" />
            )}
          </div>
          
          {isListening && (
            <div className="absolute -inset-4 rounded-full border-2 border-blue-500/30 animate-ping" />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Assistente AI em Tempo Real</h2>
          <p className="text-xl text-gray-400">
            {isListening 
              ? "Estou ouvindo... Pergunte sobre o que assistir ou controle sua TV por voz." 
              : "Iniciando conexão segura com Gemini Live..."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left">
            <Volume2 className="text-blue-400 mb-3" />
            <h4 className="font-bold text-lg">"O que tem de novo nos esportes?"</h4>
            <p className="text-gray-400 text-sm">O assistente busca canais de esporte ao vivo.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left">
            <Bot className="text-purple-400 mb-3" />
            <h4 className="font-bold text-lg">"Explique o canal de natureza"</h4>
            <p className="text-gray-400 text-sm">IA analisa o conteúdo e resume para você.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
