# MindSpace

## Current State
New project. Empty backend and frontend scaffolding.

## Requested Changes (Diff)

### Add
- AI-guided chat interface for mental health support (rule-based + canned responses with supportive tone)
- Journaling system: create, read, delete journal entries with title, body, mood, and timestamp
- Mood tracking: log mood per journal entry (scale 1-5 or emoji)
- User authentication via authorization component
- Dashboard showing recent journal entries and mood history
- Onboarding welcome screen

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: authorization, journal entry storage (title, body, mood, timestamp), chat message history per user
2. Backend: APIs for createEntry, getEntries, deleteEntry, saveMessage, getMessages
3. Frontend: Landing/onboarding page
4. Frontend: Chat tab with AI-guided supportive responses
5. Frontend: Journal tab with entry list, create entry form, mood selector
6. Frontend: Dashboard with mood chart and recent entries
