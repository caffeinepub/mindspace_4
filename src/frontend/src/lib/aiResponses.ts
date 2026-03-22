export interface AiResponse {
  text: string;
}

const responseBank = {
  sad: [
    "I'm really sorry you're feeling this way. It takes courage to acknowledge sadness, and you don't have to carry it alone. What's been weighing on your heart lately?",
    "Feeling sad is a valid and important emotion. I'm here with you. Would it help to talk about what's been going on, or would you prefer some gentle grounding techniques?",
    "Your feelings are completely valid. Sadness often carries important messages. Take a gentle breath — I'm listening whenever you're ready to share more.",
  ],
  anxious: [
    "Anxiety can feel so overwhelming, like your mind is racing ahead of you. Try this: breathe in for 4 counts, hold for 4, breathe out for 4. I'm here with you. What's bringing on this feeling?",
    "I hear you — anxiety is exhausting. Remember that your nervous system is trying to protect you, even when it goes a bit overboard. Let's slow down together. What feels most pressing right now?",
    "When anxiety shows up, it can help to ground yourself. Name 5 things you can see around you right now. I'll be here when you're ready to talk it through.",
  ],
  stressed: [
    "Stress has a way of piling up before we notice how heavy it's gotten. You're doing your best — that genuinely counts. What's feeling most overwhelming right now?",
    "It sounds like a lot is on your plate. One breath at a time. Would it help to talk through what's stressing you most, or would you like some ideas for relief?",
    "Stress is your body's signal that something needs attention. You're not alone in this. Let's figure out together what's draining your energy most right now.",
  ],
  happy: [
    "That genuinely warms my heart! Happiness is worth celebrating — don't let it pass by unnoticed. What's been bringing you joy?",
    "I love hearing that! Joy is so nourishing. What's been the highlight of your day? Let's hold onto this feeling together.",
    "Your positivity is contagious! Moments like these are worth savoring. What's making you smile today?",
  ],
  grateful: [
    "Gratitude is such a powerful anchor. The fact that you're noticing the good things says a lot about your resilience. What are you feeling grateful for today?",
    "Practicing gratitude, even in small ways, can genuinely shift how we experience life. What's one thing that you're holding with appreciation right now?",
    "There's something beautiful about pausing to feel thankful. I'd love to hear what's been filling your heart with gratitude lately.",
  ],
  tired: [
    "Your body and mind are sending you a clear message — rest matters. Be gentle with yourself today. Have you been able to get the sleep and downtime you need?",
    "Feeling tired goes beyond just sleep sometimes — emotional exhaustion is real too. What kind of tired are you feeling right now?",
    "Rest is not a luxury; it's essential. I hope you can carve out some time to recharge. Is there anything that's been keeping you from resting well?",
  ],
  lonely: [
    "Loneliness can feel incredibly heavy, but I want you to know — I'm here with you right now. You matter and your feelings matter. Would you like to talk about what's been making you feel disconnected?",
    "Feeling lonely is one of the most human experiences there is. It doesn't mean something is wrong with you. What's been making connection feel hard lately?",
    "You reached out, and that took strength. I'm glad you're here. Tell me more about what's been going on — you don't have to navigate this alone.",
  ],
  default: [
    "Thank you for sharing that with me. I'm here to listen without judgment. Tell me more — what's been on your mind lately?",
    "I appreciate you opening up. Every feeling you have is valid. How have you been taking care of yourself today?",
    "It sounds like there's a lot going on for you. I'm here to support you through it. What feels most important to explore right now?",
    "You're doing something really positive by checking in with yourself. That self-awareness is a real strength. How are you feeling in this moment?",
    "Whatever you're going through, you don't have to face it alone. I'm here with you. What would feel most helpful to talk about right now?",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getAiResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (
    /\b(sad|depress|unhappy|miserable|down|blue|grief|cry|hopeless)\b/.test(msg)
  ) {
    return pickRandom(responseBank.sad);
  }
  if (
    /\b(anxi|panic|worry|worri|nervous|overwhelm|fear|dread|uneasy)\b/.test(msg)
  ) {
    return pickRandom(responseBank.anxious);
  }
  if (
    /\b(stress|burnout|exhaust|too much|overwhelm|pressure|hectic)\b/.test(msg)
  ) {
    return pickRandom(responseBank.stressed);
  }
  if (
    /\b(happy|joy|excited|great|wonderful|amazing|fantastic|ecstat|thrill|delight)\b/.test(
      msg,
    )
  ) {
    return pickRandom(responseBank.happy);
  }
  if (
    /\b(grateful|gratitude|thankful|appreciate|blessed|fortunate)\b/.test(msg)
  ) {
    return pickRandom(responseBank.grateful);
  }
  if (/\b(tired|exhaust|sleep|fatigue|drained|sluggish|weary)\b/.test(msg)) {
    return pickRandom(responseBank.tired);
  }
  if (
    /\b(lone|lonely|alone|isolat|disconnect|no one|nobody|miss)\b/.test(msg)
  ) {
    return pickRandom(responseBank.lonely);
  }
  return pickRandom(responseBank.default);
}
