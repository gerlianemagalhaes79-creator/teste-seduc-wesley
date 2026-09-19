import React from "react";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  HelpCircle,
  FileText,
  Bot,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  ChevronDown,
  Clock,
  Search,
  Sun,
  Moon,
  Cloud,
  RefreshCw,
} from "lucide-react";
import { UserProfile, SpecialtyId } from "../types";
import { SPECIALTIES } from "../data/specialties";
import { LEVELS } from "../data/gamificationData";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenSpecialtyModal: () => void;
  daysUntilExam: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearchModal: () => void;
  cloudSyncStatus?: "synced" | "syncing" | "offline";
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSpecialtyModal,
  daysUntilExam,
  isDarkMode,
  onToggleDarkMode,
  onOpenSearchModal,
  cloudSyncStatus = "synced",
}) => {
  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];
  const currentLevelInfo = LEVELS.find((l) => l.level === userProfile.level) || LEVELS[0];

  // Calculate XP progress in current level
  const xpInLevel = Math.max(0, userProfile.xp - currentLevelInfo.minXp);
  const totalXpForLevel = Math.max(1, currentLevelInfo.maxXp - currentLevelInfo.minXp);
  const progressPercent = Math.min(100, Math.round((xpInLevel / totalXpForLevel) * 100));

  const navItems = [
    { id: "dashboard", label: "Visão Geral", icon: Zap },
    { id: "cronograma", label: "Cronograma", icon: Calendar },
    { id: "simulados", label: "Simulados FUNECE", icon: HelpCircle },
    { id: "materiais", label: "Materiais & PDF", icon: FileText },
    { id: "mentor", label: "Mentor FUNECE IA", icon: Bot, highlight: true },
    { id: "datas", label: "Datas & Fases", icon: Clock },
    { id: "gamificacao", label: "Conquistas & Ranking", icon: Trophy },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md shadow-sm ${
        isDarkMode
          ? "bg-slate-900/95 border-slate-800 text-white"
          : "bg-white/95 border-slate-200 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Specialty Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
              title="Voltar à Visão Geral"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className={`font-black text-base tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    SEDUC CEARÁ
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded">
                    FUNECE
                  </span>
                </div>
                <p className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Plataforma do Professor Pleno
                </p>
              </div>
            </button>

            {/* Specialty Switcher Dropdown Button */}
            <button
              onClick={onOpenSpecialtyModal}
              className={`ml-1 sm:ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:outline-none ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200"
                  : "bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-800"
              }`}
              title="Clique para trocar sua especialidade ou metas de estudo"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[100px] sm:max-w-[140px]">{currentSpecialty.name}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Center/Right Actions: Global Search, Theme Switcher, Countdown, Streak, XP */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearchModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isDarkMode
                  ? "bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600"
              }`}
              title="Busca rápida no edital (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Buscar no edital...</span>
              <kbd
                className={`hidden md:inline px-1.5 py-0.2 text-[9px] font-mono rounded border uppercase ${
                  isDarkMode ? "bg-slate-900 border-slate-700 text-slate-400" : "bg-white border-slate-300 text-slate-500"
                }`}
              >
                Ctrl+K
              </kbd>
            </button>

            {/* Cloud Sync Status Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
                cloudSyncStatus === "syncing"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300"
                  : cloudSyncStatus === "offline"
                  ? "bg-slate-500/10 border-slate-500/30 text-slate-500"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              }`}
              title={
                cloudSyncStatus === "syncing"
                  ? "Sincronizando com Firebase Firestore..."
                  : cloudSyncStatus === "offline"
                  ? "Modo Local Offline"
                  : "Nuvem Firebase Firestore: Dados Sincronizados com Segurança"
              }
            >
              {cloudSyncStatus === "syncing" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span className="hidden xl:inline text-[11px]">
                {cloudSyncStatus === "syncing" ? "Salvando Nuvem..." : "Firestore Conectado"}
              </span>
            </div>

            {/* Countdown Badge */}
            <button
              onClick={() => setActiveTab("datas")}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors"
              title="Data da Prova Objetiva: 22 de Novembro de 2026"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{daysUntilExam > 0 ? `${daysUntilExam} dias para a prova` : "Prova Próxima!"}</span>
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-300 text-xs font-bold"
              title={`Ofensiva de estudos: ${userProfile.streak} dias consecutivos!`}
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{userProfile.streak}d</span>
            </div>

            {/* Level & XP Capsule */}
            <button
              onClick={() => setActiveTab("gamificacao")}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700/80 border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300"
              }`}
              title={`Nível ${userProfile.level}: ${currentLevelInfo.title} (${userProfile.xp} XP)`}
            >
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 text-xs font-black">
                {userProfile.level}
              </div>
              <div className="hidden xl:block">
                <div className={`flex items-center justify-between text-[11px] leading-tight font-semibold gap-2 ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  <span>{userProfile.xp} XP</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
                </div>
                <div className={`w-16 h-1.5 rounded-full mt-1 overflow-hidden ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-300"
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg border transition-colors focus:outline-none ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-yellow-400"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
              }`}
              title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav
          className={`flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t ${
            isDarkMode ? "border-slate-800/80" : "border-slate-200"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : item.highlight
                    ? isDarkMode
                      ? "text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 font-bold"
                      : "text-emerald-700 hover:bg-emerald-50 font-bold"
                    : isDarkMode
                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-white"
                      : item.highlight
                      ? isDarkMode
                        ? "text-emerald-400"
                        : "text-emerald-700"
                      : isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
