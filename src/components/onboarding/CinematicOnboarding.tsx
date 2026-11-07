import React, { useState } from 'react';
import { Player, StrictnessLevel } from '../../types';
import { sound } from '../../utils/audio';
import { hapticLevelUp, hapticTick, hapticWarning } from '../../utils/haptics';
import { GlowButton } from '../common/GlowButton';
import { TypewriterText } from '../common/TypewriterText';
import { Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';

interface CinematicOnboardingProps {
  onComplete: (player: Player) => void;
}

export const CinematicOnboarding: React.FC<CinematicOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'invitation' | 'setup'>('invitation');
  const [declineCount, setDeclineCount] = useState(0);

  // Setup form states
  const [name, setName] = useState('Sung Jin-Woo');
  const [jobClass, setJobClass] = useState('Shadow Monarch');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [goal1, setGoal1] = useState('Forge peak physical strength & daily fitness');
  const [goal2, setGoal2] = useState('Deep mastery of software engineering & focus');
  const [goal3, setGoal3] = useState('Eliminate mindless dopamine & build discipline');
  const [strictness, setStrictness] = useState<StrictnessLevel>('normal');

  const humorousDeclineMessages = [
    'Refusal rejected. The System does not negotiate with mortals.',
    'You lack the administrative authority to decline the Awakening.',
    'Comfort is an illusion. Your excuses have been archived and disregarded.',
    'Are you prepared to remain an ordinary NPC forever? Accept the trial.',
    'Warning: Heart rate elevated. The System has already integrated with your consciousness.',
  ];

  const handleDecline = () => {
    sound.playWarning();
    hapticWarning();
    setDeclineCount((prev) => prev + 1);
  };

  const handleAccept = () => {
    sound.playSystemDing();
    hapticTick();
    setStep('setup');
  };

  const handleFinishSetup = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLevelUp();
    hapticLevelUp();

    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: name.trim() || 'Player',
      title: 'The Awakened',
      jobClass: jobClass.trim() || 'Shadow Monarch',
      level: 1,
      rank: 'E',
      currentXp: 0,
      gold: 150, // Starting Gold for first reward unlock
      hp: 100,
      maxHp: 100,
      mp: 100,
      maxMp: 100,
      statPoints: 5,
      stats: {
        str: 10,
        agi: 10,
        int: 10,
        vit: 10,
        sense: 10,
      },
      streakDays: 1,
      bestStreak: 1,
      wakeTime,
      sleepTime,
      goals: [goal1, goal2, goal3].filter(Boolean),
      focusAreas: ['Fitness', 'Engineering', 'Discipline'],
      strictness,
      penaltiesActive: true,
      isPenalized: false,
      lastActiveDate: new Date().toISOString().split('T')[0],
      equippedTitleId: 'title_awakened',
      createdAt: new Date().toISOString(),
    };

    onComplete(newPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060c] text-slate-100 overflow-y-auto">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,156,255,0.12)_0%,transparent_70%)] pointer-events-none" />

      {step === 'invitation' ? (
        <div className="relative w-full max-w-sm rounded-xs bg-[#070e1c] border border-[#2D9CFF]/50 p-6 shadow-[0_0_40px_rgba(45,156,255,0.25)] text-center animate-in zoom-in-95 duration-300">
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#2D9CFF]" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#2D9CFF]" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#2D9CFF]" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#2D9CFF]" />

          <div className="w-12 h-12 mx-auto rounded-xs bg-[#2D9CFF]/15 border border-[#2D9CFF]/40 flex items-center justify-center mb-4 text-[#2D9CFF] shadow-[0_0_20px_rgba(45,156,255,0.3)]">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>

          <h1 className="text-xs font-orbitron font-bold text-[#2D9CFF] tracking-widest uppercase mb-1">
            [ SYSTEM DIRECTIVE ]
          </h1>
          <h2 className="text-lg font-orbitron font-extrabold text-white text-glow-blue tracking-wide mb-3">
            YOU HAVE BEEN CHOSEN AS A PLAYER.
          </h2>

          <div className="my-5 min-h-[50px] text-xs font-rajdhani text-slate-300 leading-relaxed px-2">
            {declineCount === 0 ? (
              <TypewriterText
                text="The qualification to become a Player has been granted. Complete daily real-life trials, earn XP, and unlock real-life rewards."
                speed={15}
              />
            ) : (
              <p className="text-[#FF3B4E] font-medium animate-in fade-in">
                [SYSTEM REJECTION] {humorousDeclineMessages[(declineCount - 1) % humorousDeclineMessages.length]}
              </p>
            )}
          </div>

          <div className="space-y-2.5 mt-6">
            <GlowButton variant="blue" size="lg" fullWidth onClick={handleAccept}>
              ACCEPT THE AWAKENING
            </GlowButton>
            <button
              onClick={handleDecline}
              className="text-[11px] font-rajdhani text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider py-1 block w-full"
            >
              DECLINE INVITATION
            </button>
          </div>
        </div>
      ) : (
        /* Setup Form */
        <div className="relative w-full max-w-md rounded-xs bg-[#070e1c] border border-[#2D9CFF]/50 p-5 shadow-[0_0_40px_rgba(45,156,255,0.25)] animate-in fade-in duration-300 my-8">
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#2D9CFF]" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#2D9CFF]" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#2D9CFF]" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#2D9CFF]" />

          <div className="text-center mb-4">
            <span className="text-[10px] font-orbitron font-bold text-[#2DFFB0] tracking-widest uppercase">
              [ INITIALIZATION PROTOCOL ]
            </span>
            <h2 className="text-base font-orbitron font-bold text-white text-glow-blue mt-0.5">
              REGISTER HUNTER DOSSIER
            </h2>
          </div>

          <form onSubmit={handleFinishSetup} className="space-y-3.5 text-xs font-rajdhani">
            {/* Name & Class */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-orbitron font-semibold text-slate-400 mb-1">
                  HUNTER NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-[#2D9CFF]/40 text-white font-mono text-xs focus:outline-none focus:border-[#2D9CFF]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-orbitron font-semibold text-slate-400 mb-1">
                  JOB / FOCUS
                </label>
                <select
                  value={jobClass}
                  onChange={(e) => setJobClass(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-[#2D9CFF]/40 text-white font-rajdhani text-xs focus:outline-none focus:border-[#2D9CFF]"
                >
                  <option value="Shadow Monarch">Shadow Monarch (Balanced Master)</option>
                  <option value="Scholar / Code Weaver">Scholar / Code Weaver (INT Focus)</option>
                  <option value="Iron Berserker">Iron Berserker (STR / VIT Focus)</option>
                  <option value="Mindful Hunter">Mindful Hunter (SENSE / Discipline)</option>
                </select>
              </div>
            </div>

            {/* Wake & Sleep Times */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-orbitron font-semibold text-slate-400 mb-1">
                  WAKE-UP TIME
                </label>
                <input
                  type="time"
                  required
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-[#2D9CFF]/40 text-white font-mono text-xs focus:outline-none focus:border-[#2D9CFF]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-orbitron font-semibold text-slate-400 mb-1">
                  SLEEP ROLLOVER TIME
                </label>
                <input
                  type="time"
                  required
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-[#2D9CFF]/40 text-white font-mono text-xs focus:outline-none focus:border-[#2D9CFF]"
                />
              </div>
            </div>

            {/* Strictness Level */}
            <div>
              <label className="block text-[10px] font-orbitron font-semibold text-slate-400 mb-1">
                SYSTEM STRICTNESS LEVEL
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['easy', 'normal', 'hunter', 'monarch'] as StrictnessLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStrictness(lvl)}
                    className={`py-1.5 px-1 rounded-xs border text-[10px] font-orbitron uppercase tracking-wider text-center transition-colors ${
                      strictness === lvl
                        ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF] font-bold'
                        : 'bg-[#040812] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Life Goals */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-orbitron font-semibold text-slate-400">
                3 CORE LIFE OBJECTIVES
              </label>
              <input
                type="text"
                placeholder="Goal 1: Fitness / Physical"
                value={goal1}
                onChange={(e) => setGoal1(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-white/15 text-slate-200 text-xs focus:outline-none focus:border-[#2D9CFF]"
              />
              <input
                type="text"
                placeholder="Goal 2: Study / Career"
                value={goal2}
                onChange={(e) => setGoal2(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-white/15 text-slate-200 text-xs focus:outline-none focus:border-[#2D9CFF]"
              />
              <input
                type="text"
                placeholder="Goal 3: Discipline / Mental"
                value={goal3}
                onChange={(e) => setGoal3(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs bg-[#040812] border border-white/15 text-slate-200 text-xs focus:outline-none focus:border-[#2D9CFF]"
              />
            </div>

            <div className="pt-2">
              <GlowButton variant="blue" size="lg" fullWidth type="submit">
                COMMENCE AWAKENING PROTOCOL <ArrowRight className="w-4 h-4 ml-1 inline" />
              </GlowButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
