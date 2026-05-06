import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

const OPENROUTER_KEY_STORAGE = "mc-openrouter-api-key";
const OPENROUTER_MODEL_STORAGE = "mc-openrouter-model";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

const MEDICAL_SYSTEM_PROMPT = `Você é o MediCore AI, um assistente médico inteligente integrado ao sistema de consultório MediCore. 
Você auxilia médicos com:
- Análise de sintomas e possíveis diagnósticos diferenciais
- Sugestões de exames complementares
- Informações sobre medicamentos, doses e interações
- Orientações sobre condutas clínicas baseadas em evidências
- Análise de dados de pacientes
- Dúvidas sobre protocolos médicos

IMPORTANTE: Sempre enfatize que suas sugestões são de apoio à decisão clínica e que o médico deve usar seu julgamento profissional. Nunca substitua a avaliação médica presencial.

Responda sempre em português brasileiro de forma clara, objetiva e profissional. Use formatação com marcadores quando listar itens.`;

const VETERINARY_SYSTEM_PROMPT = `Você é o MediCore Vet AI, um assistente de apoio clínico veterinário para profissionais de saúde animal.
Você auxilia médicos veterinários com:
- Triagem clínica de sinais e sintomas em animais
- Diagnósticos diferenciais veterinários por espécie
- Sugestões de exames laboratoriais e de imagem
- Condutas terapêuticas veterinárias baseadas em evidências
- Cuidados de internação, monitoramento e bem-estar animal
- Comunicação técnica com tutores sobre riscos e orientações

IMPORTANTE: Suas respostas são apoio à decisão clínica. Nunca substitua a avaliação presencial, exame físico e julgamento do médico veterinário responsável.

Responda sempre em português brasileiro de forma clara, objetiva e profissional.`;

const MEDICAL_SCOPE_INSTRUCTION = `[Diretriz obrigatória do sistema]
Responda SEMPRE com foco em saúde e prática clínica profissional para medicina humana.
Se a pergunta do usuário for genérica ou não médica, converta o tema para o contexto médico e de assistência ao paciente humano.
Inclua, quando aplicável: relevância clínica, riscos/alertas e conduta prática para profissionais de saúde.
Não responda fora do escopo médico.`;

const VETERINARY_SCOPE_INSTRUCTION = `[Diretriz obrigatória do sistema]
Responda SEMPRE com foco em medicina veterinária e prática clínica animal.
Se a pergunta for genérica ou não veterinária, converta o tema para avaliação clínica de animais, manejo e cuidado do paciente veterinário.
Inclua, quando aplicável: espécie, faixa etária, sinais de alarme, riscos e conduta prática para o médico veterinário.
Não responda fora do escopo veterinário.`;

const MEDICAL_SUGGESTIONS = [
  "Quais são os critérios para diagnóstico de hipertensão arterial sistêmica?",
  "Paciente com dor torácica, quais diagnósticos diferenciais devo considerar?",
  "Quais exames pedir para acompanhamento de diabetes tipo 2?",
  "Interações medicamentosas do losartana com outros anti-hipertensivos",
  "Protocolo de atendimento para crise hipertensiva",
  "Sintomas de insuficiência cardíaca congestiva",
];

const VETERINARY_SUGGESTIONS = [
  "Cão com vômito e diarreia agudos: quais diagnósticos diferenciais priorizar?",
  "Quais exames solicitar para suspeita de doença renal crônica felina?",
  "Protocolo inicial para atendimento de intoxicação em pequenos animais",
  "Como conduzir dor pós-operatória em cães e gatos de forma multimodal?",
  "Sinais de alarme em paciente felino com obstrução uretral",
  "Abordagem clínica de dermatite alérgica canina na rotina ambulatorial",
];

