import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, TimerReset, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GamifiedDashboardPage = () => {
  // Reaction Time mini-game
  const [status, setStatus] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startGame = () => {
    clearTimer();
    setStatus("waiting");
    setLastTime(null);
    startTimeRef.current = null;
    const delay = 1000 + Math.random() * 2000; // 1-3s
    timeoutRef.current = window.setTimeout(() => {
      setStatus("ready");
      startTimeRef.current = performance.now();
    }, delay);
  };

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleClick = () => {
    if (status === "waiting") {
      // Clicked too early
      clearTimer();
      setStatus("idle");
      return;
    }
    if (status === "ready" && startTimeRef.current) {
      const diff = performance.now() - startTimeRef.current;
      setLastTime(diff);
      setBestTime((prev) => (prev == null || diff < prev ? diff : prev));
      setStatus("result");
      startTimeRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const statusText = useMemo(() => {
    switch (status) {
      case "idle":
        return "Press Start and wait for the green screen.";
      case "waiting":
        return "Wait for green...";
      case "ready":
        return "Tap now!";
      case "result":
        return lastTime != null ? `Your reaction: ${lastTime.toFixed(0)} ms` : "";
    }
  }, [status, lastTime]);

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
            <p className="text-muted-foreground">Play quick, mindful mini‑games designed to help you focus and unwind.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TimerReset className="h-5 w-5" /> Reaction Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={
                      "h-40 rounded-xl flex items-center justify-center text-lg font-semibold select-none transition-colors " +
                      (status === "ready" ? "bg-green-500/20 text-green-600" : status === "waiting" ? "bg-yellow-500/20 text-yellow-700" : "bg-muted text-muted-foreground")
                    }
                    onClick={handleClick}
                    role="button"
                    aria-label="Reaction area"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleClick();
                    }}
                  >
                    {statusText}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={startGame} variant="default">Start</Button>
                    <Button onClick={() => { clearTimer(); setStatus("idle"); setLastTime(null); }} variant="secondary">Reset</Button>
                    {bestTime != null && (
                      <div className="ml-auto flex items-center gap-2 text-sm text-foreground">
                        <Trophy className="h-4 w-4 text-yellow-500" /> Best: {bestTime.toFixed(0)} ms
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Focus Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practice quick focus bursts. More games can be added here, like memory match or pattern tap.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamifiedDashboardPage;
