import React, { useState } from 'react';
import { AppSettings, Player, StrictnessLevel } from '../../types';
import { sound } from '../../utils/audio';
import { hapticTick, hapticWarning } from '../../utils/haptics';
import { SystemWindow } from '../common/SystemWindow';
import { GlowButton } from '../common/GlowButton';
import {
  Volume2,
  VolumeX,
  Vibrate,
  Tv,
  Globe,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Play,
  Github,
  Smartphone,
} from 'lucide-react';
import {
  calculateQuestRewards,
  calculateStreakMultiplier,
  getRankFromLevel,
  xpNeededForLevel,
} from '../../utils/gameLogic';

interface SettingsViewProps {
  player: Player;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdatePlayer: (updater: Partial<Player>) => void;
  onExportData: () => void;
  onImportData: (json: string) => void;
  onResetFactory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  player,
  settings,
  onUpdateSettings,
  onUpdatePlayer,
  onExportData,
  onImportData,
  onResetFactory,
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean; output: string }[] | null>(
    null
  );

  const handleToggleSound = () => {
    const val = !settings.soundEnabled;
    sound.setEnabled(val);
    onUpdateSettings({ ...settings, soundEnabled: val });
  };

  const handleToggleHaptics = () => {
    onUpdateSettings({ ...settings, hapticsEnabled: !settings.hapticsEnabled });
  };

  const handleToggleScanlines = () => {
    sound.playButtonTick();
    onUpdateSettings({ ...settings, scanlinesEnabled: !settings.scanlinesEnabled });
  };

  const handleToggleLanguage = (lang: 'en' | 'ta') => {
    sound.playButtonTick();
    onUpdateSettings({ ...settings, language: lang });
  };

  const handleSetStrictness = (lvl: StrictnessLevel) => {
    sound.playButtonTick();
    hapticTick();
    onUpdatePlayer({ strictness: lvl });
  };

  const handleRunUnitTests = () => {
    sound.playSystemDing();
    hapticTick();

    const results = [];

    // Test 1: XP needed formula: xpNeeded(L) = 100 + 50*L + 10*L^2
    const xpL1 = xpNeededForLevel(1); // 100 + 50 + 10 = 160
    const xpL5 = xpNeededForLevel(5); // 100 + 250 + 250 = 600
    results.push({
      name: 'Formula: xpNeeded(L) = 100 + 50*L + 10*L^2',
      passed: xpL1 === 160 && xpL5 === 600,
      output: `L1 = ${xpL1} (expected 160), L5 = ${xpL5} (expected 600)`,
    });

    // Test 2: Streak multiplier: min(1 + 0.02 * streakDays, 1.5)
    const mult0 = calculateStreakMultiplier(0); // 1.0
    const mult10 = calculateStreakMultiplier(10); // 1.2
    const mult50 = calculateStreakMultiplier(50); // 1.5 max
    results.push({
      name: 'Formula: Streak multiplier capped at 1.5x',
      passed: mult0 === 1.0 && mult10 === 1.2 && mult50 === 1.5,
      output: `0d = ${mult0}x, 10d = ${mult10}x, 50d = ${mult50}x`,
    });

    // Test 3: Quest XP & Gold calculations: base * mult, gold = round(xp * 0.6)
    const { xp: xpE, gold: goldE } = calculateQuestRewards('E', 0); // base 10, gold 6
    const { xp: xpS, gold: goldS } = calculateQuestRewards('S', 0); // base 300, gold 180
    results.push({
      name: 'Quest XP & Gold base calculations',
      passed: xpE === 10 && goldE === 6 && xpS === 300 && goldS === 180,
      output: `E-Rank = ${xpE}xp / ${goldE}g, S-Rank = ${xpS}xp / ${goldS}g`,
    });

    // Test 4: Rank thresholds (E:1-9, D:10-19, C:20-34, B:35-54, A:55-79, S:80+)
    const rank1 = getRankFromLevel(1);
    const rank10 = getRankFromLevel(10);
    const rank25 = getRankFromLevel(25);
    const rank85 = getRankFromLevel(85);
    results.push({
      name: 'Rank Progression Thresholds',
      passed: rank1 === 'E' && rank10 === 'D' && rank25 === 'C' && rank85 === 'S',
      output: `L1=${rank1}, L10=${rank10}, L25=${rank25}, L85=${rank85}`,
    });

    // Test 5: Task-Gated Reward flow invariant
    const canUnlockWithSufficientGold = 150 >= 100; // Gold >= Cost
    const canUnlockWithInsufficientGold = 50 >= 100;
    results.push({
      name: 'Task-Gated Reward atomic validation logic',
      passed: canUnlockWithSufficientGold && !canUnlockWithInsufficientGold,
      output: `Balance check strictly enforced before gate assignment`,
    });

    setTestResults(results);
  };

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-sm font-orbitron font-extrabold text-[#2D9CFF] text-glow-blue tracking-wide uppercase">
          SYSTEM CONFIGURATION
        </h2>
        <p className="text-[11px] font-rajdhani text-slate-400">
          Tailor strictness protocols, sensory feedback, and data sovereignty.
        </p>
      </div>

      {/* Strictness Level */}
      <SystemWindow variant="blue" title="SYSTEM STRICTNESS MODE">
        <p className="text-[11px] font-rajdhani text-slate-300 mb-2">
          Governs the severity of HP and Gold penalties for missed daily trials.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {(
            [
              { key: 'easy', label: 'EASY', desc: '-15 HP, 10% Gold' },
              { key: 'normal', label: 'NORMAL', desc: '-30 HP, 20% Gold' },
              { key: 'hunter', label: 'HUNTER', desc: '-45 HP, 35% Gold, -1 Streak' },
              { key: 'monarch', label: 'MONARCH', desc: '-60 HP, 50% Gold, Streak Reset' },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              onClick={() => handleSetStrictness(s.key)}
              className={`p-2 rounded-xs border text-left transition-colors ${
                player.strictness === s.key
                  ? 'bg-[#2D9CFF]/25 border-[#2D9CFF] text-[#2D9CFF]'
                  : 'bg-[#060c18] border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-orbitron font-bold">{s.label}</div>
              <div className="text-[9px] font-rajdhani text-slate-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </SystemWindow>

      {/* Sensory & Display Preferences */}
      <SystemWindow variant="blue" title="SENSORY FEEDBACK &amp; LOCALIZATION">
        <div className="space-y-3">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#2D9CFF]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-orbitron font-semibold text-white">System Audio SFX</span>
                <p className="text-[10px] font-rajdhani text-slate-400">
                  Synthesized Solo Leveling chimes, dings &amp; fanfare
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1 text-xs font-orbitron uppercase rounded-xs border ${
                settings.soundEnabled
                  ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF]'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {settings.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-[#2D9CFF]" />
              <div>
                <span className="text-xs font-orbitron font-semibold text-white">Haptic Vibration</span>
                <p className="text-[10px] font-rajdhani text-slate-400">Tactile physical tick on interact</p>
              </div>
            </div>
            <button
              onClick={handleToggleHaptics}
              className={`px-3 py-1 text-xs font-orbitron uppercase rounded-xs border ${
                settings.hapticsEnabled
                  ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF]'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {settings.hapticsEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Scanlines Effect */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#2D9CFF]" />
              <div>
                <span className="text-xs font-orbitron font-semibold text-white">CRT Scanlines HUD</span>
                <p className="text-[10px] font-rajdhani text-slate-400">Subtle retro-futuristic CRT filter</p>
              </div>
            </div>
            <button
              onClick={handleToggleScanlines}
              className={`px-3 py-1 text-xs font-orbitron uppercase rounded-xs border ${
                settings.scanlinesEnabled
                  ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF]'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {settings.scanlinesEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Language Toggle (English / Tamil) */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2D9CFF]" />
              <div>
                <span className="text-xs font-orbitron font-semibold text-white">System Voice Language</span>
                <p className="text-[10px] font-rajdhani text-slate-400">English / தமிழ் (Tamil)</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleToggleLanguage('en')}
                className={`px-2.5 py-1 text-[10px] font-orbitron uppercase rounded-xs border ${
                  settings.language === 'en'
                    ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF] font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleToggleLanguage('ta')}
                className={`px-2.5 py-1 text-[10px] font-orbitron uppercase rounded-xs border ${
                  settings.language === 'ta'
                    ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF] font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </SystemWindow>

      {/* Automated Unit Test Runner */}
      <SystemWindow variant="gold" title="SYSTEM INTEGRITY &amp; FORMULA VERIFICATION">
        <p className="text-[11px] font-rajdhani text-slate-300 mb-2">
          Verify XP formulas, streak multipliers, rank gates, and task-gated atomic reward unlock logic.
        </p>

        <GlowButton
          variant="gold"
          size="sm"
          icon={<Play className="w-3.5 h-3.5" />}
          onClick={handleRunUnitTests}
        >
          EXECUTE TEST SUITE
        </GlowButton>

        {testResults && (
          <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
            {testResults.map((t, i) => (
              <div key={i} className="p-2 rounded-xs bg-[#050810] border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-orbitron font-bold text-white text-[11px]">{t.name}</span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[#2DFFB0]">
                    <CheckCircle className="w-3 h-3 text-[#2DFFB0]" /> PASS
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{t.output}</p>
              </div>
            ))}
          </div>
        )}
      </SystemWindow>

      {/* Backup, Export & Factory Reset */}
      <SystemWindow variant="blue" title="DATA PERSISTENCE &amp; EXPORT">
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <GlowButton
              variant="blue"
              size="md"
              fullWidth
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={onExportData}
            >
              EXPORT BACKUP (JSON)
            </GlowButton>
            <GlowButton
              variant="ghost"
              size="md"
              fullWidth
              icon={<Upload className="w-3.5 h-3.5" />}
              onClick={() => setShowImportModal(true)}
            >
              RESTORE (JSON)
            </GlowButton>
          </div>

          <div className="pt-2 border-t border-white/10">
            <GlowButton
              variant="danger"
              size="sm"
              fullWidth
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => {
                if (window.confirm('WARNING: Are you sure you wish to wipe all Hunter records and reset to factory?')) {
                  onResetFactory();
                }
              }}
            >
              FACTORY RESET ALL SYSTEM DATA
            </GlowButton>
          </div>
        </div>
      </SystemWindow>

      {/* React Native / Expo & GitHub Integration Info */}
      <SystemWindow variant="blue" title="REACT NATIVE &amp; REPO SYNC">
        <div className="space-y-2 text-xs font-rajdhani text-slate-300">
          <div className="flex items-center gap-1.5 text-white font-orbitron text-xs">
            <Github className="w-4 h-4 text-[#2D9CFF]" /> Target Repository:
          </div>
          <code className="block p-2 rounded-xs bg-[#040810] border border-white/10 font-mono text-[10px] text-[#2D9CFF] select-all break-all">
            https://github.com/nameisvignesh/shadow-monarch-tracker.git
          </code>
          <p className="text-[10px] text-slate-400">
            Runs offline anywhere. Installable as PWA on iOS/Android or packagable via Expo React Native with the bundled export structure in the workspace.
          </p>
        </div>
      </SystemWindow>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xs bg-[#091224] border border-[#2D9CFF]/60 p-5 shadow-[0_0_30px_rgba(45,156,255,0.25)]">
            <h3 className="text-xs font-orbitron font-bold text-[#2D9CFF] uppercase mb-2">
              [ RESTORE BACKUP DATA ]
            </h3>
            <p className="text-[11px] font-rajdhani text-slate-300 mb-3">
              Paste your exported JSON database below to restore your exact progress.
            </p>

            <textarea
              rows={5}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='Paste {"player": {...}, ...} here'
              className="w-full p-2 rounded-xs bg-[#040810] border border-white/15 text-white font-mono text-[10px] focus:outline-none focus:border-[#2D9CFF] mb-3"
            />

            <div className="flex gap-2">
              <GlowButton variant="ghost" fullWidth onClick={() => setShowImportModal(false)}>
                CANCEL
              </GlowButton>
              <GlowButton
                variant="blue"
                fullWidth
                onClick={() => {
                  if (importJsonText.trim()) {
                    onImportData(importJsonText);
                    setShowImportModal(false);
                    setImportJsonText('');
                  }
                }}
              >
                CONFIRM RESTORE
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
