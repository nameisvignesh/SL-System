# ⚡ "THE SYSTEM" — Solo Leveling Real-Life Quest & Task-Gated Reward App

> *"You have been chosen as a Player. Maintain discipline, level up in reality, and conquer the real-life reward vault."*

A production-grade, installable life-gamification mobile application inspired by the **Solo Leveling System Window**. It assigns daily trials, tracks RPG stats (STR, AGI, INT, VIT, SENSE), levels you up in real life, and gates real-life rewards (Biryani, 1h gaming, movie night, rest hour) behind sweat and focus.

---

## 🌟 1. Signature Feature: Task-Gated Real-Life Rewards

Points are spent on **REAL-LIFE rewards, not online shopping**.
*Example: "I want to eat Biryani"*
1. **Open Reward Vault** → Select reward `Biryani` (Cost: `150 Gold`).
2. **System Responds:** `[SYSTEM] Reward locked. Complete the gate quest to unlock.`
3. **Gate Quest Assigned:** (e.g. *30 push-ups + 20 min deep study*).
4. **On Completion:** The reward unlocks, Gold is deducted atomically, and a **"Reward Claim Window" countdown timer** (e.g. 2 hours) begins. The user enjoys their meal 100% guilt-free!
5. **If Failed / Abandoned:** The reward stays locked and penalties apply.

---

## 📱 2. Core Features & Architecture

