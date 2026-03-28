# Distractor Patterns: Writing Plausible Wrong Answers

This document provides patterns and strategies for writing answer distractors that test real misconceptions—without being obvious wrong choices. A good distractor is **plausible, connected to the concept, but subtly incorrect.**

---

## Core Principle

A distractor should make a learner who *partially understands* choose it. It should **not** be obviously wrong.

**Bad distractors (avoid):**
```
Q: What does TCP stand for?
A: Transmission Control Protocol ✓
B: Transfer Computer Process ✗ (nonsensical)
C: Totally Crazy Package ✗ (obvious joke)
D: Technical Connection Point ✗ (made up)
```
(B, C, D are so wrong they teach nothing)

**Good distractors:**
```
Q: What does TCP stand for?
A: Transmission Control Protocol ✓
B: Transmission Control Process (plausible, learner might confuse "Protocol" vs "Process")
C: Transport Control Protocol (plausible, learner might confuse "Transmission" vs "Transport")
D: Transactional Control Protocol (plausible, learner might confuse context from databases)
```
(All distractors use real terminology, but only A is correct)

---

## Pattern 1: Off-by-One / Adjacent Concept

**Misconception:** Learner confuses a related but different concept; misremembers a number, layer, or property.

**How to create:** Use terminology from adjacent concepts.

**Example:**

```json
{
  "id": "q10",
  "question": "What is the size of a TCP header?",
  "alternatives": [
    {
      "id": "a1",
      "text": "20 bytes (minimum, without options)",
      "isCorrect": true,
      "explanation": "Correct! The TCP header has a minimum size of 20 bytes..."
    },
    {
      "id": "a2",
      "text": "8 bytes",
      "isCorrect": false,
      "explanation": "You might be thinking of UDP, which has a very small 8-byte header. TCP is more complex and requires a larger header for sequencing, acknowledgment, window size, and flags."
    },
    {
      "id": "a3",
      "text": "32 bytes",
      "isCorrect": false,
      "explanation": "32 bytes is too large for a TCP header. While options can increase TCP header size beyond 20, the standard/minimum size is 20. Perhaps you were thinking of IPv6 header?"
    },
    {
      "id": "a4",
      "text": "Variable, depends on options",
      "isCorrect": false,
      "explanation": "While TCP headers CAN have options (making it 20+ bytes), the **minimum** and most common size is 20 bytes fixed. This is the standard answer to 'what is the TCP header size?'"
    }
  ]
}
```

---

## Pattern 2: Inverse or Opposite Direction

**Misconception:** Learner confuses the direction of flow or reverses a relationship.

**How to create:** State the relationship backwards.

**Example:**

```json
{
  "id": "q20",
  "question": "In TCP flow control, what does the receiver communicate to the sender?",
  "alternatives": [
    {
      "id": "a1",
      "text": "The receiver window (rwnd) — how much data it can accept",
      "isCorrect": true,
      "explanation": "Correct! The receiver uses ACKs to tell the sender 'I have capacity for X more bytes'. This is rwnd (receive window)..."
    },
    {
      "id": "a2",
      "text": "The sender window (cwnd) — how much data it wants to send",
      "isCorrect": false,
      "explanation": "Backwards! cwnd (congestion window) is the sender's own limit based on network congestion, not something the receiver communicates. The receiver sends rwnd."
    },
    {
      "id": "a3",
      "text": "The network capacity based on router buffer sizes",
      "isCorrect": false,
      "explanation": "The receiver doesn't know about router buffers. It only knows its own buffer, which is what rwnd represents."
    }
  ]
}
```

---

## Pattern 3: Partially Correct / Missing Nuance

**Misconception:** Learner has part of the concept but misses a critical detail.

**How to create:** Include a true statement, but one that doesn't fully answer the question.

**Example:**

```json
{
  "id": "q5",
  "question": "Why is the TCP three-way handshake necessary (instead of two-way)?",
  "alternatives": [
    {
      "id": "a1",
      "text": "To synchronize sequence numbers on **both sides** and allow both to confirm readiness before data transmission",
      "isCorrect": true,
      "explanation": "Correct! Both SYN and SYN-ACK carry sequence numbers. The third ACK confirms the server is ready. This prevents data loss from race conditions."
    },
    {
      "id": "a2",
      "text": "To ensure the server can receive data from the client",
      "isCorrect": false,
      "explanation": "Partially true—the handshake does establish bidirectional communication. But this doesn't explain **why three messages** are needed. The deeper reason is synchronization of sequence numbers."
    },
    {
      "id": "a3",
      "text": "To allow the client to send data in the same packet as the ACK",
      "isCorrect": false,
      "explanation": "No—data doesn't flow in the handshake itself. The handshake is purely setup. This misses the real purpose: **synchronization**."
    }
  ]
}
```

---

## Pattern 4: Common Student Misconception

**Misconception:** Based on cognitive errors observed in real learners.

