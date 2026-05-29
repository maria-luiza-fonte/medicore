import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "medicore-server",
    now: new Date().toISOString(),
  });
});

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Mantem historico em memoria por usuario.
const userConversations = new Map();

const getRoom = (userId) => `user:${userId}`;

const ensureConversation = (userId) => {
  if (!userConversations.has(userId)) {
    userConversations.set(userId, [
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        authorId: "system",
        authorName: "Atendimento",
        text: "Canal de atendimento conectado. Sua conversa e individual para seu usuario.",
        timestamp: Date.now(),
      },
    ]);
  }

  return userConversations.get(userId);
};

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId || socket.id;
  const userName = socket.handshake.auth?.userName || "Usuario";

  socket.data.userId = userId;
  socket.data.userName = userName;

  const room = getRoom(userId);
  socket.join(room);

  const conversation = ensureConversation(userId);
  socket.emit("chat:history", conversation);

  socket.on("chat:send", ({ text }) => {
    const cleanText = String(text || "").trim();
    if (!cleanText) return;

    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      role: "user",
      authorId: userId,
      authorName: userName,
      text: cleanText,
      timestamp: Date.now(),
    };

    const current = ensureConversation(userId);
    current.push(message);
    io.to(room).emit("chat:message", message);
  });
});

server.listen(PORT, () => {
  console.log(`MediCore server running on http://localhost:${PORT}`);
});
