import { useEffect, useMemo, useState } from "react";

const HEARTBEAT_MS = 2000;
const PEER_TIMEOUT_MS = 5000;

export default function useCrossTabVerifier(roomId, userId) {
  const tabId = useMemo(
    () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    []
  );
  const [peerTabs, setPeerTabs] = useState(0);
  const [lastPeerSeenAt, setLastPeerSeenAt] = useState(null);

  useEffect(() => {
    if (!roomId || typeof BroadcastChannel === "undefined") {
      setPeerTabs(0);
      setLastPeerSeenAt(null);
      return undefined;
    }

    const channel = new BroadcastChannel(`syncspace-room-${roomId}`);
    const peers = new Map();

    const syncState = () => {
      const now = Date.now();
      for (const [peerId, seenAt] of peers.entries()) {
        if (now - seenAt > PEER_TIMEOUT_MS) {
          peers.delete(peerId);
        }
      }

      setPeerTabs(peers.size);
      setLastPeerSeenAt(peers.size > 0 ? new Date(now).toISOString() : null);
    };

    const postPresence = (kind = "heartbeat") => {
      channel.postMessage({
        kind,
        roomId,
        tabId,
        userId,
        sentAt: Date.now(),
      });
    };

    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload || payload.roomId !== roomId || payload.tabId === tabId) return;

      peers.set(payload.tabId, Date.now());
      syncState();

      if (payload.kind === "hello") {
        postPresence("heartbeat");
      }
    };

    channel.addEventListener("message", handleMessage);
    postPresence("hello");

    const intervalId = window.setInterval(() => {
      postPresence("heartbeat");
      syncState();
    }, HEARTBEAT_MS);

    return () => {
      window.clearInterval(intervalId);
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [roomId, tabId, userId]);

  return {
    peerTabs,
    lastPeerSeenAt,
    crossTabSupported: typeof BroadcastChannel !== "undefined",
  };
}