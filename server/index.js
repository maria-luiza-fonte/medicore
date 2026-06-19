import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://kxiivljlnajkrrizewbm.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aWl2bGpsbmFqa3JyaXpld2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTQwMzUsImV4cCI6MjA5NjczMDAzNX0.uVjVoVG9pFwYI2ZM627jthjHalfC-TJ9gzuQY_B8Jp8",
);

const getUserFromToken = async (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;

  return data.user;
};

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    const user = await getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data: roleData } = await supabase
      .from("user_role")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    const role = roleData?.role;

    if (!role) {
      return res.status(403).json({ error: "No role assigned" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    req.role = role;

    next();
  };
};

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

app.get("/users", async (req, res) => {
  const user = await getUserFromToken(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("app_user")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// Rota de chat com Groq (IA privada no backend)
app.post("/ai/chat", async (req, res) => {
  try {
    const { messages, temperature = 0.2 } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages inválidas" });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);
      return res.status(500).json({ error: "Sem GROQ_API_KEY" });
    }

    const cleanedMessages = messages
      .filter((m) => m?.role && m?.content)
      .map((m) => ({
        role: m.role,
        content: String(m.content),
      }));

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: cleanedMessages,
          temperature,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Groq error:", data);
      return res.status(500).json({
        error: data?.error?.message || "Erro na IA",
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    return res.json({
      content: reply || "Sem resposta da IA",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro interno no servidor de IA",
    });
  }
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