export default function AIAssistant() {
  const { user, patients } = useApp();
  const isVeterinary = user?.professionalType === "veterinary";
  const userPatients = patients.filter((p) => p.doctorId === user?.doctorId);
  const scopeInstruction = isVeterinary
    ? VETERINARY_SCOPE_INSTRUCTION
    : MEDICAL_SCOPE_INSTRUCTION;
  const systemPrompt = isVeterinary
    ? VETERINARY_SYSTEM_PROMPT
    : MEDICAL_SYSTEM_PROMPT;
  const suggestions = isVeterinary
    ? VETERINARY_SUGGESTIONS
    : MEDICAL_SUGGESTIONS;
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: isVeterinary
        ? "Olá! Sou o **MediCore Vet AI**, seu assistente de apoio clínico veterinário.\n\nPosso ajudar com triagem de sinais clínicos, diagnósticos diferenciais por espécie, exames complementares e condutas terapêuticas.\n\n*Como posso auxiliar no atendimento veterinário de hoje?*"
        : "Olá! Sou o **MediCore AI**, seu assistente de diagnóstico e apoio clínico.\n\nPosso ajudar com análise de sintomas, diagnósticos diferenciais, informações sobre medicamentos, protocolos clínicos e muito mais.\n\n*Como posso auxiliar você hoje?*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);

  const storedApiKey = localStorage.getItem(OPENROUTER_KEY_STORAGE) || "";
  const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
  const apiKey = storedApiKey || envApiKey;
  const model =
    localStorage.getItem(OPENROUTER_MODEL_STORAGE) ||
    import.meta.env.VITE_OPENROUTER_MODEL ||
    DEFAULT_MODEL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const formatInline = (value) =>
    value
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

  const formatMsg = (text) => {
    const safeText = escapeHtml(text || "");
    const lines = safeText.split("\n");
    let html = "";
    let listType = null;
    let tableRows = [];

    const closeList = () => {
      if (listType) {
        html += `</${listType}>`;
        listType = null;
      }
    };

    const parseTableCells = (line) =>
      line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim());

    const isTableSeparator = (line) =>
      /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);

    const flushTable = () => {
      if (!tableRows.length) return;

      const hasHeader = tableRows.length >= 2 && isTableSeparator(tableRows[1]);

      const headerCells = hasHeader ? parseTableCells(tableRows[0]) : [];
      const bodyStart = hasHeader ? 2 : 0;
      const bodyRows = tableRows.slice(bodyStart).map(parseTableCells);

      html += '<div class="ai-md-table-wrap"><table class="ai-md-table">';

      if (headerCells.length) {
        html += "<thead><tr>";
        headerCells.forEach((cell) => {
          html += `<th>${formatInline(cell)}</th>`;
        });
        html += "</tr></thead>";
      }

      if (bodyRows.length) {
        html += "<tbody>";
        bodyRows.forEach((row) => {
          html += "<tr>";
          row.forEach((cell) => {
            html += `<td>${formatInline(cell)}</td>`;
          });
          html += "</tr>";
        });
        html += "</tbody>";
      }

      html += "</table></div>";
      tableRows = [];
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();

      const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        flushTable();
        closeList();
        html += `<div class="ai-md-heading">${formatInline(headingMatch[1])}</div>`;
        return;
      }

      const tableMatch = line.includes("|") && line.split("|").length >= 3;
      if (tableMatch) {
        closeList();
        tableRows.push(line);
        return;
      }

      flushTable();

      const unorderedListMatch = line.match(/^[-*]\s+(.+)$/);
      if (unorderedListMatch) {
        if (listType !== "ul") {
          closeList();
          html += '<ul class="ai-md-list">';
          listType = "ul";
        }
        html += `<li>${formatInline(unorderedListMatch[1])}</li>`;
        return;
      }

      const orderedListMatch = line.match(/^\d+[\.)]\s+(.+)$/);
      if (orderedListMatch) {
        if (listType !== "ol") {
          closeList();
          html += '<ol class="ai-md-list ai-md-list-ordered">';
          listType = "ol";
        }
        html += `<li>${formatInline(orderedListMatch[1])}</li>`;
        return;
      }

      closeList();

      if (!line) {
        html += '<div class="ai-md-spacer"></div>';
        return;
      }

      html += `<p class="ai-md-p">${formatInline(line)}</p>`;
    });

    flushTable();
    closeList();
    return html;
  };

  const sendMessage = async (msg) => {
    const text = msg || input.trim();
    if (!text || loading) return;
    setInput("");

    const patient = userPatients.find(
      (p) => p.id === parseInt(selectedPatient),
    );
    const contextMsg = patient
      ? isVeterinary
        ? `[Contexto do paciente veterinário: ${patient.name}, ${Math.floor((Date.now() - new Date(patient.dob)) / (365.25 * 24 * 3600 * 1000))} anos (idade estimada), alergias registradas: ${patient.allergies}, condições: ${patient.conditions || "nenhuma"}. Considerar avaliação por espécie, peso e histórico do tutor.]\n\n${text}`
        : `[Contexto do paciente: ${patient.name}, ${Math.floor((Date.now() - new Date(patient.dob)) / (365.25 * 24 * 3600 * 1000))} anos, tipo sanguíneo ${patient.bloodType}, alergias: ${patient.allergies}, condições: ${patient.conditions || "nenhuma"}]\n\n${text}`
      : text;

    const scopedMsg = `${scopeInstruction}\n\nPergunta do profissional:\n${contextMsg}`;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Para usar uma IA real, configure sua chave da OpenRouter em **Configurações > Integração de IA** ou defina `VITE_OPENROUTER_API_KEY` no ambiente.",
          },
        ]);
        return;
      }

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...newMessages.map((m) => ({
          role: m.role,
          content:
            m.role === "user" && m.content === text ? scopedMsg : m.content,
        })),
      ];

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "MediCore",
          },
          body: JSON.stringify({
            model,
            messages: apiMessages,
            temperature: 0.2,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.error?.message ||
          `Falha na integração da IA (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        "Desculpe, não consegui processar sua mensagem.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Erro ao conectar com o serviço de IA: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 116px)",
      }}
    >
      <div className="mc-page-header">
        <h1
          className="mc-page-title"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className="bi bi-robot"
              style={{ color: "white", fontSize: 18 }}
            ></i>
          </div>
          {isVeterinary ? "Assistente IA Veterinária" : "Assistente IA"}
        </h1>
        <p className="mc-page-subtitle">
          {isVeterinary
            ? "Apoio clínico veterinário baseado em evidências — não substitui avaliação do médico veterinário"
            : "Apoio diagnóstico baseado em evidências — não substitui avaliação médica"}
        </p>
      </div>

      <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
        {/* Chat */}
        <div
          className="mc-card"
          style={{
            flex: 1,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Context bar */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--mc-border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <i
              className="bi bi-person-circle"
              style={{ color: "var(--mc-slate)", fontSize: 16 }}
            ></i>
            <select
              className="mc-input form-select"
              style={{ maxWidth: 260 }}
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Consulta geral (sem paciente)</option>
              {userPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {selectedPatient && (
              <span style={{ fontSize: 12, color: "var(--mc-teal)" }}>
                <i className="bi bi-check-circle me-1"></i>Contexto do paciente
                ativo
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="ai-messages" style={{ flex: 1, overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.role === "assistant" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="bi bi-robot"
                        style={{ color: "white", fontSize: 11 }}
                      ></i>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--mc-slate)",
                        fontWeight: 600,
                      }}
                    >
                      MediCore AI
                    </span>
                  </div>
                )}
                <div
                  className="ai-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="ai-msg assistant">
                <div
                  className="ai-msg-bubble"
                  style={{ display: "flex", gap: 6, alignItems: "center" }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--mc-teal)",
                        animation: "pulse 1.4s infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    ></div>
                  ))}
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--mc-slate)",
                      marginLeft: 4,
                    }}
                  >
                    Analisando...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--mc-border-subtle)",
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <textarea
                className="mc-input form-control"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Descreva sintomas, faça perguntas clínicas... (Enter para enviar)"
                style={{ resize: "none" }}
                disabled={loading}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-teal"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{ alignSelf: "flex-end", padding: "10px 16px" }}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  id="ai-suggestions-toggle"
                  style={{
                    display: "none",
                    alignSelf: "flex-end",
                    padding: "10px 16px",
                  }}
                >
                  <i
                    className={`bi bi-lightbulb${showSuggestions ? "-fill" : ""}`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions sidebar - desktop */}
        <div
          id="ai-suggestions-desktop"
          style={{
            width: 260,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div className="mc-card-flat" style={{ padding: "16px" }}>
            <h6
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "var(--mc-slate)",
                marginBottom: 12,
              }}
            >
              Perguntas Sugeridas
            </h6>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="btn-ghost btn"
                  style={{
                    textAlign: "left",
                    fontSize: 12,
                    padding: "8px 12px",
                    lineHeight: 1.4,
                  }}
                  onClick={() => sendMessage(s)}
                >
                  <i
                    className="bi bi-lightbulb me-2"
                    style={{ color: "#f59e0b" }}
                  ></i>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mc-card-flat" style={{ padding: "16px" }}>
            <h6
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "var(--mc-slate)",
                marginBottom: 10,
              }}
            >
              Aviso Legal
            </h6>
            <p
              style={{
                fontSize: 11.5,
                color: "var(--mc-slate)",
                lineHeight: 1.6,
              }}
            >
              {isVeterinary
                ? "O MediCore Vet AI é uma ferramenta de apoio à decisão clínica veterinária. As sugestões não substituem o julgamento e a avaliação presencial do médico veterinário responsável."
                : "O MediCore AI é uma ferramenta de apoio à decisão clínica. As sugestões fornecidas não substituem o julgamento e a avaliação do médico responsável."}
            </p>
          </div>

          <button
            className="btn btn-ghost"
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content: "Nova conversa iniciada. Como posso ajudar?",
                },
              ])
            }
            style={{ fontSize: 12, padding: "8px" }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Nova conversa
          </button>
        </div>

        {/* Suggestions modal - mobile */}
        {showSuggestions && (
          <div
            className="mc-modal-overlay"
            onClick={() => setShowSuggestions(false)}
          >
            <div
              className="mc-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "90%", maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="mc-modal-header">
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    margin: 0,
                  }}
                >
                  Perguntas Sugeridas
                </h4>
                <button
                  className="btn-ghost btn"
                  style={{ padding: "4px 8px" }}
                  onClick={() => setShowSuggestions(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="mc-modal-body">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="btn-ghost btn"
                      style={{
                        textAlign: "left",
                        fontSize: 13,
                        padding: "12px 16px",
                        lineHeight: 1.4,
                        border: "1px solid var(--mc-border-subtle)",
                        borderRadius: 8,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--mc-surface-2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onClick={() => {
                        sendMessage(s);
                        setShowSuggestions(false);
                      }}
                    >
                      <i
                        className="bi bi-lightbulb-fill me-2"
                        style={{ color: "#f59e0b" }}
                      ></i>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