**How to create:** Reflect the most frequent mistakes students make.

**Example (real from Trinity):**

```json
{
  "id": "q3",
  "question": "What does 'multiplexing' mean in the context of the transport layer?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Combining data from multiple processes on the sender into one stream",
      "isCorrect": true,
      "explanation": "Correct! The sender's transport layer collects data from multiple applications, adds port numbers, and sends via one network connection."
    },
    {
      "id": "a2",
      "text": "Using one physical link to carry data from multiple applications",
      "isCorrect": false,
      "explanation": "You're conflating multiplexing (transport layer abstraction) with physical link sharing (lower layers). Multiplexing is about **software ports**, not physical wires."
    },
    {
      "id": "a3",
      "text": "The receiver identifying which process each incoming packet belongs to",
      "isCorrect": false,
      "explanation": "That's **demultiplexing**, not multiplexing! Multiplexing = sender combining multiple streams. Demultiplexing = receiver splitting one stream. Easy to mix up, but opposite directions."
    },
    {
      "id": "a4",
      "text": "Duplicating packets across multiple network paths for redundancy",
      "isCorrect": false,
      "explanation": "That would be replication or multipath routing, not multiplexing. Multiplexing is about **combining** different data sources, not duplicating."
    }
  ]
}
```

---

## Pattern 5: Confuses Layers or Protocols

**Misconception:** Learner mixes up responsibilities between OSI layers or similar protocols.

**How to create:** Use correct terminology but assign to wrong layer/protocol.

**Example:**

```json
{
  "id": "q15",
  "question": "Which layer is responsible for routing packets between networks?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Network layer (Layer 3)",
      "isCorrect": true,
      "explanation": "Correct! The network layer (IP) handles routing. Routers operate at Layer 3."
    },
    {
      "id": "a2",
      "text": "Transport layer (Layer 4)",
      "isCorrect": false,
      "explanation": "The transport layer (TCP/UDP) is about process-to-process communication, not routing. Routers don't operate at Layer 4."
    },
    {
      "id": "a3",
      "text": "Data Link layer (Layer 2)",
      "isCorrect": false,
      "explanation": "Layer 2 (switches, MAC addresses) handles local network delivery, not inter-network routing. Routing requires Layer 3 (IP addresses)."
    },
    {
      "id": "a4",
      "text": "All layers work together; no single layer handles routing",
      "isCorrect": false,
      "explanation": "While all layers collaborate, routing is specifically Layer 3's job. The Network layer has routing protocols (OSPF, BGP)."
    }
  ]
}
```

---

## Pattern 6: Confuses Necessary vs. Sufficient

**Misconception:** Learner thinks a necessary condition is also sufficient, or vice versa.

**How to create:** State something true but not the core answer.

**Example:**

```json
{
  "id": "q30",
  "question": "What must happen for a router running Dijkstra to compute shortest paths?",
  "alternatives": [
    {
      "id": "a1",
      "text": "The router must have complete topology knowledge of the entire network",
      "isCorrect": true,
      "explanation": "Correct! Dijkstra requires the full graph. Without knowing all links and their costs, Dijkstra can't compute."
    },
    {
      "id": "a2",
      "text": "All routers must be running the same protocol",
      "isCorrect": false,
      "explanation": "Helpful but not necessary for Dijkstra. Dijkstra works even if routers are heterogeneous, as long as topology is shared. This is beneficial but not the core requirement."
    },
    {
      "id": "a3",
      "text": "The network topology must be stable (no changes)",
      "isCorrect": false,
      "explanation": "While stability helps, Dijkstra can still work in dynamic networks—it just recomputes when topology changes. Not a requirement, more of an assumption for simplicity."
    }
  ]
}
```

---

## Pattern 7: Correct Terminology, Wrong Context

**Misconception:** All the words are right, but applied to wrong scenario.

**How to create:** Use correct terms but in an unrelated context.

**Example:**

```json
{
  "id": "q25",
  "question": "In BGP, what does LOCAL-PREF do?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Indicates the preference for a route **within your own AS** (higher is better)",
      "isCorrect": true,
      "explanation": "Correct! LOCAL-PREF is a value (default 100, scale 0-4.3B) that your AS uses internally to prefer one route over another. Higher LOCAL-PREF = more preferred."
    },
    {
      "id": "a2",
      "text": "Tells neighboring ASes where you prefer them to send traffic to you",
      "isCorrect": false,
      "explanation": "That's **MED** (Multi-Exit Discriminator), not LOCAL-PREF. LOCAL-PREF is internal to your AS. You don't send LOCAL-PREF to neighbors."
    },
    {
      "id": "a3",
      "text": "Limits the maximum number of hops (like TTL) within your AS",
      "isCorrect": false,
      "explanation": "That's not what LOCAL-PREF does. Hop limits are handled by TTL (IP layer), not BGP routing preferences."
    },
    {
      "id": "a4",
      "text": "Ensures lower latency paths are always chosen",
      "isCorrect": false,
      "explanation": "LOCAL-PREF is a number you configure for policy; it doesn't directly measure latency. A route with LOCAL-PREF=200 isn't automatically lower latency than LOCAL-PREF=100."
    }
  ]
}
```

