import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  Heart,
  Loader2,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import ChatTab from "./components/ChatTab";
import DashboardTab from "./components/DashboardTab";
import JournalTab from "./components/JournalTab";
import LandingPage from "./components/LandingPage";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

export default function App() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const qc = useQueryClient();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  if (isInitializing || (isAuthenticated && !profileFetched)) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage />
        <Toaster />
      </>
    );
  }

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  if (showProfileSetup) {
    return (
      <>
        <ProfileSetup />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg font-body">
      {/* App Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border shadow-soft">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-semibold text-foreground">SereneMind</span>
          </div>
          <div className="flex items-center gap-2">
            {userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                Hey, {userProfile.name} 👋
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
              data-ocid="app.logout.button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main App */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="w-full bg-card shadow-soft rounded-2xl p-1 mb-4 grid grid-cols-3 h-auto">
              <TabsTrigger
                value="chat"
                className="rounded-xl py-2.5 gap-2 data-[state=active]:bg-sage data-[state=active]:text-white"
                data-ocid="app.chat.tab"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="journal"
                className="rounded-xl py-2.5 gap-2 data-[state=active]:bg-sage data-[state=active]:text-white"
                data-ocid="app.journal.tab"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Journal</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="rounded-xl py-2.5 gap-2 data-[state=active]:bg-sage data-[state=active]:text-white"
                data-ocid="app.dashboard.tab"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </TabsTrigger>
            </TabsList>

            <div
              className="bg-card rounded-2xl shadow-soft overflow-hidden"
              style={{ height: "calc(100vh - 180px)" }}
            >
              <TabsContent
                value="chat"
                className="h-full m-0 data-[state=active]:flex flex-col"
              >
                <ChatTab />
              </TabsContent>
              <TabsContent value="journal" className="h-full m-0">
                <JournalTab />
              </TabsContent>
              <TabsContent value="dashboard" className="h-full m-0">
                <DashboardTab userName={userProfile?.name ?? ""} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with{" "}
        <Heart className="inline w-3 h-3 text-sage" fill="currentColor" /> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>

      <Toaster />
    </div>
  );
}
