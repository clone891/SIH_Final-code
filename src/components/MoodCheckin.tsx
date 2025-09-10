import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";

export type Mood = "Great" | "Okay" | "Low";

const MOOD_KEY = "mood_last";

const MoodCheckin = () => {
  const [lastMood, setLastMood] = useState<{ mood: Mood; ts: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MOOD_KEY);
      if (raw) setLastMood(JSON.parse(raw));
    } catch {}
  }, []);

  const saveMood = (mood: Mood) => {
    const entry = { mood, ts: Date.now() };
    localStorage.setItem(MOOD_KEY, JSON.stringify(entry));
    setLastMood(entry);
  };

  return (
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
  );
};

export default MoodCheckin;
