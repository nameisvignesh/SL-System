import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) return null;

  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstall}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#2D9CFF]/20 border border-[#2D9CFF]/50 text-[#2D9CFF] text-[10px] font-orbitron font-bold hover:bg-[#2D9CFF]/30 active:scale-95"
      >
        <Download className="w-3 h-3" /> INSTALL APP
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#2D9CFF]/15 border border-[#2D9CFF]/40 text-[#2D9CFF] text-[10px] font-orbitron font-semibold"
        >
          <Download className="w-3 h-3" /> INSTALL (iOS)
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-xs bg-[#091224] border border-[#2D9CFF]/50 p-5 shadow-2xl">
              <h3 className="text-xs font-orbitron font-bold text-[#2D9CFF] mb-2 uppercase">
                [ INSTALL ON IPHONE / IPAD ]
              </h3>
              <p className="text-xs font-rajdhani text-slate-300 leading-relaxed space-y-1">
                1. Tap the <strong className="text-white">Share</strong> icon in the Safari navigation bar.<br />
                2. Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.<br />
                3. Open "SYSTEM" from your home screen for the full fullscreen app experience.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2 rounded-xs bg-[#2D9CFF]/20 border border-[#2D9CFF]/50 text-xs font-orbitron text-[#2D9CFF] font-bold"
              >
                DISMISS
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
