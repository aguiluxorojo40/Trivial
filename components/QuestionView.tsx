
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Category, CategoryColors } from '../types';
import { CheckCircle, XCircle, BrainCircuit, Timer } from 'lucide-react';

interface QuestionViewProps {
  question: Question;
  category: Category;
  playerName: string;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({ question, category, playerName, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (showResult) return;
    if (timeLeft <= 0) {
      handleAnswer('');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleAnswer = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(option === question.correctAnswer);
    }, 4000);
  };

  const color = CategoryColors[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass rounded-3xl overflow-hidden shadow-2xl border-2"
        style={{ borderColor: color }}
      >
        <div className="p-1" style={{ backgroundColor: color }}>
          <div className="flex justify-between items-center px-6 py-2 text-white font-bold text-sm uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              Categoría: {category}
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center">
            <h3 className="text-slate-400 font-bold uppercase tracking-tight mb-2">Turno de {playerName}</h3>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-white">{question.question}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option, idx) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = option === selected;
              
              let buttonStyle = "bg-slate-800/50 hover:bg-slate-700/50 border-slate-700";
              if (showResult) {
                if (isCorrect) buttonStyle = "bg-green-500/20 border-green-500 text-green-400";
                else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                else buttonStyle = "opacity-50 border-slate-700";
              }

              return (
                <button
                  key={idx}
                  disabled={showResult}
                  onClick={() => handleAnswer(option)}
                  className={`p-5 rounded-2xl border-2 text-lg font-semibold transition-all duration-300 flex items-center justify-between ${buttonStyle}`}
                >
                  <span className="flex-1 text-left">{option}</span>
                  {showResult && isCorrect && <CheckCircle className="w-6 h-6 shrink-0" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 shrink-0" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700"
              >
                <p className="text-slate-300 leading-relaxed">
                  <span className="font-bold text-blue-400 block mb-1">Dato extra:</span>
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionView;
