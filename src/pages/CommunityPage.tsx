import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquarePlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Post {
  id: string;
  content: string;
  likes: number;
  ts: number;
  author: string;
}

const STORAGE_KEY = "community_posts";

const defaultPosts: Post[] = [
  {
    id: "seed-1",
    author: "Aisha K.",
    content:
      "Day 21 of my breathing routine. Resting heart rate down, sleep up. Mind feels clearer. If you're starting out: 4-7-8 for 5 cycles helped me a lot!",
    likes: 18,
    ts: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "seed-2",
    author: "Rahul S.",
    content:
      "Therapy session #6 today. Anxiety score down ~22% from last month. Small steps add up. Tracking mood daily has been a game changer.",
    likes: 32,
    ts: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "seed-3",
    author: "Meera P.",
    content:
      "Hit a 12‑day streak on mindfulness! I still have tough days but I'm quicker to notice and pause. Proud of this progress.",
    likes: 25,
    ts: Date.now() - 1000 * 60 * 60 * 54,
  },
];

const CommunityPage = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Post[];
        return parsed && parsed.length > 0 ? parsed : defaultPosts;
      }
      return defaultPosts;
    } catch {
      return defaultPosts;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const displayName = useMemo(() => {
    if (user?.username) return user.username;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "Anonymous";
  }, [user]);

  const initials = useMemo(() => displayName.slice(0, 2).toUpperCase(), [displayName]);

  const submitPost = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const newPost: Post = {
      id: crypto.randomUUID(),
      content: trimmed,
      likes: 0,
      ts: Date.now(),
      author: displayName,
    };
    setPosts([newPost, ...posts]);
    setContent("");
  };

  const likePost = (id: string) => {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-subtle">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <MessageSquarePlus className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">Share thoughts, encouragement, and tips with others.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create a Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={submitPost} disabled={!content.trim()}>Post</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((p) => (
              <Card key={p.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">{p.author.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.author}</span>
                        <span className="text-xs text-muted-foreground">{new Date(p.ts).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap">{p.content}</p>
                      <div className="mt-3">
                        <Button variant="ghost" size="sm" onClick={() => likePost(p.id)}>
                          <Heart className="h-4 w-4 mr-1" /> {p.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityPage;
