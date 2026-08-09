import * as Y from "yjs";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate, removeAwarenessStates } from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

function uint8ArrayToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export default class SocketYjsProvider {
  constructor({ socket, roomId, user, onConnectionChange, onLastSaved }) {
    this.socket = socket;
    this.roomId = roomId;
    this.user = user;
    this.onConnectionChange = onConnectionChange;
    this.onLastSaved = onLastSaved;
    this.doc = new Y.Doc();
    this.awareness = new Awareness(this.doc);
    this.synced = false;
    this.destroyed = false;

    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleEditorReady = this.handleEditorReady.bind(this);
    this.handleSyncMessage = this.handleSyncMessage.bind(this);
    this.handleAwarenessMessage = this.handleAwarenessMessage.bind(this);
    this.handleCodeSaved = this.handleCodeSaved.bind(this);
    this.handleAwarenessUpdate = this.handleAwarenessUpdate.bind(this);

    this.awareness.on("update", this.handleAwarenessUpdate);
    this.attachSocketListeners();
  }

  attachSocketListeners() {
    this.socket.on("connect", this.handleConnect);
    this.socket.on("disconnect", this.handleDisconnect);
    this.socket.on("editorReady", this.handleEditorReady);
    this.socket.on("yjsSync", this.handleSyncMessage);
    this.socket.on("yjsAwareness", this.handleAwarenessMessage);
    this.socket.on("codeSaved", this.handleCodeSaved);

    if (this.socket.connected) {
      this.handleConnect();
    }
  }

  handleConnect() {
    if (this.destroyed) return;

    this.onConnectionChange?.(true);
    this.socket.emit("joinEditor", { roomId: this.roomId });
  }

  handleDisconnect() {
    if (this.destroyed) return;
    this.onConnectionChange?.(false);
  }

  handleEditorReady({ roomId, lastSaved } = {}) {
    if (roomId !== this.roomId || this.destroyed) return;

    this.onLastSaved?.(lastSaved ?? null);
    this.announceLocalPresence();
    this.requestInitialSync();
  }

  requestInitialSync() {
    const encoder = encoding.createEncoder();
    syncProtocol.writeSyncStep1(encoder, this.doc);
    this.socket.emit("yjsSync", {
      roomId: this.roomId,
      update: uint8ArrayToBase64(encoding.toUint8Array(encoder)),
    });
  }

  handleSyncMessage({ roomId, update } = {}) {
    if (roomId !== this.roomId || !update || this.destroyed) return;

    const decoder = decoding.createDecoder(base64ToUint8Array(update));
    const encoder = encoding.createEncoder();
    syncProtocol.readSyncMessage(decoder, encoder, this.doc, this);

    const reply = encoding.toUint8Array(encoder);
    if (reply.length > 0) {
      this.socket.emit("yjsSync", {
        roomId: this.roomId,
        update: uint8ArrayToBase64(reply),
      });
    }

    this.synced = true;
  }

  handleAwarenessMessage({ roomId, update, disconnectedClientIds } = {}) {
    if (roomId !== this.roomId || this.destroyed) return;

    if (update) {
      applyAwarenessUpdate(this.awareness, base64ToUint8Array(update), this);
    }

    if (Array.isArray(disconnectedClientIds) && disconnectedClientIds.length > 0) {
      removeAwarenessStates(this.awareness, disconnectedClientIds, this);
    }
  }

  handleCodeSaved({ lastSaved } = {}) {
    this.onLastSaved?.(lastSaved ?? null);
  }

  handleAwarenessUpdate({ added, updated, removed }, origin) {
    if (this.destroyed || origin === this) return;

    const changedClients = added.concat(updated, removed);
    if (changedClients.length === 0) return;

    const update = encodeAwarenessUpdate(this.awareness, changedClients);
    this.socket.emit("yjsAwareness", {
      roomId: this.roomId,
      update: uint8ArrayToBase64(update),
    });
  }

  announceLocalPresence(cursor = null) {
    this.awareness.setLocalStateField("user", this.user);
    this.awareness.setLocalStateField("cursor", cursor);
  }

  updateCursor(cursor = null) {
    this.announceLocalPresence(cursor);
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;

    this.awareness.setLocalState(null);
    this.socket.emit("leaveEditor", { roomId: this.roomId });
    this.socket.off("connect", this.handleConnect);
    this.socket.off("disconnect", this.handleDisconnect);
    this.socket.off("editorReady", this.handleEditorReady);
    this.socket.off("yjsSync", this.handleSyncMessage);
    this.socket.off("yjsAwareness", this.handleAwarenessMessage);
    this.socket.off("codeSaved", this.handleCodeSaved);
    this.awareness.off("update", this.handleAwarenessUpdate);
    this.awareness.destroy();
    this.doc.destroy();
  }
}