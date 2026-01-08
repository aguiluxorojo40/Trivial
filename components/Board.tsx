
import React from 'react';
import { motion } from 'framer-motion';
import { Category, CategoryColors, Player } from '../types';
import { BOARD_SIZE, CATEGORIES_ORDER } from '../constants';
import { MapPin, Zap } from 'lucide-react';

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

const Board: React.FC<BoardProps> = ({ players, currentPlayerIndex }) => {
  // Calculamos posiciones en un hexágono con radios
  const getTileCoords = (index: number) => {
    const centerX = 400;
    const centerY = 300;
    const radius = 240;
    
    // Si index es múltiplo de 6, es un HQ (esquina)
    const isHQ = index % 6 === 0;
    const angle = (index / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;
    
    // Añadimos un poco de distorsión hexagonal
    const hexRadius = radius * (isHQ ? 1.1 : 1);
    
    return {
      x: Math.cos(angle) * hexRadius + centerX,
      y: Math.sin(angle) * hexRadius + centerY,
      isHQ
    };
  };

  return (
    <div className="relative w-full max-w-5xl aspect-[4/3] mx-auto overflow-visible select-none">
      {/* Líneas de conexión (Radios) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="300" r="240" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="10 5" />
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <line 
            key={angle}
            x1="400" y1="300" 
            x2={400 + Math.cos(angle * Math.PI / 180) * 240} 
            y2={300 + Math.sin(angle * Math.PI / 180) * 240} 
            stroke="white" strokeWidth="1" 
          />
        ))}
      </svg>

      {/* Núcleo Central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-dashed border-blue-500/30 flex items-center justify-center"
        >
          <div className="w-24 h-24 bg-slate-900 rounded-full border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center p-4 text-center">
            <h1 className="text-xs font-black text-white leading-none uppercase tracking-tighter italic">
              CENTRO DE<br/><span className="text-blue-500 text-lg">DATOS</span>
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Casillas */}
      {[...Array(BOARD_SIZE)].map((_, i) => {
        const coords = getTileCoords(i);
        const category = CATEGORIES_ORDER[i % CATEGORIES_ORDER.length];
        const color = CategoryColors[category];
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`absolute flex items-center justify-center transition-all ${coords.isHQ ? 'w-16 h-16 -ml-8 -mt-8' : 'w-12 h-12 -ml-6 -mt-6'}`}
            style={{ left: coords.x, top: coords.y }}
          >
            <div 
              className={`w-full h-full rounded-2xl border-2 flex items-center justify-center relative overflow-hidden group ${coords.isHQ ? 'border-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-slate-700/50'}`}
              style={{ 
                backgroundColor: `${color}${coords.isHQ ? '40' : '15'}`, 
                borderColor: color,
                boxShadow: coords.isHQ ? `0 0 25px ${color}60` : 'none'
              }}
            >
               {coords.isHQ && (
                 <Zap className="w-6 h-6 absolute opacity-20 text-white animate-pulse" />
               )}
               <span className="text-[10px] font-black text-white/40 group-hover:text-white transition-colors">{i === 0 ? '★' : i}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Jugadores */}
      {players.map((player, idx) => {
        const coords = getTileCoords(player.position);
        const playersOnSameTile = players.filter(p => p.position === player.position);
        const myIndexOnTile = playersOnSameTile.findIndex(p => p.id === player.id);
        const offset = (myIndexOnTile - (playersOnSameTile.length - 1) / 2) * 20;

        return (
          <motion.div
            key={player.id}
            layoutId={`player-${player.id}`}
            animate={{ 
              x: coords.x + offset - 20, 
              y: coords.y + offset - 20,
              scale: currentPlayerIndex === idx ? 1.3 : 1,
              zIndex: currentPlayerIndex === idx ? 50 : 20
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
            style={{ 
                backgroundColor: player.color,
                border: currentPlayerIndex === idx ? '3px solid white' : '2px solid rgba(255,255,255,0.8)',
                boxShadow: currentPlayerIndex === idx ? `0 0 30px ${player.color}` : 'none'
            }}
          >
            <span className="text-2xl drop-shadow-md">{player.avatar}</span>
            {currentPlayerIndex === idx && (
              <motion.div 
                className="absolute -top-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div className="bg-white text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap uppercase shadow-lg border border-slate-200">
                  TU TURNO
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default Board;
