
import React, { useState, useEffect, useCallback } from 'react';
import { Player, GameState, Category, Question, CategoryColors, Difficulty } from './types';
import { BOARD_SIZE, CATEGORIES_ORDER } from './constants';
import { generateQuestion } from './services/geminiService';
import GameSetup from './components/GameSetup';
import Board from './components/Board';
import DiceRoller from './components/DiceRoller';
import QuestionView from './components/QuestionView';
import { Trophy, RefreshCw, Award, History, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermedia');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  const startNewGame = (setupPlayers: Player[], selectedDifficulty: Difficulty) => {
    setPlayers(setupPlayers);
    setDifficulty(selectedDifficulty);
    setCurrentPlayerIndex(0);
    setGameState('playing');
    setWinner(null);
    setQuestionHistory([]);
  };

  const handleRoll = async (value: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let newPosition = (currentPlayer.position + value) % BOARD_SIZE;
    
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = { ...currentPlayer, position: newPosition };
    setPlayers(updatedPlayers);

    const category = CATEGORIES_ORDER[newPosition % CATEGORIES_ORDER.length];
    
    setLoadingQuestion(true);
    // Pasamos el historial y la dificultad seleccionada
    const question = await generateQuestion(category, questionHistory.slice(-15), difficulty);
    setCurrentQuestion(question);
    
    // Guardamos la pregunta actual en el historial
    setQuestionHistory(prev => [...prev, question.question]);
    
    setLoadingQuestion(false);
    setGameState('question');
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentPos = players[currentPlayerIndex].position;
    const isHQ = currentPos % 6 === 0; 
    const category = CATEGORIES_ORDER[currentPos % CATEGORIES_ORDER.length];
    
    if (isCorrect) {
      const updatedPlayers = [...players];
      const currentPlayer = updatedPlayers[currentPlayerIndex];
      
      if (isHQ && !currentPlayer.tokens.includes(category)) {
        currentPlayer.tokens.push(category);
      }
      
      setPlayers(updatedPlayers);

      if (currentPlayer.tokens.length === 6) {
        setWinner(currentPlayer);
        setGameState('finished');
        return;
      }
    }

    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setGameState('playing');
    setCurrentQuestion(null);
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setQuestionHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30">
      {gameState === 'setup' && <GameSetup onStart={startNewGame} />}

      {(gameState === 'playing' || gameState === 'question' || gameState === 'result') && (
        <div className="flex-1 flex flex-col p-4 md:p-8 relative">
          <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/50 rounded-2xl flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Trivia <span className="text-blue-500">Quest</span></h2>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                    <History className="w-3 h-3" /> Memoria: {questionHistory.length}
                  </p>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                    <Brain className="w-3 h-3" /> Nivel: {difficulty}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition-all flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
            >
              <RefreshCw className="w-3 h-3" />
              Abandonar
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Jugadores Izquierda */}
            <div className="space-y-4 lg:col-span-1">
              {players.slice(0, 3).map((player, idx) => (
                <PlayerPanel key={player.id} player={player} isActive={currentPlayerIndex === idx} />
              ))}
            </div>

            {/* Tablero Central */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center">
              <Board players={players} currentPlayerIndex={currentPlayerIndex} />
              
              <div className="mt-12 flex flex-col items-center gap-4">
                {loadingQuestion ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Analizando Redes Neuronales...</p>
                      <p className="text-slate-600 text-[10px] uppercase font-bold mt-1">Nivel de dificultad {difficulty} cargando</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
                    <DiceRoller onRoll={handleRoll} disabled={gameState !== 'playing'} />
                  </div>
                )}
              </div>
            </div>

            {/* Jugadores Derecha */}
            <div className="space-y-4 lg:col-span-1">
              {players.slice(3, 6).map((player, idx) => (
                <PlayerPanel key={player.id} player={player} isActive={currentPlayerIndex === idx + 3} />
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'question' && currentQuestion && (
        <QuestionView 
          question={currentQuestion} 
          category={CATEGORIES_ORDER[players[currentPlayerIndex].position % CATEGORIES_ORDER.length]}
          playerName={players[currentPlayerIndex].name}
          onAnswer={handleAnswer}
        />
      )}

      <AnimatePresence>
        {gameState === 'finished' && winner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center bg-slate-900 border-2 border-yellow-500/30 p-16 rounded-[4rem] max-w-xl relative overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.1)]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-9xl mb-8 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              >
                🏆
              </motion.div>
              <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
                ¡Dominio <span className="text-yellow-500">Total</span>!
              </h1>
              <h2 className="text-3xl font-bold text-white/90 mb-6">{winner.name}</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">DIFICULTAD: {difficulty}</p>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                Has superado todos los desafíos de la IA en nivel {difficulty}. Tu capacidad de procesamiento de datos es inigualable.
              </p>
              <button
                onClick={resetGame}
                className="px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-3xl font-black text-xl flex items-center gap-3 shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] transition-all transform hover:-translate-y-1 mx-auto uppercase italic"
              >
                Volver al Centro de Mando
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlayerPanel: React.FC<{ player: Player; isActive: boolean }> = ({ player, isActive }) => {
  return (
    <motion.div 
      animate={{ 
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0.7,
        x: isActive ? 10 : 0
      }}
      className={`glass p-5 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${isActive ? 'border-white shadow-[0_0_40px_rgba(255,255,255,0.05)] bg-slate-800/80' : 'border-slate-800/50 bg-slate-900/30'}`}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-1 h-full bg-white shadow-[0_0_15px_white]"></div>
      )}
      
      <div className="flex items-center gap-4 mb-5">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-lg"
          style={{ backgroundColor: `${player.color}30`, borderColor: player.color }}
        >
          {player.avatar}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-black truncate text-lg uppercase italic tracking-tighter">{player.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(player.tokens.length / 6) * 100}%` }}
              />
            </div>
            <span className="text-slate-500 text-[10px] font-bold">{player.tokens.length}/6</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-1">
        {CATEGORIES_ORDER.map((cat, i) => {
          const hasToken = player.tokens.includes(cat);
          return (
            <motion.div 
              key={i} 
              initial={false}
              animate={{ 
                scale: hasToken ? 1.1 : 1,
                rotate: hasToken ? 360 : 0
              }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${hasToken ? 'opacity-100 shadow-lg' : 'opacity-10 grayscale brightness-50'}`}
              style={{ 
                backgroundColor: CategoryColors[cat],
                boxShadow: hasToken ? `0 0 12px ${CategoryColors[cat]}80` : 'none'
              }}
            >
              {hasToken && <Award className="w-4 h-4 text-white" />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default App;
