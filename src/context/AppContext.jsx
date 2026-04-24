import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const INITIAL_PATIENTS = [
  {
    id: 1,
    name: "Ana Paula Ferreira",
    cpf: "123.456.789-00",
    dob: "1985-03-12",
    phone: "(11) 98765-4321",
    email: "ana.paula@email.com",
    bloodType: "A+",
    allergies: "Penicilina",
    conditions: "Hipertensão",
    insurance: "Unimed",
    createdAt: "2024-01-10",
    urgency: null,
  },
  {
    id: 2,
    name: "Carlos Eduardo Souza",
    cpf: "987.654.321-00",
    dob: "1972-07-24",
    phone: "(11) 91234-5678",
    email: "carlos.souza@email.com",
    bloodType: "O-",
    allergies: "Nenhuma",
    conditions: "Diabetes Tipo 2",
    insurance: "Bradesco Saúde",
    createdAt: "2024-01-15",
    urgency: 1,
  },
  {
    id: 3,
    name: "Mariana Costa Lima",
    cpf: "456.789.123-00",
    dob: "1990-11-05",
    phone: "(11) 97654-3210",
    email: "mariana.lima@email.com",
    bloodType: "B+",
    allergies: "Dipirona",
    conditions: "Asma",
    insurance: "SulAmérica",
    createdAt: "2024-02-01",
    urgency: 2,
  },
  {
    id: 4,
    name: "Roberto Alves Junior",
    cpf: "321.654.987-00",
    dob: "1968-05-18",
    phone: "(11) 96543-2109",
    email: "roberto.jr@email.com",
    bloodType: "AB+",
    allergies: "Aspirina",
    conditions: "Cardiopatia",
    insurance: "Particular",
    createdAt: "2024-02-10",
    urgency: 1,
  },
  {
    id: 5,
    name: "Fernanda Oliveira",
    cpf: "654.321.098-00",
    dob: "1995-09-30",
    phone: "(11) 95432-1098",
    email: "fernanda.oli@email.com",
    bloodType: "A-",
    allergies: "Nenhuma",
    conditions: "Saudável",
    insurance: "Amil",
    createdAt: "2024-02-20",
    urgency: null,
  },
  {
    id: 6,
    name: "João Marcos Pereira",
    cpf: "789.012.345-00",
    dob: "1958-12-01",
    phone: "(11) 94321-0987",
    email: "joao.pereira@email.com",
    bloodType: "O+",
    allergies: "Sulfa",
    conditions: "DPOC, Hipertensão",
    insurance: "Unimed",
    createdAt: "2024-03-05",
    urgency: 3,
  },
];

const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    patientId: 1,
    patientName: "Ana Paula Ferreira",
    doctor: "Dr. Ricardo Mendes",
    specialty: "Cardiologia",
    date: "2025-04-10",
    time: "09:00",
    status: "done",
    notes: "Consulta de rotina. PA: 130/85. Orientada sobre dieta.",
    diagnosis: "Hipertensão controlada",
  },
  {
    id: 2,
    patientId: 2,
    patientName: "Carlos Eduardo Souza",
    doctor: "Dr. Ricardo Mendes",
    specialty: "Cardiologia",
    date: "2025-04-12",
    time: "10:30",
    status: "done",
    notes: "Pós-alta hospitalar. Apresentou taquicardia.",
    diagnosis: "Arritmia supraventricular",
    urgency: 1,
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Mariana Costa Lima",
    doctor: "Dra. Beatriz Almeida",
    specialty: "Clínica Geral",
    date: "2025-04-14",
    time: "14:00",
    status: "pending",
    notes: "",
    diagnosis: "",
  },
  {
    id: 4,
    patientId: 4,
    patientName: "Roberto Alves Junior",
    doctor: "Dr. Ricardo Mendes",
    specialty: "Cardiologia",
    date: "2025-04-15",
    time: "08:30",
    status: "pending",
    notes: "",
    diagnosis: "",
    urgency: 1,
  },
  {
    id: 5,
    patientId: 5,
    patientName: "Fernanda Oliveira",
    doctor: "Dra. Beatriz Almeida",
    specialty: "Ginecologia",
    date: "2025-04-16",
    time: "11:00",
    status: "pending",
    notes: "",
    diagnosis: "",
  },
  {
    id: 6,
    patientId: 6,
    patientName: "João Marcos Pereira",
    doctor: "Dra. Beatriz Almeida",
    specialty: "Pneumologia",
    date: "2025-04-17",
    time: "15:30",
    status: "pending",
    notes: "",
    diagnosis: "",
    urgency: 3,
  },
];

