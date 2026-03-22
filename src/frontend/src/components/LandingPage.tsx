import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-warm-bg font-body">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-warm-bg/90 backdrop-blur border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-semibold text-lg text-foreground tracking-tight">
              SereneMind
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
              data-ocid="nav.features.link"
            >
              Features
            </a>
            <a
              href="#chat"
              className="hover:text-foreground transition-colors"
              data-ocid="nav.chat.link"
            >
              Chatbot
            </a>
            <a
              href="#journal"
              className="hover:text-foreground transition-colors"
              data-ocid="nav.journal.link"
            >
              Journaling
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="nav.signin.button"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="bg-sage hover:bg-sage-dark text-white rounded-full px-5"
              data-ocid="nav.get_started.button"
            >
              {isLoggingIn ? "Signing in..." : "Get Started Free"}
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-beige rounded-3xl mx-4 md:mx-8 mt-6 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-sage-light text-sage-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Your Mental Wellness Companion
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
              Find your calm,
              <br />
              <span className="text-sage">one moment</span>
              <br />
              at a time
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              SereneMind combines empathetic AI chat support with mindful
              journaling to help you understand and nurture your emotional
              wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="bg-sage hover:bg-sage-dark text-white rounded-full px-8 shadow-soft"
                data-ocid="hero.get_started.primary_button"
              >
                {isLoggingIn ? "Signing in..." : "Start Your Journey"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="rounded-full border-foreground/20 bg-white/60"
                data-ocid="hero.learn_more.secondary_button"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Blob */}
            <div
              className="absolute inset-0 rounded-full bg-sand/40 blur-3xl scale-110"
              style={{ top: "10%", left: "10%", right: "10%", bottom: "10%" }}
            />
            <img
              src="/assets/generated/hero-serenity.dim_600x500.png"
              alt="Person in calm meditation"
              className="relative z-10 w-full max-w-sm md:max-w-md rounded-3xl"
            />
            {/* Floating bubbles */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-8 -left-4 bg-white rounded-2xl px-3 py-2 shadow-card text-xs font-medium text-foreground z-20"
            >
              💬 How are you feeling today?
            </motion.div>
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute bottom-12 -right-4 bg-sage-light rounded-2xl px-3 py-2 shadow-card text-xs font-medium text-sage-dark z-20"
            >
              📓 Mood: 🙂 4/5
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Why SereneMind?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Thoughtfully designed tools to support your mental wellness journey.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <MessageCircle className="w-5 h-5 text-sage" />,
              bg: "bg-sage-light",
              title: "AI Chat Support",
              desc: "Empathetic, judgment-free conversations available whenever you need them.",
            },
            {
              icon: <BookOpen className="w-5 h-5 text-amber-600" />,
              bg: "bg-sand",
              title: "Mindful Journaling",
              desc: "Reflect on your thoughts and track your emotional patterns over time.",
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-blue-500" />,
              bg: "bg-blue-100",
              title: "Progress Insights",
              desc: "Visualize your mood trends and celebrate your growth along the way.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-soft"
            >
              <div
                className={`${f.bg} w-10 h-10 rounded-full flex items-center justify-center mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section id="chat" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Chat mock */}
          <motion.div
            id="chat"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-sage-light rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sage-dark" />
              <h3 className="font-semibold text-foreground">
                Meet Your AI Companion
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-xl rounded-tl-sm px-4 py-2 text-sm text-foreground shadow-xs max-w-xs">
                Hi there! How are you feeling today? 💚
              </div>
              <div className="bg-sage text-white rounded-xl rounded-tr-sm px-4 py-2 text-sm ml-auto max-w-xs">
                I've been feeling a bit stressed with work lately.
              </div>
              <div className="bg-white rounded-xl rounded-tl-sm px-4 py-2 text-sm text-foreground shadow-xs max-w-xs">
                I hear you — stress has a way of building up. Let's explore
                what's weighing on you most.
              </div>
            </div>
            <Button
              onClick={() => login()}
              className="mt-5 w-full bg-sage hover:bg-sage-dark text-white rounded-full"
              data-ocid="showcase.start_chat.button"
            >
              Start Chatting
            </Button>
          </motion.div>

          {/* Journal mock */}
          <motion.div
            id="journal"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-sand rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <h3 className="font-semibold text-foreground">
                Your Mindful Journal
              </h3>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-xs mb-3">
              <p className="text-xs text-muted-foreground mb-1">
                March 20, 2026 · Mood 🙂
              </p>
              <p className="text-sm font-medium text-foreground mb-1">
                Reflections on Gratitude
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Today I tried to slow down and notice the small things — the
                warmth of morning coffee, a kind word from a friend...
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 shadow-xs mb-4">
              <p className="text-xs text-muted-foreground mb-1">
                March 18, 2026 · Mood 😐
              </p>
              <p className="text-sm font-medium text-foreground">
                Processing a tough day
              </p>
            </div>
            <Button
              onClick={() => login()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full"
              data-ocid="showcase.start_journal.button"
            >
              Start Journaling
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-beige rounded-3xl mx-4 md:mx-8 mb-8 px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground mb-10">
          User Stories
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          <div className="bg-card rounded-2xl p-5 shadow-soft">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              "SereneMind helped me recognize my anxiety patterns. The AI chat
              felt genuinely supportive, not robotic."
            </p>
            <p className="text-xs font-semibold text-foreground">— Amara K.</p>
          </div>
          <div className="bg-sage text-white rounded-2xl p-5 shadow-soft flex flex-col items-center text-center">
            <Shield className="w-8 h-8 mb-3 opacity-80" />
            <p className="font-semibold text-lg mb-1">Private & Secure</p>
            <p className="text-sm opacity-80">
              Your data lives on the Internet Computer — decentralized,
              encrypted, and owned by you.
            </p>
            <Button
              variant="secondary"
              onClick={() => login()}
              className="mt-4 rounded-full bg-white text-sage hover:bg-white/90"
              data-ocid="testimonials.get_started.button"
            >
              Get Started Free
            </Button>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-soft">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              "I've journaled on and off for years, but the mood tracker finally
              helped me see the bigger picture of my mental health."
            </p>
            <p className="text-xs font-semibold text-foreground">— James T.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" fill="white" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              SereneMind
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with{" "}
            <Heart className="inline w-3 h-3 text-sage" fill="currentColor" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a href="#chat" className="hover:text-foreground transition-colors">
              Chatbot
            </a>
            <a
              href="#journal"
              className="hover:text-foreground transition-colors"
            >
              Journal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
