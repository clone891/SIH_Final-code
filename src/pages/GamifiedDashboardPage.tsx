import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Wind, Trophy, Smile, Meh, Frown, Heart } from "lucide-react";
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

  // Load best streak
  useEffect(() => {
    const stored = localStorage.getItem("breathing_best_streak");
    if (stored) setBestStreak(Number(stored));
  }, []);

  // Helper to clear timer
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
        // Count a full cycle at the moment we transition from exhale -> inhale
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
    const sec = Math.ceil(remaining / 100) / 10; // 0.1s precision
    setSecondsLeft(parseFloat(sec.toFixed(1)));
    if (remaining <= 0) {
      advance();
    }
  };

  useEffect(() => {
    if (!running) return;
    // Reset target when phase changes
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

  // Mood check-in mini activity
  type Mood = "Great" | "Okay" | "Low";
  const [lastMood, setLastMood] = useState<{ mood: Mood; ts: number } | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("mood_last");
    if (raw) setLastMood(JSON.parse(raw));
  }, []);
  const saveMood = (mood: Mood) => {
    const entry = { mood, ts: Date.now() };
    localStorage.setItem("mood_last", JSON.stringify(entry));
    setLastMood(entry);
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
            <p className="text-muted-foreground">Calming, science-backed mini‑activities to support your mental well‑being.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

          {/* Mood Check-in */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="h-5 w-5" /> Mood Check‑in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => saveMood("Great")}>
                      <Smile className="h-4 w-4 mr-2 text-green-600" /> Great
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => saveMood("Okay")}>
                      <Meh className="h-4 w-4 mr-2 text-yellow-600" /> Okay
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => saveMood("Low")}>
                      <Frown className="h-4 w-4 mr-2 text-blue-600" /> Low
                    </Button>
                  </div>
                  {lastMood && (
                    <div className="text-sm text-muted-foreground">
                      Last check‑in: {lastMood.mood} • {new Date(lastMood.ts).toLocaleString()}
                    </div>
                  )}
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
