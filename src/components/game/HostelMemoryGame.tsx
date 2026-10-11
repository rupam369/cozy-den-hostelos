'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Trophy, Award, Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Collectible {
  x: number;
  y: number;
  type: 'chai' | 'samosa' | 'maggi' | 'notes';
  symbol: string;
  points: number;
  speed: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'warden_beam' | 'laundry' | 'slipper';
  name: string;
}

const MEMORIES = [
  {
    score: 250,
    title: 'The 2 AM Maggi Treaty',
    desc: 'Boiling single-pack Maggi in an electric kettle shared between 4 roommates.',
    icon: '🍜',
  },
  {
    score: 600,
    title: 'Terrace Guitar Jam',
    desc: 'Strumming chords under the twilight sky on the Cozy Den rooftop terrace.',
    icon: '🎸',
  },
  {
    score: 1100,
    title: 'Legendary All-Nighter',
    desc: 'Surviving engineering finals with endless cutting chai and shared notes.',
    icon: '☕',
  },
  {
    score: 1800,
    title: 'Warden Sneak Champion',
    desc: 'Successfully smuggling late-night pizza past the biometric gate!',
    icon: '🏆',
  },
];

export default function HostelMemoryGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unlockedMemories, setUnlockedMemories] = useState<typeof MEMORIES>([]);

  // Player position state ref for high performance 60fps loop
  const gameState = useRef({
    playerY: 180,
    playerX: 60,
    playerRadius: 18,
    velocityY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    frame: 0,
    score: 0,
    lives: 3,
    speedMultiplier: 1,
  });

  // Load High Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cozyden_game_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const jump = useCallback(() => {
    if (!gameState.current.isJumping) {
      gameState.current.velocityY = -8.5;
      gameState.current.isJumping = true;
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
          startGame();
        } else if (isPlaying) {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, jump]);

  const startGame = () => {
    gameState.current = {
      playerY: 200,
      playerX: 60,
      playerRadius: 16,
      velocityY: 0,
      isJumping: false,
      obstacles: [],
      collectibles: [],
      frame: 0,
      score: 0,
      lives: 3,
      speedMultiplier: 1,
    };
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsPlaying(true);
    setUnlockedMemories([]);
  };

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const floorY = canvas.height - 40;

    const loop = () => {
      const state = gameState.current;
      state.frame++;

      // Difficulty scaling
      state.speedMultiplier = 1 + Math.floor(state.score / 300) * 0.2;

      // Physics - gravity
      state.velocityY += 0.42;
      state.playerY += state.velocityY;

      // Floor boundary
      if (state.playerY >= floorY - state.playerRadius) {
        state.playerY = floorY - state.playerRadius;
        state.velocityY = 0;
        state.isJumping = false;
      }

      // Ceiling boundary
      if (state.playerY <= state.playerRadius + 10) {
        state.playerY = state.playerRadius + 10;
        state.velocityY = 0;
      }

      // Spawn Obstacles (Warden's beam, laundry, slipper)
      if (state.frame % Math.max(90, Math.floor(150 - state.speedMultiplier * 15)) === 0) {
        const types: Obstacle['type'][] = ['warden_beam', 'laundry', 'slipper'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        
        let width = 24;
        let height = 30;
        let y = floorY - height;
        let name = 'Laundry Heap';

        if (chosen === 'warden_beam') {
          width = 30;
          height = 42;
          y = floorY - height;
          name = 'Warden Flashlight';
        } else if (chosen === 'slipper') {
          width = 22;
          height = 20;
          y = floorY - height;
          name = 'Flying Slipper';
        }

        state.obstacles.push({
          x: canvas.width + 20,
          y,
          width,
          height,
          speed: (3.6 + Math.random() * 1.5) * state.speedMultiplier,
          type: chosen,
          name,
        });
      }

      // Spawn Collectibles (Chai, Samosa, Maggi, Notes)
      if (state.frame % 80 === 0) {
        const items: { type: Collectible['type']; symbol: string; points: number }[] = [
          { type: 'chai', symbol: '☕', points: 50 },
          { type: 'samosa', symbol: '🥟', points: 75 },
          { type: 'maggi', symbol: '🍜', points: 100 },
          { type: 'notes', symbol: '📚', points: 150 },
        ];
        const selected = items[Math.floor(Math.random() * items.length)];

        state.collectibles.push({
          x: canvas.width + 10,
          y: floorY - 50 - Math.random() * 80,
          type: selected.type,
          symbol: selected.symbol,
          points: selected.points,
          speed: 3.2 * state.speedMultiplier,
        });
      }

      // Update & check collectibles
      for (let i = state.collectibles.length - 1; i >= 0; i--) {
        const c = state.collectibles[i];
        c.x -= c.speed;

        // Collision with player
        const dist = Math.hypot(state.playerX - c.x, state.playerY - c.y);
        if (dist < state.playerRadius + 14) {
          state.score += c.points;
          setScore(state.score);

          // Check Memory unlocks
          MEMORIES.forEach((m) => {
            if (state.score >= m.score && !unlockedMemories.some((u) => u.score === m.score)) {
              setUnlockedMemories((prev) => [...prev, m]);
              triggerConfetti();
            }
          });

          state.collectibles.splice(i, 1);
          continue;
        }

        if (c.x < -30) {
          state.collectibles.splice(i, 1);
        }
      }

      // Update & check obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= obs.speed;

        // Bounding box collision check
        if (
          state.playerX + state.playerRadius > obs.x &&
          state.playerX - state.playerRadius < obs.x + obs.width &&
          state.playerY + state.playerRadius > obs.y &&
          state.playerY - state.playerRadius < obs.y + obs.height
        ) {
          // Hit obstacle!
          state.lives -= 1;
          setLives(state.lives);
          state.obstacles.splice(i, 1);

          if (state.lives <= 0) {
            // Game Over
            setIsGameOver(true);
            setIsPlaying(false);
            if (state.score > highScore) {
              setHighScore(state.score);
              try {
                localStorage.setItem('cozyden_game_highscore', state.score.toString());
              } catch {}
            }
            return;
          }
          continue;
        }

        if (obs.x < -40) {
          state.obstacles.splice(i, 1);
          state.score += 10; // Passing an obstacle gives points
          setScore(state.score);
        }
      }

      // Clear & Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Retro 8-bit Background - Hostel Corridor
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Corridor Floor Line
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(canvas.width, floorY);
      ctx.stroke();

      // Retro Grid Lines on Floor
      ctx.strokeStyle = '#0e7490';
      ctx.lineWidth = 1;
      for (let x = (state.frame * 2) % 40; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x - 30, canvas.height);
        ctx.stroke();
      }

      // Hostel Corridor Doors in background
      for (let x = 60 - ((state.frame * 0.8) % 180); x < canvas.width; x += 180) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, floorY - 90, 45, 90);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(x, floorY - 90, 45, 90);

        // Room Number Plate
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText('304', x + 12, floorY - 70);
      }

      // Draw Collectibles
      state.collectibles.forEach((c) => {
        ctx.font = '20px sans-serif';
        ctx.fillText(c.symbol, c.x - 10, c.y + 7);
      });

      // Draw Obstacles
      state.obstacles.forEach((obs) => {
        if (obs.type === 'warden_beam') {
          // Glowing flashlight beam cone
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width, obs.y);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ef4444';
          ctx.font = '22px sans-serif';
          ctx.fillText('🔦', obs.x, obs.y + 24);
        } else if (obs.type === 'laundry') {
          ctx.font = '22px sans-serif';
          ctx.fillText('🧺', obs.x, obs.y + 24);
        } else {
          ctx.font = '20px sans-serif';
          ctx.fillText('🩴', obs.x, obs.y + 18);
        }
      });

      // Draw Player (Retro Student Sprite)
      const px = state.playerX;
      const py = state.playerY;

      // Glow behind player
      const grad = ctx.createRadialGradient(px, py, 4, px, py, 26);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 26, 0, Math.PI * 2);
      ctx.fill();

      // Student Avatar Emoji / Sprite
      ctx.font = '24px sans-serif';
      ctx.fillText(state.isJumping ? '🏃‍♂️' : '🚶‍♂️', px - 12, py + 8);

      // CRT Scanline Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, highScore, unlockedMemories]);

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
      
      {/* Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              [ 8-BIT RETRO NOSTALGIA ]
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-semibold border border-emerald-500/30">
              Curfew Run v1.0
            </span>
          </div>
          <h3 className="text-xl font-black tracking-wide text-white font-mono">
            HOSTEL LIFE MEMORIES
          </h3>
          <p className="text-xs text-slate-400">
            Dodge the roaming Warden&apos;s flashlight. Collect Chai & Maggi to unlock true hostel moments!
          </p>
        </div>

        {/* Score & Lives HUD */}
        <div className="flex items-center gap-4 font-mono">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-slate-400">Score</p>
            <p className="text-lg font-bold text-cyan-400">{score}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-slate-400">High Score</p>
            <p className="text-lg font-bold text-amber-400">{highScore}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-slate-400">Lives</p>
            <div className="flex items-center gap-1 justify-center mt-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 ${
                    i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full rounded-2xl border-2 border-emerald-500/30 overflow-hidden bg-black shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <canvas
          ref={canvasRef}
          width={800}
          height={260}
          className="w-full h-[260px] block"
        />

        {/* CRT Scanline Green Tint */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />

        {/* Start / Game Over Overlays */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 text-center">
            {isGameOver ? (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <p className="font-mono text-sm uppercase text-rose-400 font-bold tracking-widest">
                  🚨 CAUGHT BY WARDEN!
                </p>
                <h4 className="text-2xl font-black text-white font-mono">GAME OVER</h4>
                <p className="text-xs text-slate-300">
                  Final Memory Score: <span className="text-cyan-400 font-bold">{score}</span>
                </p>
                <button
                  onClick={startGame}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>PLAY AGAIN (Spacebar)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase text-emerald-400 tracking-wider">
                  PRESS SPACEBAR OR BUTTON TO SPRINT
                </p>
                <h4 className="text-2xl font-black text-white font-mono">
                  LATE NIGHT CORRIDOR RUN
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Jump over laundry heaps & the Warden&apos;s flashlight. Catch Chai ☕, Samosas 🥟 & Maggi 🍜!
                </p>
                <button
                  onClick={startGame}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-7 py-3 text-sm font-bold text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>START CURFEW RUN</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* On-screen Jump Button for Mobile */}
        {isPlaying && (
          <button
            onClick={jump}
            className="sm:hidden absolute bottom-3 right-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/80 text-white font-bold text-xs shadow-xl backdrop-blur-md active:scale-95"
          >
            JUMP
          </button>
        )}
      </div>

      {/* Unlocked Nostalgic Memory Gallery */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Unlocked Hostel Memories ({unlockedMemories.length}/{MEMORIES.length})</span>
          </h4>
          <span className="text-[11px] text-slate-400">Score points to unlock moments</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {MEMORIES.map((m) => {
            const isUnlocked = score >= m.score || unlockedMemories.some((u) => u.score === m.score);
            return (
              <div
                key={m.score}
                className={`rounded-2xl border p-3 transition-all ${
                  isUnlocked
                    ? 'border-amber-500/30 bg-amber-950/20 shadow-lg'
                    : 'border-white/5 bg-white/5 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <h5 className="text-xs font-semibold text-white">{m.title}</h5>
                    <span className="text-[10px] text-amber-400 font-mono">Unlock: {m.score} pts</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
