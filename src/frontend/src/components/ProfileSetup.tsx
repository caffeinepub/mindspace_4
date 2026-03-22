import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSaveUserProfile } from "../hooks/useQueries";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const save = useSaveUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    save.mutate({ name: name.trim() });
  };

  return (
    <div className="fixed inset-0 bg-warm-bg flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-2xl shadow-hero p-8 w-full max-w-md text-center"
        data-ocid="profile_setup.modal"
      >
        <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-5">
          <Heart className="w-7 h-7 text-sage" fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome to SereneMind
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Let's get to know you a little. What should we call you?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="mt-1 rounded-xl"
              autoFocus
              data-ocid="profile_setup.input"
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || save.isPending}
            className="w-full bg-sage hover:bg-sage-dark text-white rounded-full"
            data-ocid="profile_setup.submit_button"
          >
            {save.isPending ? "Saving..." : "Let's Begin"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
