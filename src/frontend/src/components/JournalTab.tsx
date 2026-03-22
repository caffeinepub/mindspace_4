import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { JournalEntry } from "../backend";
import {
  useAddJournalEntry,
  useDeleteJournalEntry,
  useGetJournalEntries,
} from "../hooks/useQueries";

const MOODS: { emoji: string; label: string; value: number }[] = [
  { emoji: "😞", label: "Struggling", value: 1 },
  { emoji: "😕", label: "Not great", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

function getMoodInfo(mood: number | bigint) {
  const m = Number(mood);
  return MOODS[m - 1] ?? MOODS[2];
}

function formatDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EntryCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const moodInfo = getMoodInfo(entry.mood);
  const del = useDeleteJournalEntry();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card rounded-2xl p-5 shadow-soft"
      data-ocid={`journal.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{moodInfo.emoji}</span>
            <span className="text-xs text-muted-foreground">
              {moodInfo.label}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(entry.timestamp)}
            </span>
          </div>
          <h3 className="font-semibold text-foreground truncate">
            {entry.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {entry.body}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => del.mutate(entry.id)}
          disabled={del.isPending}
          className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          data-ocid={`journal.delete_button.${index + 1}`}
        >
          {del.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function NewEntryForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState(3);
  const add = useAddJournalEntry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    add.mutate(
      { title: title.trim(), body: body.trim(), mood: BigInt(mood) },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="mt-1 rounded-xl"
          data-ocid="journal.input"
        />
      </div>
      <div>
        <Label>How are you feeling?</Label>
        <div className="flex gap-2 mt-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all text-xs ${
                mood === m.value
                  ? "border-sage bg-sage-light"
                  : "border-border bg-background hover:border-sage/50"
              }`}
              data-ocid={`journal.radio.${m.value}`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Your thoughts</Label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind today? Write freely..."
          className="mt-1 rounded-xl min-h-[120px]"
          data-ocid="journal.textarea"
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          data-ocid="journal.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || !body.trim() || add.isPending}
          className="bg-sage hover:bg-sage-dark text-white rounded-full"
          data-ocid="journal.submit_button"
        >
          {add.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {add.isPending ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}

export default function JournalTab() {
  const { data: entries, isLoading } = useGetJournalEntries();
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-border">
        <div>
          <h2 className="font-bold text-foreground">My Journal</h2>
          <p className="text-xs text-muted-foreground">
            {entries?.length ?? 0} entries
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-sage hover:bg-sage-dark text-white rounded-full gap-2"
              size="sm"
              data-ocid="journal.open_modal_button"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent
            className="rounded-2xl max-w-lg"
            data-ocid="journal.dialog"
          >
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
            </DialogHeader>
            <NewEntryForm onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="journal.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : entries && entries.length > 0 ? (
          <AnimatePresence>
            {[...entries]
              .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
              .map((entry, i) => (
                <EntryCard key={String(entry.id)} entry={entry} index={i} />
              ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="journal.empty_state"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium text-foreground mb-1">
              Your journal is waiting
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Capture your first thought, feeling, or moment.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-sage hover:bg-sage-dark text-white rounded-full"
              data-ocid="journal.primary_button"
            >
              Write First Entry
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
