import React, { useEffect, useMemo, useRef, useState } from "react";

const initialMessage = {
  id: "welcome",
  role: "assistant",
  text: "Oi! Sou a IA de suporte do MediCore. Posso ajudar com dúvidas sobre uso do sistema, fluxo de atendimento e boas práticas clínicas.",
  timestamp: Date.now(),
};

function formatTime(value) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const supportRules = [
  {
    keys: ["login", "entrar", "senha", "acesso"],
    reply:
      "Para problemas de acesso: confirme email e senha, valide se o perfil está ativo em Admin e tente limpar o cache do navegador.",
  },
  {
    keys: ["paciente", "cadastro", "cpf"],
    reply:
      "No cadastro de paciente, confira os campos obrigatórios e valide o CPF antes de salvar para evitar duplicidade.",
  },
  {
    keys: ["consulta", "agendamento", "agenda"],
    reply:
      "No agendamento, selecione o paciente, confirme horário disponível e deixe status como pendente até a consulta acontecer.",
  },
  {
    keys: ["urgencia", "urgência", "fila", "risco"],
    reply:
      "Na fila de urgência, priorize nível 1 e 2, registre sinais de alarme e documente a conduta inicial de forma objetiva.",
  },
  {
    keys: ["ia", "assistente", "diagnostico", "diagnóstico"],
    reply:
      "Use a IA como apoio clínico. Sempre valide com protocolo institucional, exame físico e julgamento profissional.",
  },
];

function buildSupportReply(inputText) {
  const text = (inputText || "").toLowerCase();

  if (!text.trim()) {
    return "Não consegui ler sua mensagem. Pode enviar novamente?";
  }

  const match = supportRules.find((rule) =>
    rule.keys.some((key) => text.includes(key)),
  );

  if (match) {
    return match.reply;
  }

  return "Posso ajudar com login, cadastro de pacientes, agendamento, fila de urgência e uso da IA. Me diga em qual tela você está com dificuldade.";
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [text, setText] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);

  const listEndRef = useRef(null);

  const sendDisabled = useMemo(() => !text.trim(), [text]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, assistantTyping, open]);

  const sendMessage = (event) => {
    event.preventDefault();
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `client-${Date.now()}`,
        role: "user",
        text: cleanText,
        timestamp: Date.now(),
      },
    ]);

    setAssistantTyping(true);

    const reply = buildSupportReply(cleanText);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: reply,
          timestamp: Date.now(),
        },
      ]);
      setAssistantTyping(false);
    }, 420);

    setText("");
  };

  return (
    <>
      <button
        type="button"
        className={`support-chat-bubble ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir chat de suporte"
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`} />
      </button>

      {open && (
        <section className="support-chat-panel" aria-label="Chat de suporte">
          <header className="support-chat-header">
            <div>
              <strong>IA de Atendimento</strong>
              <small className="support-chat-status">local</small>
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

            {assistantTyping && (
              <article className="support-chat-msg is-assistant typing">
                <p>Digitando resposta...</p>
              </article>
            )}
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
