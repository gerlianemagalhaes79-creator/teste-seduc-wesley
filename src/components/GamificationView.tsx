import React from "react";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Star,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  Target,
  Scale,
  GraduationCap,
  Bot,
} from "lucide-react";
import { UserProfile, Achievement, DailyMission } from "../types";
import { LEVELS, SAMPLE_RANKING } from "../data/gamificationData";

interface GamificationViewProps {
  userProfile: UserProfile;
  achievements: Achievement[];
  missions: DailyMission[];
  onClaimMissionReward: (missionId: string) => void;
  isDarkMode?: boolean;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  userProfile,
  achievements,
  missions,
  onClaimMissionReward,
  isDarkMode = false,
}) => {
  const currentLevelInfo = LEVELS.find((l) => l.level === userProfile.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find((l) => l.level === userProfile.level + 1);

  const xpInLevel = Math.max(0, userProfile.xp - currentLevelInfo.minXp);
  const totalXpForLevel = nextLevelInfo ? nextLevelInfo.minXp - currentLevelInfo.minXp : 1000;
  const progressPercent = Math.min(100, Math.round((xpInLevel / Math.max(1, totalXpForLevel)) * 100));

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Target":
        return <Target className="w-6 h-6 text-emerald-500" />;
      case "Scale":
        return <Scale className="w-6 h-6 text-amber-500" />;
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6 text-blue-500" />;
      case "Flame":
        return <Flame className="w-6 h-6 text-orange-500" />;
      case "Trophy":
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case "Bot":
        return <Bot className="w-6 h-6 text-purple-500" />;
      default:
        return <Award className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Profile Status & Level Overview Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
              {userProfile.level}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-xs font-bold mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>Nível {userProfile.level} • {currentLevelInfo.title}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                {userProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {currentLevelInfo.perks}
              </p>
            </div>
          </div>

          <div className="space-y-2 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Progresso do Nível</span>
              <span className="text-emerald-500 font-mono">
                {userProfile.xp} / {nextLevelInfo ? nextLevelInfo.minXp : "MAX"} XP
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}>
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">
              {nextLevelInfo
                ? `Faltam ${nextLevelInfo.minXp - userProfile.xp} XP para ${nextLevelInfo.title}`
                : "Nível Máximo Atingido!"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ranking Estadual e Conquistas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: State-wide Simulated Ranking */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-5 sm:p-6 space-y-4 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold">Ranking Estadual SEDUC-CE</h2>
            </div>
            <span className="text-xs font-bold text-emerald-500">Sua Posição: 4º</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparativo de pontos de estudo entre candidatos de todas as CREDEs do Ceará.
          </p>

          <div className="space-y-2">
            {SAMPLE_RANKING.map((item) => (
              <div
                key={item.rank}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  item.isCurrentUser
                    ? "bg-emerald-600/15 border-emerald-500/50 shadow-sm"
                    : isDarkMode
                    ? "bg-slate-850 border-slate-750"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                      item.rank === 1
                        ? "bg-amber-400 text-slate-950"
                        : item.rank === 2
                        ? "bg-slate-300 text-slate-950"
                        : item.rank === 3
                        ? "bg-amber-700 text-white"
                        : isDarkMode
                        ? "bg-slate-750 text-slate-400"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.rank}
                  </span>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-black">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.specialty} • {item.city}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black font-mono text-emerald-500">{item.xp} XP</div>
                  <div className="text-[10px] text-slate-400">{item.accuracy}% acertos</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Badges & Achievements */}
        <div
          className={`lg:col-span-7 rounded-2xl border p-5 sm:p-6 space-y-4 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold">Galeria de Medalhas & Conquistas</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              {unlockedCount} / {achievements.length} Desbloqueadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  a.isUnlocked
                    ? isDarkMode
                      ? "bg-slate-850 border-slate-750"
                      : "bg-slate-50 border-slate-200"
                    : isDarkMode
                    ? "bg-slate-950/40 border-slate-800/80 opacity-50"
                    : "bg-slate-100/60 border-slate-200 opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    a.isUnlocked
                      ? isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-300"
                      : "bg-slate-800/40 border-slate-800 text-slate-600"
                  }`}
                >
                  {a.isUnlocked ? renderIcon(a.iconName) : <Lock className="w-4 h-4 text-slate-500" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{a.title}</span>
                    {a.isUnlocked && (
                      <span className="text-[10px] text-amber-500 font-bold">+{a.xpReward} XP</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {a.description}
                  </p>
                  {a.isUnlocked && a.unlockedAt && (
                    <div className="text-[9px] text-emerald-500 font-semibold pt-0.5">
                      ✓ Desbloqueada em {new Date(a.unlockedAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
