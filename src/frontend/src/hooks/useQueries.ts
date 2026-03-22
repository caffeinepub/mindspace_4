import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  JournalEntry,
  Message,
  MoodSummary,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useGetMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      const groups = await actor.getChatMessagesForCaller();
      return groups.flatMap((g) => g.messages);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMessages() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (messages: Message[]) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addChatMessage(messages);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useGetJournalEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<JournalEntry[]>({
    queryKey: ["journalEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJournalEntriesForCaller();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJournalEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; body: string; mood: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addJournalEntry(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journalEntries"] }),
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journalEntries"] }),
  });
}

export function useGetMoodSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<MoodSummary[]>({
    queryKey: ["moodSummary"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodSummary();
    },
    enabled: !!actor && !isFetching,
  });
}