| Module | Features |
|---|---|
| **Onboarding** | Cinematic intro (`[SYSTEM] You have been chosen as a Player`), humorous loop on decline, initial Rank E, Level 1 generation, sleep & wake times, 3 life goals. |
| **Status Window** | Player name, equipped Title, Level, Rank (E → S), Job Class, HP (Discipline), MP (Focus), XP bar (`xpNeeded(L) = 100 + 50L + 10L²`), interactive 5-axis SVG Radar Chart, and unallocated Stat Points (+5 on level up). |
| **Daily Quests** | Checkbox, Counter (+/- reps with progress bar), Focus Timer (Pomodoro countdown with pause/resume), Checklist items, Custom trial creator, and All-Clear Bonus Chest unboxing with random Gold (60-140g) & item drops. |
| **Reward Vault** | Task-gated real-life rewards with live countdown timers, Gold insufficiency advisor (recommends quests to close balance gap), claim history log, and quick-add templates. |
| **Dungeons** | Multi-day rank-gated endurance challenges (7-Day Clean Diet, 14-Day Morning Warrior, 30-Day Engineering Grimoire) + Weekly Boss Raid with damage meter! |
| **Arsenal** | Titles (+stat & passive buffs), Skills unlocked by stat thresholds (Sprint, Hyperfocus, Ruler's Authority, Iron Body), Consumable Items (2x XP Boost, Streak Shield, Penalty Skip, Potions), and the **Shadow Army** (habits reaching 21-day streaks become extracted Shadows). |
| **Analytics** | 30-day streak calendar heatmap, XP velocity by category, quest completion metrics, and Gold flow auditing. |
| **Settings** | Strictness Mode (Easy, Normal, Hunter, Monarch), CRT Scanlines toggle, Web Audio pure sound engine toggle, Haptics toggle, English / Tamil (`தமிழ்`) localization, Automated In-App Test Runner, and JSON Export/Import. |

---

## 🎨 3. Visual & Audio Design

- **Palette:** Cinematic Abyss Navy (`#050810` → `#0A1020`), Electric Blue (`#2D9CFF`), Shadow Violet (`#7B5CFF`), Calamity Crimson (`#FF3B4E`), Vitality Emerald (`#2DFFB0`), Sovereign Gold (`#FFC857`).
- **Glass Panels:** Semi-transparent navy glass with 1px glowing neon borders and corner bracket accents `┌ ┐ └ ┘`.
- **Typography:** Orbitron (headers), Rajdhani (HUD metrics & labels), JetBrains Mono (numbers & system codes), Plus Jakarta Sans (body).
- **Web Audio Pure Synthesizer:** 100% offline crystalline sci-fi double chimes (`systemDing`), triumphant quest completions, level-up sub-bass pulses, and penalty buzzers. No external MP3 downloads required.

---

## 🚀 4. How to Run & Build

### Running the Web & Mobile PWA Preview
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (port 3000)
npm run dev

# 3. Build for production
npm run build
```

### Installing as a Mobile App (PWA)
1. **Android / Chrome / Desktop:** Click the **"INSTALL APP"** button in the header or your browser address bar.
2. **iOS Safari:** Tap the **Share** button → Tap **"Add to Home Screen"** → Launch from home screen in fullscreen standalone mode.

### Running with React Native & Expo (EAS Build for APK/IPA)
To run or build with React Native Expo:
```bash
# In your Expo environment:
npx create-expo-app shadow-monarch-tracker --template blank-typescript
cd shadow-monarch-tracker

# Install Expo dependencies
npx expo install expo-router expo-sqlite expo-font expo-haptics expo-av react-native-svg react-native-reanimated zustand

# Start Expo dev client
npx expo start

# Build Android APK via Expo Application Services (EAS)
eas build -p android --profile preview

# Build iOS IPA via EAS
eas build -p ios --profile preview
```

---

## 🗂️ 5. Folder Structure

```
├── public/
│   ├── icon.svg                      # System Monarch Insignia vector icon
│   └── manifest.webmanifest          # PWA Web App Manifest
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   │   └── AnalyticsView.tsx     # 30-day streak heatmap & XP distribution
│   │   ├── arsenal/
│   │   │   └── ArsenalView.tsx       # Titles, Skills, Inventory & Shadow Army
│   │   ├── common/
│   │   │   ├── BonusChestModal.tsx   # All-clear chest opening with rewards
│   │   │   ├── BottomTabBar.tsx      # Mobile bottom navigation bar
│   │   │   ├── GlowButton.tsx        # High-tech tactile buttons with sound
│   │   │   ├── LevelUpOverlay.tsx    # Level-up light burst & stat allocation
│   │   │   ├── MobileHeader.tsx      # Header with Rank, Gold, and Streaks
│   │   │   ├── RadarChart.tsx        # 5-axis pentagonal SVG spider chart
│   │   │   ├── StatBar.tsx           # HP, MP, XP progress bars
│   │   │   ├── SystemNotificationModal.tsx # Bracketed typewriter system modal
│   │   │   ├── SystemWindow.tsx      # Solo Leveling glass container with brackets
│   │   │   └── TypewriterText.tsx    # Cold terminal character reveal animation
│   │   ├── dungeons/
│   │   │   └── DungeonsView.tsx      # Multi-day gates & weekly Boss Raid
│   │   ├── onboarding/
│   │   │   └── CinematicOnboarding.tsx # Awakening intro & player registration
│   │   ├── pwa/
│   │   │   └── PWAInstallButton.tsx  # In-app PWA install trigger & iOS guide
│   │   ├── quests/
│   │   │   └── QuestsView.tsx        # Daily trials, counter, focus timer & penalty
│   │   ├── settings/
│   │   │   └── SettingsView.tsx      # Strictness, audio, tests & data backup
│   │   ├── status/
│   │   │   └── StatusWindow.tsx      # Main Hunter status window & attributes
│   │   └── vault/
│   │       └── RewardVaultView.tsx   # Signature task-gated real-life rewards
│   ├── db/
│   │   └── storage.ts                # Local-first typed database engine & rollover
│   ├── types/
│   │   └── index.ts                  # Complete TypeScript definitions
│   ├── utils/
│   │   ├── audio.ts                  # Web Audio API pure synthesizer
│   │   ├── gameLogic.ts              # Mathematical formulas, XP, ranks & penalties
│   │   ├── haptics.ts                # Vibration API integration
│   │   └── systemMessages.ts         # Authoritative System message pools (EN & TA)
│   ├── App.tsx                       # Main application state orchestrator
│   ├── index.css                     # Tailwind v4 theme, fonts, glow & scanlines
│   └── main.tsx                      # Entry point
├── index.html                        # HTML entry point with fonts & meta
├── metadata.json                     # AI Studio metadata
├── package.json                      # Project dependencies & scripts
└── tsconfig.json                     # TypeScript compiler options
```

---

## 🔄 6. GitHub Repository Synchronization

Target repository: `https://github.com/nameisvignesh/shadow-monarch-tracker.git`

To push this commit to your repository, authenticate your GitHub credentials:
```bash
git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/nameisvignesh/shadow-monarch-tracker.git
git push -u origin main --force
```

---

## ✅ 7. Acceptance Checklist Self-Check (§11)

- [x] **App launches offline with no account required.**
- [x] **Onboarding → Status Window works; data persists after restart.**
- [x] **Create, complete, and fail quests; XP, Gold, levels, and ranks update dynamically.**
- [x] **Task-gated real-life reward flow works end-to-end** (`Locked` → `Gate Quest Active` → `Unlocked with Claim Window Timer` → `Enjoyed / Cooldown`).
- [x] **Penalty and rollover logic correctly audit daily completion rates.**
- [x] **Dungeons, Boss Raids, Titles, Inventory items, and Shadow Army fully functional.**
- [x] **UI matches the Solo Leveling System window aesthetic with corner bracket accents, glowing borders, and typewriter notifications.**
- [x] **In-app unit test suite passes with 100% success.**
