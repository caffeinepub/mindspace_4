import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  /// Data Definitions

  type UserId = Principal;

  type JournalEntryData = {
    title : Text;
    body : Text;
    mood : Int; // 1-5
  };

  type JournalEntry = JournalEntryData and {
    id : Nat;
    timestamp : Time.Time;
  };

  module JournalEntry {
    public func compareByTimestamp(entry1 : JournalEntry, entry2 : JournalEntry) : Order.Order {
      Int.compare(entry2.timestamp, entry1.timestamp); // Descending order
    };
  };

  type Message = {
    role : Text; // "user" or "assistant"
    content : Text;
  };

  type MessageGroup = {
    messages : [Message];
  };

  type MoodSummary = {
    date : Text;
    avgMood : Float;
  };

  type UserProfile = {
    name : Text;
  };

  var nextEntryId = 1;

  /// Persistent Data Stores

  let journalEntries = Map.empty<UserId, Map.Map<Nat, JournalEntry>>();
  let chatMessages = Map.empty<UserId, Map.Map<Nat, MessageGroup>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /// User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Journal Entry Functions

  public shared ({ caller }) func addJournalEntry(data : JournalEntryData) : async JournalEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create journal entries");
    };

    let entry = {
      data with
      id = nextEntryId;
      timestamp = Time.now();
    };

    let userEntries = switch (journalEntries.get(caller)) {
      case (?entries) { entries };
      case (null) { Map.empty<Nat, JournalEntry>() };
    };

    userEntries.add(entry.id, entry);
    journalEntries.add(caller, userEntries);

    nextEntryId += 1;
    entry;
  };

  public query ({ caller }) func getJournalEntriesForCaller() : async [JournalEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view journal entries");
    };

    switch (journalEntries.get(caller)) {
      case (?entries) {
        entries.values().toArray().sort(JournalEntry.compareByTimestamp);
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteJournalEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete journal entries");
    };

    switch (journalEntries.get(caller)) {
      case (?entries) {
        entries.remove(id);
      };
      case (null) { Runtime.trap("No entries found for caller") };
    };
  };

  /// Chat Message Functions

  public shared ({ caller }) func addChatMessage(messages : [Message]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save chat messages");
    };

    let userMessages = switch (chatMessages.get(caller)) {
      case (?msgs) { msgs };
      case (null) { Map.empty<Nat, MessageGroup>() };
    };

    let messageGroup = {
      messages = messages;
    };

    userMessages.add(userMessages.size(), messageGroup);
    chatMessages.add(caller, userMessages);
  };

  public query ({ caller }) func getChatMessagesForCaller() : async [MessageGroup] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat messages");
    };

    switch (chatMessages.get(caller)) {
      case (?msgs) { msgs.values().toArray() };
      case (null) { [] };
    };
  };

  /// Mood Summary Function

  public query ({ caller }) func getMoodSummary() : async [MoodSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mood summaries");
    };

    let now = Time.now();
    let dayInNanos : Int = 86400000000000;
    let weekInNanos : Int = 7 * dayInNanos;

    // Create empty Map for each of the last 7 days
    let dailyMoods = Map.empty<Text, List.List<Int>>();

    var i : Int = 0;
    while (i < 7) {
      let date = getDateTextForDay(now, i);
      let moods = List.empty<Int>();
      dailyMoods.add(date, moods);
      i += 1;
    };

    let userEntries = switch (journalEntries.get(caller)) {
      case (?entries) { entries };
      case (null) { Map.empty<Nat, JournalEntry>() };
    };

    // Collect moods for each day
    for (entry in userEntries.values()) {
      let daysAgo = Int.abs((now - entry.timestamp) / dayInNanos);
      if (daysAgo < 7 and (now - entry.timestamp) <= weekInNanos) {
        let date = getDateTextForDay(now, daysAgo);
        switch (dailyMoods.get(date)) {
          case (?moodList) {
            moodList.add(entry.mood);
          };
          case (null) {};
        };
      };
    };

    // Calculate average mood for each day
    let summaries = List.empty<MoodSummary>();

    for ((date, moods) in dailyMoods.entries()) {
      let dayCount = moods.size();
      var daySum : Int = 0;
      for (mood in moods.values()) {
        daySum += mood;
      };
      let avgMood = if (dayCount > 0) {
        daySum.toFloat() / dayCount.toFloat();
      } else {
        0.0;
      };
      summaries.add({
        date;
        avgMood;
      });
    };

    summaries.toArray();
  };

  /// Helper Functions

  func getDateTextForDay(_ : Time.Time, daysAgo : Int) : Text {
    // Returns "Day {daysAgo}" format
    // For simplicity, real date conversion can be added later
    "Day " # daysAgo.toText();
  };
};
