import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const initialMessage = {
  id: "welcome",
  role: "assistant",
  text: "Olá! Sou a IA de atendimento do MediCore. Posso ajudar com dúvidas sobre o uso do sistema. Se a conexão estiver offline, sua mensagem será exibida localmente até o servidor voltar.",
  timestamp: Date.now(),
};

function formatTime(value) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [text, setText] = useState("");
  const [connectionState, setConnectionState] = useState("offline");

  const listEndRef = useRef(null);
  const socketRef = useRef(null);

  const sendDisabled = !text.trim();

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    const userRaw = localStorage.getItem("mc-chat-user") || "";
    const defaultUser = {
      userId: "guest",
      userName: "Usuário",
    };

    let authUser = defaultUser;
    try {
      const parsed = JSON.parse(userRaw);
      if (parsed?.userId) {
        authUser = {
          userId: String(parsed.userId),
          userName: String(parsed.userName || "Usuário"),
        };
      }
    } catch {
      authUser = defaultUser;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      auth: authUser,
      timeout: 4000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionState("online");
    });

    socket.on("disconnect", () => {
      setConnectionState("offline");
    });

    socket.on("connect_error", () => {
      setConnectionState("offline");
    });

    socket.on("chat:history", (history) => {
      if (Array.isArray(history) && history.length > 0) {
        setMessages(history);
      }
    });

    socket.on("chat:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:send", { text: cleanText });
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          role: "user",
          authorId: "offline",
          authorName: "Usuário",
          text: cleanText,
          timestamp: Date.now(),
        },
      ]);
    }

    setText("");
  };

  return (
    <>
      <button
        type="button"
        className={`support-chat-bubble ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir chat de atendimento"
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`} />
      </button>

      {open && (
        <section
          className="support-chat-panel"
          aria-label="Chat de atendimento"
        >
          <header className="support-chat-header">
            <div>
              <strong>IA de Atendimento</strong>
              <small
                className={`support-chat-status ${connectionState !== "online" ? "off" : ""}`}
              >
                {connectionState}
              </small>
            </div>
          </header>

          <div className="support-chat-messages">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`support-chat-msg ${message.role === "user" ? "is-user" : "is-assistant"}`}
              >
                <p>{message.text}</p>
                <time>{formatTime(message.timestamp)}</time>
              </article>
            ))}

            <div ref={listEndRef} />
          </div>

          <form className="support-chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Digite sua dúvida..."
              className="mc-input"
            />
            <button type="submit" className="btn-teal" disabled={sendDisabled}>
              Enviar
            </button>
          </form>
        </section>
      )}
    </>
  );
}
