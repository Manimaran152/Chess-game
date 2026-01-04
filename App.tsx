
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Chess } from 'chess.js';
import { GoogleGenAI } from "@google/genai";
import ChessScene from './components/ChessScene';
import GameUI from './components/GameUI';
import { GameStatus, GameMode } from './types';

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [mode, setMode] = useState<GameMode>('local');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  const gameStatus: GameStatus = useMemo(() => ({
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    turn: game.turn(),
    winner: game.isCheckmate() ? (game.turn() === 'w' ? 'b' : 'w') : (game.isDraw() ? 'draw' : null),
    mode,
    aiThinking: isAiThinking,
    roomId
  }), [game, mode, isAiThinking, roomId]);

  // AI Logic with Gemini
  const makeAiMove = useCallback(async (currentFen: string) => {
    setIsAiThinking(true);
    try {
      // Fix: Create instance right before making the call.
      // Fix: Always use named parameter for apiKey and use process.env.API_KEY directly.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const chess = new Chess(currentFen);
      const movesStr = chess.moves().join(', ');
      
      const prompt = `You are a Grandmaster Chess Engine.
      Current board FEN: ${currentFen}
      The valid moves are: ${movesStr}
      Think carefully and return only the best move in Standard Algebraic Notation (SAN), e.g., "Nf3" or "e4".
      Do not provide any explanation, just the move string.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      // Fix: response.text is a property, not a method.
      const bestMove = response.text?.trim() || '';
      
      try {
        const moveResult = game.move(bestMove);
        if (moveResult) {
          setGame(new Chess(game.fen()));
          setLastMove({ from: moveResult.from, to: moveResult.to });
        } else {
          // Fallback to random valid move
          const moves = game.moves();
          if (moves.length > 0) {
            const fallback = moves[Math.floor(Math.random() * moves.length)];
            const res = game.move(fallback);
            if (res) {
              setGame(new Chess(game.fen()));
              setLastMove({ from: res.from, to: res.to });
            }
          }
        }
      } catch (e) {
        // Handle invalid SAN returned by AI
        const moves = game.moves();
        if (moves.length > 0) {
          const fallback = moves[Math.floor(Math.random() * moves.length)];
          const res = game.move(fallback);
          if (res) {
            setGame(new Chess(game.fen()));
            setLastMove({ from: res.from, to: res.to });
          }
        }
      }
    } catch (error) {
      console.error("AI Move failed", error);
    } finally {
      setIsAiThinking(false);
    }
  }, [game]);

  useEffect(() => {
    // Trigger AI move if it's the AI's turn
    if (mode === 'ai' && game.turn() !== playerColor && !gameStatus.isCheckmate && !gameStatus.isDraw) {
      const timer = setTimeout(() => makeAiMove(game.fen()), 600);
      return () => clearTimeout(timer);
    }
  }, [game, mode, playerColor, gameStatus, makeAiMove]);

  const onSquareClick = useCallback((square: string) => {
    if (gameStatus.isCheckmate || gameStatus.isDraw || isAiThinking) return;

    // In AI mode, prevent moving pieces that aren't the player's
    if (mode === 'ai' && game.turn() !== playerColor) return;

    if (selectedSquare) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });

        if (move) {
          setGame(new Chess(game.fen()));
          setLastMove({ from: move.from, to: move.to });
          setSelectedSquare(null);
          return;
        }
      } catch (e) {}
    }

    const piece = game.get(square as any);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  }, [game, selectedSquare, gameStatus, isAiThinking, mode, playerColor]);

  const startNewGame = useCallback((newMode: GameMode, color: 'w' | 'b' = 'w') => {
    const newGame = new Chess();
    setGame(newGame);
    setSelectedSquare(null);
    setLastMove(null);
    setMode(newMode);
    setPlayerColor(color);
    if (newMode === 'remote') {
      setRoomId(Math.random().toString(36).substring(7).toUpperCase());
    } else {
      setRoomId(undefined);
    }
  }, []);

  const validMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return game.moves({ square: selectedSquare as any, verbose: true }).map(m => m.to);
  }, [game, selectedSquare]);

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white font-sans overflow-hidden">
      <div className="absolute inset-0">
        <ChessScene 
          game={game}
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          lastMove={lastMove}
          onSquareClick={onSquareClick}
        />
      </div>

      <GameUI 
        game={game} 
        status={gameStatus} 
        onStartNewGame={startNewGame}
      />
    </div>
  );
};

export default App;
