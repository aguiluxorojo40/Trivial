
import React, { useState } from 'react';
import { Player, Difficulty } from '../types';
import { AVATARS, PLAYER_COLORS } from '../constants';
import { UserPlus, Play, X, Trophy, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameSetupProps {
  onStart: (players: Player[], difficulty: Difficulty) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermedia');
  const [players, setPlayers] = useState<Partial<Player>[]>([
    { id: 1, name: 'Jugador 1', avatar: AVATARS[0], color: PLAYER_COLORS[0], position: 0, tokens: [] },
    { id: 2, name: 'Jugador 2', avatar: AVATARS[1], color: PLAYER_COLORS[1], position: 0, tokens: [] }
  ]);

  const addPlayer = () => {
    if (players.length >= 6) return;
    const nextId = players.length + 1;
    setPlayers([...players, { 
      id: nextId, 
      name: `Jugador ${nextId}`, 
      avatar: AVATARS[nextId % AVATARS.length], 
      color: PLAYER_COLORS[nextId % PLAYER_COLORS.length], 
      position: 0, 
      tokens: [] 
    }]);
  };

  const removePlayer = (id: number) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayer = (id: number, updates: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const difficulties: { value: Difficulty; label: string; color: string; desc: string }[] = [
    { value: 'fácil', label: 'Fácil', color: '#22c55e', desc: 'Conceptos generales' },
    { value: 'intermedia', label: 'Intermedia', color: '#3b82f6', desc: 'Reto equilibrado' },
    { value: 'extrema', label: 'Extrema', color: '#ef4444', desc: 'Solo para expertos' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col items-center min-h-screen py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 text-blue-500">
            <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
            Trivia<span className="text-blue-500">Quest</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium">Configura tu experiencia de IA generativa</p>
      </motion.div>

      {/* Selector de Dificultad */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl glass p-6 rounded-[2.5rem] mb-12 border-slate-700/50"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
            <Settings2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Nivel de Desafío</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              onClick={() => setDifficulty(diff.value)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 group ${
                difficulty === diff.value 
                ? 'bg-slate-800 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
              style={{ borderColor: difficulty === diff.value ? diff.color : undefined }}
            >
              <span className={`text-sm font-black uppercase tracking-widest ${difficulty === diff.value ? 'text-white' : 'text-slate-500'}`} style={{ color: difficulty === diff.value ? diff.color : undefined }}>
                {diff.label}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{diff.desc}</span>
              {difficulty === diff.value && (
                <motion.div layoutId="activeDiff" className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: diff.color }} />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        {players.map((player) => (
          <motion.div 
            layout
            key={player.id}
            className="glass p-6 rounded-3xl relative group border-2 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
          >
            {players.length > 2 && (
              <button 
                onClick={() => removePlayer(player.id!)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-4"
                style={{ borderColor: player.color, backgroundColor: `${player.color}20` }}
              >
                {player.avatar}
              </div>
              
              <div className="w-full space-y-3">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayer(player.id!, { name: e.target.value })}
                  placeholder="Nombre del jugador"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
                
                <div className="flex justify-center gap-2 overflow-x-auto py-1 scrollbar-hide">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => updatePlayer(player.id!, { avatar: emoji })}
                      className={`text-xl p-1 rounded-lg hover:bg-slate-800 transition-colors ${player.avatar === emoji ? 'bg-slate-700 ring-2 ring-blue-500' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {players.length < 6 && (
          <button
            onClick={addPlayer}
            className="h-full min-h-[220px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300"
          >
            <UserPlus className="w-12 h-12 mb-2" />
            <span className="font-bold uppercase tracking-widest text-sm">Añadir Jugador</span>
          </button>
        )}
      </div>

      <button
        onClick={() => onStart(players as Player[], difficulty)}
        className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl flex items-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transition-all transform hover:-translate-y-1 active:scale-95 group uppercase italic tracking-wider"
      >
        Iniciar Protocolo
        <Play className="w-6 h-6 fill-white group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default GameSetup;
