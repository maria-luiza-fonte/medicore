import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kxiivljlnajkrrizewbm.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aWl2bGpsbmFqa3JyaXpld2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTQwMzUsImV4cCI6MjA5NjczMDAzNX0.uVjVoVG9pFwYI2ZM627jthjHalfC-TJ9gzuQY_B8Jp8",
);

const AppContext = createContext();

const INITIAL_PATIENTS = [];

const INITIAL_APPOINTMENTS = [];

const INITIAL_URGENCY_QUEUE = [];

const INITIAL_INSURANCES = [];

const INITIAL_SYSTEM_USERS = [];

const INITIAL_SYSTEM_LOGS = [];

const THEME_STORAGE_KEY = "mc-theme";
const COMPACT_MODE_STORAGE_KEY = "mc-compact-mode";

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

const getInitialCompactMode = () => {
  const savedCompactMode = localStorage.getItem(COMPACT_MODE_STORAGE_KEY);
  return savedCompactMode === "true";
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [urgencyQueue, setUrgencyQueue] = useState(INITIAL_URGENCY_QUEUE);
  const [insurances, setInsurances] = useState(INITIAL_INSURANCES);
  const [systemUsers, setSystemUsers] = useState(INITIAL_SYSTEM_USERS);
  const [systemLogs, setSystemLogs] = useState(INITIAL_SYSTEM_LOGS);
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setThemeState] = useState(getInitialTheme);
  const [compactMode, setCompactMode] = useState(getInitialCompactMode);
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

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Erro ao carregar users");
        return;
      }

      const data = await res.json();
      setSystemUsers(data);
    } catch (err) {
      console.error("Erro de rede ao carregar users:", err);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return false;

    const authUser = data.user;

    const name = authUser.user_metadata?.name || authUser.email.split("@")[0];

    const getInitials = (name = "") => {
      const parts = name.trim().split(" ").filter(Boolean);

      if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
      }

      return parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
    };

    const avatar = getInitials(name);

    setUser({
      id: authUser.id,
      email: authUser.email,
      name,
      avatar,
    });

    return true;

    if (error) return false;

    localStorage.setItem("token", data.session.access_token);
    setUser(data.user);

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    localStorage.removeItem("token");
  };

  const register = (name, email, password, professionalType, crm) => {
    if (name && email && password && crm) {
      const avatar = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      setUser({
        name,
        email,
        professionalType,
        crm,
        avatar,
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
      doctorId: user?.doctorId || null,
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

  const addSystemUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSystemUsers((prev) => [...prev, newUser]);
    addSystemLog("user", `Usuário ${userData.name} adicionado`);
    return newUser;
  };

  const updateSystemUser = (id, data) => {
    setSystemUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u)),
    );
    const user = systemUsers.find((u) => u.id === id);
    if (user) {
      addSystemLog("user", `Usuário ${user.name} atualizado`);
    }
  };

  const deleteSystemUser = (id) => {
    const user = systemUsers.find((u) => u.id === id);
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
    if (user) {
      addSystemLog("user", `Usuário ${user.name} removido`);
    }
  };

  const addSystemLog = (type, action) => {
    const newLog = {
      id: Date.now(),
      type,
      user: user?.name || "Sistema",
      action,
      timestamp: new Date().toISOString(),
    };
    setSystemLogs((prev) => [newLog, ...prev]);
  };

  const addInsurance = (insuranceData) => {
    const newInsurance = {
      ...insuranceData,
      id: Date.now(),
      status: "active",
    };
    setInsurances((prev) => [...prev, newInsurance]);
    addSystemLog("insurance", `Convênio ${insuranceData.name} adicionado`);
    return newInsurance;
  };

  const updateInsurance = (id, data) => {
    setInsurances((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i)),
    );
  };

  const deleteInsurance = (id) => {
    const insurance = insurances.find((i) => i.id === id);
    setInsurances((prev) => prev.filter((i) => i.id !== id));
    if (insurance) {
      addSystemLog("insurance", `Convênio ${insurance.name} removido`);
    }
  };

  const toggleInsuranceStatus = (id) => {
    const insurance = insurances.find((i) => i.id === id);
    if (insurance) {
      const newStatus = insurance.status === "active" ? "inactive" : "active";
      updateInsurance(id, { status: newStatus });
      addSystemLog(
        "insurance",
        `Convênio ${insurance.name} marcado como ${newStatus === "active" ? "ativo" : "inativo"}`,
      );
    }
  };

  const toggleSidebarOpen = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setCompactModeValue = (value) => {
    setCompactMode(Boolean(value));
    localStorage.setItem(COMPACT_MODE_STORAGE_KEY, String(Boolean(value)));
  };

  const toggleCompactMode = () => {
    setCompactModeValue(!compactMode);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-compact-mode",
      compactMode ? "true" : "false",
    );
  }, [compactMode]);

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
        insurances,
        addInsurance,
        updateInsurance,
        deleteInsurance,
        toggleInsuranceStatus,
        systemUsers,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,
        systemLogs,
        addSystemLog,
        activePage,
        setActivePage,
        theme,
        setTheme,
        toggleTheme,
        compactMode,
        setCompactMode: setCompactModeValue,
        toggleCompactMode,
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
