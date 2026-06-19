import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { createClient } from '@supabase/supabase-js'

  // Create a single supabase client for interacting with your database
    const supabase = createClient('https://kxiivljlnajkrrizewbm.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5amp4ZXNyemNwdmZwbGxwcnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTI5MDgsImV4cCI6MjA5NTYyODkwOH0.sIF0qmmkSxpCcpv0_6ZMlfQ89or0YEZvXE60UHrpa6E')
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

// Rota de chat com Groq (IA privada no backend)
app.post("/ai/chat", async (req, res) => {
  try {
    const { messages, temperature = 0.2 } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages array is required and must not be empty",
      });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";

    if (!groqApiKey) {
      console.error("GROQ_API_KEY not configured");
      return res.status(500).json({
        error: "AI service not properly configured",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: groqModel,
          messages,
          temperature,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.error?.message || `Groq API error (${response.status})`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Desculpe, não consegui processar sua mensagem.";

    res.json({
      role: "assistant",
      content: reply,
    });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({
      error:
        "Houve um problema ao processar sua solicitação. Por favor, tente novamente mais tarde.",
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