---

## Pattern 8: Temporal or Causal Confusion

**Misconception:** Learner confuses what happens before/after or causes/consequences.

**How to create:** Reverse causality or sequence.

**Example:**

```json
{
  "id": "q35",
  "question": "In TCP's congestion control (AIMD), when does the sender **decrease** the window size?",
  "alternatives": [
    {
      "id": "a1",
      "text": "When packet loss is detected (timeout or 3 duplicate ACKs)",
      "isCorrect": true,
      "explanation": "Correct! Loss is a sign of congestion. On timeout or 3 duplicates, TCP cuts window in half (multiplicative decrease)."
    },
    {
      "id": "a2",
      "text": "Before sending data, to prevent congestion",
      "isCorrect": false,
      "explanation": "No—TCP reacts to loss, not predicts. Window decreases **after** loss is detected, not preemptively."
    },
    {
      "id": "a3",
      "text": "Every RTT, to gradually adapt to network conditions",
      "isCorrect": false,
      "explanation": "TCP **increases** every RTT without loss (additive increase). It only decreases on loss events, not on a schedule."
    }
  ]
}
```

---

## Pattern 9: Confuses Assumption with Consequence

**Misconception:** Learner confuses what must be true for something to work with what results from it.

**How to create:** State a consequence as a requirement, or vice versa.

**Example:**

```json
{
  "id": "q40",
  "question": "For OSPF (Link State) to work correctly, what must be true?",
  "alternatives": [
    {
      "id": "a1",
      "text": "All routers in the area must have identical Link State Database (LSDB) with complete topology",
      "isCorrect": true,
      "explanation": "Correct! OSPF floods link-state advertisements so every router learns the full topology. If LSDB is not identical across routers, Dijkstra will compute different routes."
    },
    {
      "id": "a2",
      "text": "All routers must compute shortest paths at the same time",
      "isCorrect": false,
      "explanation": "No—routers compute independently and asynchronously. What matters is they have the same LSDB, not that they calculate at the same moment."
    },
    {
      "id": "a3",
      "text": "All links must have equal cost (metric = 1)",
      "isCorrect": false,
      "explanation": "Links can have different costs. OSPF supports variable metrics. What matters is all routers **know** the costs, not that they're equal."
    }
  ]
}
```

---

## Pattern 10: Keyword Trigger (Learner Responds to Keyword, Not Understanding)

**Misconception:** Learner sees a keyword (e.g., "handshake", "synchronize") and chooses an answer containing that word, without understanding context.

**How to create:** Include the keyword in a plausible but wrong answer; make correct answer use different words.

**Example:**

```json
{
  "id": "q45",
  "question": "What is the primary purpose of the TCP 3-way handshake?",
  "alternatives": [
    {
      "id": "a1",
      "text": "To synchronize sequence numbers and verify both sides are ready before data transmission",
      "isCorrect": true,
      "explanation": "Correct! The handshake ensures both endpoints are ready and have negotiated initial sequence numbers (ISN). This prevents data corruption from stale connections."
    },
    {
      "id": "a2",
      "text": "To handshake and establish a secure encrypted channel",
      "isCorrect": false,
      "explanation": "Using the keyword 'handshake' doesn't mean encryption! TCP's handshake is about **connection setup**, not security. Encryption comes from TLS/SSL, which is a separate layer above TCP."
    },
    {
      "id": "a3",
      "text": "To synchronize clocks between client and server",
      "isCorrect": false,
      "explanation": "While the word 'synchronize' appears, TCP doesn't synchronize clocks. It synchronizes **sequence numbers**, which are used for ordering, not timing."
    }
  ]
}
```

---

## Distractor Quality Checklist

Before finalizing distractors, ask:

- [ ] Is each distractor **plausible**? (Would a learner who partially understands consider it?)
- [ ] Does each reflect a **real misconception** or adjacent concept?
- [ ] Is each distractor using **correct terminology**? (Avoid nonsense words)
- [ ] Are distractors **roughly equal in length** to the correct answer? (Longer/shorter answers can be obvious clues)
- [ ] Do distractors **avoid double negatives** or complex structures? (Keep them simple)
- [ ] Do distractors **test different types of errors**? (Not all the same misconception)
- [ ] Is it **absolutely clear which is correct** once you understand? (No ambiguity)

---

## Summary: The Golden Rule of Distractors

**A great distractor is an answer that makes sense if you misunderstood one specific thing about the topic.**

If your distractor makes someone who fully understood say "wait, why isn't that right?", even briefly, you've designed well. If it makes someone laugh or immediately discard it, redesign.


