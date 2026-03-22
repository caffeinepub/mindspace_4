import { BookOpen, Loader2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetJournalEntries, useGetMoodSummary } from "../hooks/useQueries";

const QUOTES = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are stronger than you think, braver than you believe.",
  "Small steps every day lead to extraordinary change.",
  "It's okay to not be okay — healing takes time and that's perfectly fine.",
  "You deserve the same compassion you give to others.",
  "Peace is not the absence of struggle, but the presence of grace.",
  "Your feelings are valid. Your healing matters. You matter.",
];

function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

const MOOD_EMOJIS: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

function getMoodEmoji(avg: number): string {
  return MOOD_EMOJIS[Math.round(avg)] ?? "😐";
}

function formatEntryDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardTab({ userName }: { userName: string }) {
  const { data: moodData, isLoading: moodLoading } = useGetMoodSummary();
  const { data: entries, isLoading: entriesLoading } = useGetJournalEntries();

  const recentEntries = [...(entries ?? [])]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);

  const chartData = (moodData ?? []).map((d) => ({
    date: d.date,
    mood: Math.round(d.avgMood * 10) / 10,
    emoji: getMoodEmoji(d.avgMood),
  }));

  const avgMoodOverall =
    chartData.length > 0
      ? chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length
      : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-6 space-y-5">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-beige rounded-2xl p-5"
        >
          <p className="text-sm text-muted-foreground mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Good {getTimeOfDay()}, {userName || "friend"} 👋
          </h2>
          <p className="text-sm text-muted-foreground italic">
            "{getDailyQuote()}"
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-4 shadow-soft"
          >
            <p className="text-xs text-muted-foreground mb-1">
              Avg Mood (7 days)
            </p>
            <p className="text-3xl font-bold text-foreground">
              {avgMoodOverall !== null ? (
                <>
                  {getMoodEmoji(avgMoodOverall)} {avgMoodOverall.toFixed(1)}
                </>
              ) : (
                <span className="text-lg text-muted-foreground">—</span>
              )}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl p-4 shadow-soft"
          >
            <p className="text-xs text-muted-foreground mb-1">
              Journal Entries
            </p>
            <p className="text-3xl font-bold text-foreground">
              {entriesLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                (entries?.length ?? 0)
              )}
            </p>
          </motion.div>
        </div>

        {/* Mood Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-sage" />
            <h3 className="font-semibold text-foreground text-sm">
              Mood Over Last 7 Days
            </h3>
          </div>
          {moodLoading ? (
            <div
              className="flex justify-center py-8"
              data-ocid="dashboard.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div
              className="text-center py-8 text-sm text-muted-foreground"
              data-ocid="dashboard.empty_state"
            >
              Start journaling to see your mood trends here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.92 0.005 85)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "oklch(0.48 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: "oklch(0.48 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-card text-xs">
                        <p className="font-medium text-foreground">{d.date}</p>
                        <p className="text-muted-foreground">
                          {d.emoji} {d.mood}/5
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="mood"
                  fill="oklch(0.75 0.09 160)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-foreground text-sm">
              Recent Journal Entries
            </h3>
          </div>
          {entriesLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : recentEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No entries yet. Start journaling to see them here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry, i) => (
                <div
                  key={String(entry.id)}
                  className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <span className="text-xl mt-0.5">
                    {MOOD_EMOJIS[Number(entry.mood)] ?? "😐"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatEntryDate(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