const INITIAL_URGENCY_QUEUE = [
  {
    id: 1,
    patientId: 2,
    patientName: "Carlos Eduardo Souza",
    reason:
      "Arritmia supraventricular detectada no pós-atendimento. Necessita acompanhamento urgente.",
    level: 1,
    createdAt: "2025-04-12",
    status: "waiting",
    doctor: "Dr. Ricardo Mendes",
    appointmentId: 2,
  },
  {
    id: 2,
    patientId: 4,
    patientName: "Roberto Alves Junior",
    reason: "Pós-procedimento cardíaco. Relatou dor torácica leve.",
    level: 1,
    createdAt: "2025-04-13",
    status: "waiting",
    doctor: "Dr. Ricardo Mendes",
    appointmentId: 4,
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Mariana Costa Lima",
    reason: "Crise asmática relatada após consulta. Medicação ajustada.",
    level: 2,
    createdAt: "2025-04-14",
    status: "waiting",
    doctor: "Dra. Beatriz Almeida",
    appointmentId: 3,
  },
  {
    id: 4,
    patientId: 6,
    patientName: "João Marcos Pereira",
    reason: "Desconforto respiratório aumentou. DPOC em exacerbação.",
    level: 3,
    createdAt: "2025-04-14",
    status: "scheduled",
    doctor: "Dra. Beatriz Almeida",
    appointmentId: 6,
    scheduledDate: "2025-04-16",
    scheduledTime: "08:00",
  },
];

const THEME_STORAGE_KEY = "mc-theme";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "auto")
    return savedTheme;
  return "auto";
};

const getEffectiveTheme = (theme) => {
  return theme === "auto" ? getSystemTheme() : theme;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [urgencyQueue, setUrgencyQueue] = useState(INITIAL_URGENCY_QUEUE);
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setThemeState] = useState(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showHome, setShowHome] = useState(true);

  const setTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark" || newTheme === "auto") {
      setThemeState(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onThemeChange = () => {
      if (theme === "auto") {
        const effectiveTheme = getEffectiveTheme("auto");
        document.documentElement.setAttribute("data-theme", effectiveTheme);
      }
    };

    mediaQuery.addEventListener("change", onThemeChange);
    return () => mediaQuery.removeEventListener("change", onThemeChange);
  }, [theme]);

  const login = (email, password, professionalType = "medical") => {
    if (email && password) {
      const isVeterinary = professionalType === "veterinary";
      setUser({
        name: isVeterinary ? "Dra. Camila Rocha" : "Dr. Ricardo Mendes",
        email,
        role: isVeterinary
          ? "Médica Veterinária — Clínica de Pequenos Animais"
          : "Médico — Cardiologia",
        avatar: isVeterinary ? "CR" : "RM",
        professionalType,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setActivePage("dashboard");
    setShowLogin(true);
  };

  const register = (name, email, password, professionalType, crm) => {
    if (name && email && password && crm) {
      const isVeterinary = professionalType === "veterinary";
      const avatar = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      setUser({
        name,
        email,
        role: isVeterinary
          ? "Médica Veterinária — Clínica de Pequenos Animais"
          : "Médico — Cardiologia",
        avatar,
        professionalType,
        crm,
      });
      return true;
    }
    return false;
  };

  const addPatient = (p) => {
    const newP = {
      ...p,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      urgency: null,
    };
    setPatients((prev) => [...prev, newP]);
    return newP;
  };

  const updatePatient = (id, data) =>
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  const deletePatient = (id) =>
    setPatients((prev) => prev.filter((p) => p.id !== id));

  const addAppointment = (a) => {
    const newA = { ...a, id: Date.now() };
    setAppointments((prev) => [...prev, newA]);
    return newA;
  };

  const updateAppointment = (id, data) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    );

  const addUrgency = (u) => {
    const newU = {
      ...u,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      status: "waiting",
    };
    setUrgencyQueue((prev) =>
      [...prev, newU].sort((a, b) => a.level - b.level),
    );
    return newU;
  };

  const updateUrgency = (id, data) =>
    setUrgencyQueue((prev) =>
      prev
        .map((u) => (u.id === id ? { ...u, ...data } : u))
        .sort((a, b) => a.level - b.level),
    );

  const toggleSidebarOpen = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        showLogin,
        setShowLogin,
        showHome,
        setShowHome,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        appointments,
        addAppointment,
        updateAppointment,
        urgencyQueue,
        addUrgency,
        updateUrgency,
        activePage,
        setActivePage,
        theme,
        setTheme,
        toggleTheme,
        sidebarOpen,
        toggleSidebarOpen,
        closeSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
