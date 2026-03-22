import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface JournalEntry {
    id: bigint;
    title: string;
    body: string;
    mood: bigint;
    timestamp: Time;
}
export interface MoodSummary {
    date: string;
    avgMood: number;
}
export interface Message {
    content: string;
    role: string;
}
export interface MessageGroup {
    messages: Array<Message>;
}
export interface UserProfile {
    name: string;
}
export interface JournalEntryData {
    title: string;
    body: string;
    mood: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Chat Message Functions
     */
    addChatMessage(messages: Array<Message>): Promise<void>;
    /**
     * / Journal Entry Functions
     */
    addJournalEntry(data: JournalEntryData): Promise<JournalEntry>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteJournalEntry(id: bigint): Promise<void>;
    /**
     * / User Profile Functions
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessagesForCaller(): Promise<Array<MessageGroup>>;
    getJournalEntriesForCaller(): Promise<Array<JournalEntry>>;
    /**
     * / Mood Summary Function
     */
    getMoodSummary(): Promise<Array<MoodSummary>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
