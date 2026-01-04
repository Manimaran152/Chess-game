
import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { GameStatus, GameMode } from '../types';

interface GameUIProps {
  game: Chess;
  status: GameStatus;
  onStartNewGame: (mode: GameMode, color?: 'w' | 'b') => void;
}

const GameUI: React.FC<GameUIProps> = ({ game, status, onStartNewGame }) => {
  const [showMenu, setShowMenu] = useState(true);
  const currentTurn = status.turn === 'w' ? 'White' : 'Black';

  const copyRoomId = () => {
    if (status.roomId) {
      navigator.clipboard.writeText(`https://chess-3d.app/#room=${status.roomId}`);
      alert("Room link copied to clipboard! (Simulation mode)");
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-6">
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-none">
              GRANDMASTER 3D
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${status.turn === 'w' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-slate-950 shadow-[0_0_10px_black] border border-slate-600'}`}></div>
              <span className="text-slate-300 text-sm font-bold uppercase tracking-widest">{currentTurn}'s Turn</span>
            </div>
          </div>
          
          <div className="h-10 w-px bg-slate-700/50"></div>

          <div className="text-xs font-mono text-slate-400">
             MODE: <span className="text-cyan-400 font-bold uppercase">{status.mode}</span>
             {status.roomId && <div className="mt-1 text-slate-500">ROOM: {status.roomId}</div>}
          </div>
        </div>

        <button 
          onClick={() => setShowMenu(true)}
          className="bg-slate-900/80 backdrop-blur-xl px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          Menu
        </button>
      </div>

      {/* Center Status Indicators */}
      <div className="flex flex-col items-center gap-6">
        {status.aiThinking && (
          <div className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/50 text-cyan-200 px-6 py-2 rounded-full font-bold animate-pulse shadow-lg pointer-events-auto">
             Gemini AI is thinking...
          </div>
        )}

        {status.isCheck && !status.isCheckmate && (
          <div className="bg-rose-500 text-white px-8 py-2 rounded-full font-black animate-bounce shadow-xl pointer-events-auto ring-4 ring-rose-500/20">
            CHECK!
          </div>
        )}

        {/* Room Link Tooltip */}
        {status.mode === 'remote' && status.roomId && (
          <button 
            onClick={copyRoomId}
            className="pointer-events-auto bg-slate-800/80 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold text-slate-300 border border-slate-700 transition-all"
          >
            Share Room Link: <span className="text-cyan-400">{status.roomId}</span>
          </button>
        )}
      </div>

      {/* Game Over Modal */}
      {(status.isCheckmate || status.isDraw) && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-slate-900 border border-slate-700 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full mx-4">
            <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center border border-slate-700">
               <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-3xl font-black mb-2">Game Over</h2>
            <p className="text-slate-400 mb-8 font-medium">
              {status.isCheckmate 
                ? `${status.winner === 'w' ? 'White' : 'Black'} wins by Checkmate!` 
                : 'The game ended in a Draw.'}
            </p>
            <button 
              onClick={() => setShowMenu(true)}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 uppercase tracking-widest"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Main Menu Modal */}
      {showMenu && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-md mx-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            
            <h2 className="text-2xl font-black mb-1 text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-tighter">Grandmaster 3D</h2>
            <p className="text-slate-500 text-xs text-center mb-8 font-bold uppercase tracking-widest">Select Play Mode</p>

            <div className="space-y-4">
              <MenuButton 
                title="Gemini AI Battle" 
                subtitle="Play against the Gemini 3 Flash model"
                icon="🤖"
                onClick={() => { onStartNewGame('ai', 'w'); setShowMenu(false); }}
              />
              <MenuButton 
                title="Local Multiplayer" 
                subtitle="Two players on the same device"
                icon="👥"
                onClick={() => { onStartNewGame('local'); setShowMenu(false); }}
              />
              <MenuButton 
                title="Virtual Room" 
                subtitle="Link with another player remotely"
                icon="🔗"
                onClick={() => { onStartNewGame('remote'); setShowMenu(false); }}
              />
            </div>

            <button 
              onClick={() => setShowMenu(false)}
              className="mt-8 w-full py-3 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-900/40 backdrop-blur-sm px-6 py-2 rounded-full text-[10px] text-slate-500 border border-slate-800 self-center uppercase font-bold tracking-widest">
        Drag: Orbit | Scroll: Zoom | Gemini Powered Engine
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ title: string; subtitle: string; icon: string; onClick: () => void }> = ({ title, subtitle, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-cyan-500/30 transition-all text-left group active:scale-[0.98]"
  >
    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-800 group-hover:border-cyan-500/20 transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{title}</div>
      <div className="text-[10px] text-slate-500 font-medium">{subtitle}</div>
    </div>
    <div className="text-slate-600 group-hover:text-cyan-500 transition-all">
      →
    </div>
  </button>
);

export default GameUI;
