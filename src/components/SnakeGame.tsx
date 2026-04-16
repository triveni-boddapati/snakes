import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 360; // 20x20 grid
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const snakeRef = useRef(INITIAL_SNAKE);
  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);
  const foodRef = useRef({ x: 5, y: 5 });
  const gameLoopRef = useRef<number>();
  const lastRenderTimeRef = useRef(0);
  const SNAKE_SPEED = 10; // moves per second

  const generateFood = () => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setHasStarted(true);
    setIsPaused(false);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (gameOver || !hasStarted)) {
        resetGame();
        return;
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#111111'; // card-bg
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CANVAS_SIZE / GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food (Neon Purple)
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#bc13fe';
    ctx.fillStyle = '#bc13fe';
    const foodX = foodRef.current.x * (CANVAS_SIZE / GRID_SIZE);
    const foodY = foodRef.current.y * (CANVAS_SIZE / GRID_SIZE);
    const cellSize = CANVAS_SIZE / GRID_SIZE;
    
    ctx.beginPath();
    ctx.arc(foodX + cellSize/2, foodY + cellSize/2, cellSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake (Neon Green)
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#39ff14';
    
    snakeRef.current.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    ctx.shadowBlur = 0; // Reset shadow
  };

  const updateGame = () => {
    if (gameOver || isPaused || !hasStarted) return;

    directionRef.current = nextDirectionRef.current;
    const head = snakeRef.current[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y,
    };

    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      setGameOver(true);
      return;
    }

    // Check self collision
    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    // Check food collision
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      setScore(s => s + 10);
      generateFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const main = (currentTime: number) => {
      gameLoopRef.current = requestAnimationFrame(main);
      const secondsSinceLastRender = (currentTime - lastRenderTimeRef.current) / 1000;
      
      if (secondsSinceLastRender < 1 / SNAKE_SPEED) {
        // Just draw, don't update logic
        drawGame(ctx);
        return;
      }

      lastRenderTimeRef.current = currentTime;
      updateGame();
      drawGame(ctx);
    };

    gameLoopRef.current = requestAnimationFrame(main);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameOver, isPaused, hasStarted]);

  return (
    <section className="bg-card-bg border border-neon-purple rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-center col-start-2 row-start-1 shadow-[inset_0_0_20px_rgba(188,19,254,0.1)] h-full">
      <span className="text-[10px] uppercase tracking-[2px] text-muted absolute top-5 left-5">Neural Link Game</span>
      
      <div className="flex justify-between items-center w-full max-w-[360px] mb-4 mt-6">
        <div className="text-neon-purple font-bold text-xl tracking-widest drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-neon-blue font-bold text-sm tracking-widest animate-pulse">
          {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : ''}
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-[#333] bg-card-bg w-[360px] h-[360px]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '18px 18px'
          }}
        />
        
        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 border-2 border-neon-purple z-10">
            <h2 className="text-3xl font-bold text-neon-green mb-2 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
              NEON SNAKE
            </h2>
            {gameOver && (
              <p className="text-neon-purple text-xl mb-6 drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]">
                FINAL SCORE: {score}
              </p>
            )}
            <p className="text-muted mb-8 text-xs max-w-xs uppercase">
              Use WASD to navigate the grid. Press SPACE to pause/resume.
            </p>
            <button
              onClick={resetGame}
              className="bg-text text-bg font-bold border-none px-6 py-2.5 cursor-pointer rounded-lg font-inherit text-xs hover:bg-neon-green hover:text-bg"
            >
              {gameOver ? 'PLAY AGAIN' : 'START GAME'}
            </button>
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted mt-4 uppercase">USE WASD TO NAVIGATE THE GRID</p>
    </section>
  );
}
