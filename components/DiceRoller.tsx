
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DiceRollerProps {
  onRoll: (value: number) => void;
  disabled: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, disabled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);

  const rollDice = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        onRoll(finalValue);
      }
    }, 100);
  };

  const getDots = (num: number) => {
    const dotPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    return dotPositions[num];
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={rollDice}
        className={`w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer relative overflow-hidden ${disabled ? 'opacity-50 grayscale' : 'hover:shadow-blue-500/50'}`}
        animate={isRolling ? {
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
        } : {}}
        transition={isRolling ? { duration: 0.5, repeat: 1 } : {}}
      >
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-12 h-12">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {getDots(diceValue).includes(i) && (
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
      <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
        {isRolling ? 'Lanzando...' : 'Pulsa para tirar'}
      </p>
    </div>
  );
};

export default DiceRoller;
