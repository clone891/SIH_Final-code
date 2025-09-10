import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Wind, Trophy, Heart, Brain, MousePointerClick, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Phase = "idle" | "inhale" | "hold" | "exhale";

const BREATH_DURATIONS = {
  inhale: 4,
  hold: 7,
  exhale: 8,
} as const;

const GamifiedDashboardPage = () => {
  // Breathing Pacer (4-7-8 technique)
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const targetEndRef = useRef<number | null>(null);
  const currentPhaseDurationRef = useRef<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("breathing_best_streak");
    if (stored) setBestStreak(Number(stored));
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const goToPhase = (next: Phase) => {
    setPhase(next);
    let dur = 0;
    if (next === "inhale") dur = BREATH_DURATIONS.inhale;
    if (next === "hold") dur = BREATH_DURATIONS.hold;
    if (next === "exhale") dur = BREATH_DURATIONS.exhale;
    currentPhaseDurationRef.current = dur;
    setSecondsLeft(dur);
    targetEndRef.current = performance.now() + dur * 1000;
  };

  const advance = () => {
    setPhase((p) => {
      if (p === "inhale") return "hold";
      if (p === "hold") return "exhale";
      if (p === "exhale") return "inhale";
      return "inhale";
    });
    setTimeout(() => {
      setCycles((c) => {
        if (phase === "exhale") {
          const next = c + 1;
          if (next > bestStreak) {
            setBestStreak(next);
            localStorage.setItem("breathing_best_streak", String(next));
          }
          return next;
        }
        return c;
      });
    }, 0);
  };

  const tick = () => {
    if (!running || !targetEndRef.current) return;
    const remaining = Math.max(0, targetEndRef.current - performance.now());
    const sec = Math.ceil(remaining / 100) / 10;
    setSecondsLeft(parseFloat(sec.toFixed(1)));
    if (remaining <= 0) {
      advance();
    }
  };

  useEffect(() => {
    if (!running) return;
    goToPhase(phase === "idle" ? "inhale" : phase);
    clearTimer();
    timerRef.current = window.setInterval(tick, 100);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  const start = () => {
    if (running) return;
    setCycles(0);
    setPhase("inhale");
    setRunning(true);
  };

  const pause = () => {
    setRunning(false);
    clearTimer();
  };

  const reset = () => {
    pause();
    setPhase("idle");
    setSecondsLeft(0);
    setCycles(0);
  };

  const phaseLabel = useMemo(() => {
    if (!running && phase === "idle") return "Ready";
    if (phase === "inhale") return "Inhale";
    if (phase === "hold") return "Hold";
    if (phase === "exhale") return "Exhale";
    return "";
  }, [phase, running]);

  const phaseProgress = useMemo(() => {
    if (!currentPhaseDurationRef.current) return 0;
    const dur = currentPhaseDurationRef.current;
    return Math.min(1, Math.max(0, 1 - secondsLeft / dur));
  }, [secondsLeft]);

  const pacerScale = useMemo(() => {
    if (phase === "inhale") return 1 + 0.35 * phaseProgress;
    if (phase === "hold") return 1.35;
    if (phase === "exhale") return 1.35 - 0.35 * phaseProgress;
    return 1;
  }, [phase, phaseProgress]);

  // Mindful Tap game (tap only when green)
  type TapState = "idle" | "playing" | "ended";
  const [tapState, setTapState] = useState<TapState>("idle");
  const [cue, setCue] = useState<"green" | "red">("red");
  const [score, setScore] = useState(0);
  const [tapTimeLeft, setTapTimeLeft] = useState(30);
  const [tapBest, setTapBest] = useState<number>(() => Number(localStorage.getItem("mindful_tap_best") || 0));
  const cueTimerRef = useRef<number | null>(null);
  const gameTimerRef = useRef<number | null>(null);

  const stopTapTimers = () => {
    if (cueTimerRef.current) clearInterval(cueTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    cueTimerRef.current = null;
    gameTimerRef.current = null;
  };

  const startTap = () => {
    stopTapTimers();
    setTapState("playing");
    setScore(0);
    setTapTimeLeft(30);
    setCue(Math.random() < 0.5 ? "green" : "red");
    cueTimerRef.current = window.setInterval(() => {
      setCue(Math.random() < 0.5 ? "green" : "red");
    }, 700);
    gameTimerRef.current = window.setInterval(() => {
      setTapTimeLeft((s) => {
        if (s <= 1) {
          const finalScore = score;
          const best = Number(localStorage.getItem("mindful_tap_best") || 0);
          if (finalScore > best) {
            localStorage.setItem("mindful_tap_best", String(finalScore));
            setTapBest(finalScore);
          }
          setTapState("ended");
          stopTapTimers();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const tapAreaClick = () => {
    if (tapState !== "playing") return;
    if (cue === "green") setScore((v) => v + 1);
    else setScore((v) => Math.max(0, v - 1));
  };

  useEffect(() => () => stopTapTimers(), []);

  // Sequence Memory (Simon-lite)
  const COLORS = ["bg-blue-500", "bg-yellow-500", "bg-pink-500"] as const;
  const [seq, setSeq] = useState<number[]>([]);
  const [playback, setPlayback] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [inputPos, setInputPos] = useState(0);
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState<number>(() => Number(localStorage.getItem("memory_best") || 0));
  const playbackRef = useRef<number | null>(null);

  const startMemory = () => {
    stopMemoryPlayback();
    const first = Math.floor(Math.random() * COLORS.length);
    setSeq([first]);
    setRound(0);
    setInputPos(0);
    setTimeout(() => playSequence([first]), 200);
  };

  const stopMemoryPlayback = () => {
    if (playbackRef.current) {
      clearInterval(playbackRef.current);
      playbackRef.current = null;
    }
  };

  const playSequence = (sequence: number[]) => {
    setPlayback(true);
    let i = 0;
    playbackRef.current = window.setInterval(() => {
      setActiveIdx(sequence[i]);
      setTimeout(() => setActiveIdx(null), 350);
      i += 1;
      if (i >= sequence.length) {
        stopMemoryPlayback();
        setPlayback(false);
      }
    }, 600);
  };

  const extendSequence = () => {
    const next = Math.floor(Math.random() * COLORS.length);
    const newSeq = [...seq, next];
    setSeq(newSeq);
    setInputPos(0);
    setTimeout(() => playSequence(newSeq), 300);
  };

  const selectColor = (idx: number) => {
    if (playback || !seq.length) return;
    const expected = seq[inputPos];
    if (idx === expected) {
      const nextPos = inputPos + 1;
      if (nextPos === seq.length) {
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound > bestRound) {
          setBestRound(nextRound);
          localStorage.setItem("memory_best", String(nextRound));
        }
        extendSequence();
      } else {
        setInputPos(nextPos);
      }
    } else {
      // wrong
      setSeq([]);
      setInputPos(0);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-subtle">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="text-center mb-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Gamepad2 className="h-14 w-14 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-foreground">Gamified Dashboard</h1>
            <p className="text-muted-foreground">Calming, focus‑building mini‑games to support your mental well‑being.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Breathing Pacer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" /> Breathing Pacer (4‑7‑8)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <motion.div
                      aria-label="Breathing pacer"
                      className={`h-40 w-40 rounded-full flex items-center justify-center text-lg font-semibold select-none shadow-inner ${
                        phase === "inhale" ? "bg-green-500/20 text-green-700" : phase === "hold" ? "bg-blue-500/20 text-blue-700" : phase === "exhale" ? "bg-purple-500/20 text-purple-700" : "bg-muted text-muted-foreground"
                      }`}
                      style={{ scale: pacerScale }}
                    >
                      <div className="text-center">
                        <div>{phaseLabel}</div>
                        {running && <div className="text-sm opacity-80">{secondsLeft.toFixed(1)}s</div>}
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Inhale 4s • Hold 7s • Exhale 8s. Completing breaths builds your streak.
                  </div>
                  <div className="flex items-center gap-3">
                    {!running ? (
                      <Button onClick={start} variant="default">Start</Button>
                    ) : (
                      <Button onClick={pause} variant="secondary">Pause</Button>
                    )}
                    <Button onClick={reset} variant="ghost">Reset</Button>
                    <div className="ml-auto flex items-center gap-2 text-sm text-foreground">
                      <Heart className="h-4 w-4 text-pink-500" /> Breaths: {cycles}
                      <Trophy className="h-4 w-4 text-yellow-500" /> Best: {bestStreak}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mindful Tap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5" /> Mindful Tap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={`h-32 rounded-xl flex items-center justify-center text-lg font-semibold select-none transition-colors cursor-pointer ${
                      cue === "green" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"
                    }`}
                    onClick={tapAreaClick}
                  >
                    {tapState === "playing" ? (cue === "green" ? "Tap now" : "Wait") : tapState === "ended" ? "Time's up" : "Press Start"}
                  </div>
                  <div className="flex items-center gap-3">
                    {tapState !== "playing" ? (
                      <Button onClick={startTap}>Start</Button>
                    ) : (
                      <Button variant="secondary" onClick={() => { setTapState("ended"); stopTapTimers(); }}>Stop</Button>
                    )}
                    <div className="ml-auto flex items-center gap-3 text-sm">
                      <Timer className="h-4 w-4" /> {tapTimeLeft}s
                      <span>Score: {score}</span>
                      <span>Best: {tapBest}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sequence Memory */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" /> Sequence Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {COLORS.map((c, i) => (
                      <button
                        key={i}
                        className={`h-16 rounded-xl transition-opacity focus:outline-none focus:ring-2 focus:ring-ring ${c} ${
                          activeIdx === i ? "opacity-100" : "opacity-60 hover:opacity-90"
                        }`}
                        onClick={() => selectColor(i)}
                        aria-label={`color-${i}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={startMemory}>Start</Button>
                    <div className="ml-auto text-sm flex items-center gap-3">
                      <span>Round: {round}</span>
                      <span>Best: {bestRound}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamifiedDashboardPage;
