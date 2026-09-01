"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * PWA Install Prompt - captures the beforeinstallprompt event and shows a
 * custom "Add FixCare to your phone" banner when the user has been on the
 * site for ~30 seconds (or clicks an "Install app" button).
 *
 * Detection of install state:
 *  - beforeinstallprompt event → app is installable
 *  - appinstalled event → user installed it
 *  - display-mode: standalone → app is already installed (hide banner entirely)
 *
 * Persistence:
 *  - "fixcare-pwa-install-dismissed" in localStorage - user clicked "Not now"
 *  - Dismissed banner re-appears after 14 days
 */
const DISMISS_KEY = "fixcare-pwa-install-dismissed";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// Compute install state on the client once, before mount, to avoid
// setState-in-effect lint warnings.
function getInitialInstallState(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  if (isIOSStandalone) return true;
  return false;
}

function isRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (!dismissedAt) return false;
    return Date.now() - parseInt(dismissedAt, 10) < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export function PWAInstallPrompt() {
  // Compute the initial state lazily so we don't trigger setState in an effect
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(getInitialInstallState);

  useEffect(() => {
    if (isInstalled) return;
    if (isRecentlyDismissed()) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the banner after 30 seconds on the site (don't be pushy on landing)
      const timer = setTimeout(() => setShowBanner(true), 30_000);
      return () => clearTimeout(timer);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(DISMISS_KEY);
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS Safari doesn't fire beforeinstallprompt - show iOS instructions
      setShowBanner(false);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    } else {
      // User declined - dismiss for 14 days
      dismiss();
    }
  };

  const dismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  };

  if (isInstalled || !showBanner) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

  return (
    <div
      className="fixed bottom-20 right-4 left-4 z-[60] mx-auto max-w-sm sm:left-auto sm:bottom-4 sm:right-4"
      role="dialog"
      aria-labelledby="pwa-install-title"
    >
      <Card className="border-primary/20 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Smartphone className="size-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 id="pwa-install-title" className="text-sm font-semibold text-primary">
                Install FixCare App
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Get instant access to booking, service details, and offline support - right from your home screen.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="bg-accent text-white hover:bg-accent/90"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={dismiss}
                  className="text-muted-foreground hover:text-primary"
                >
                  Not now
                </Button>
              </div>
              {isIOS && !deferredPrompt && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  iOS: tap Share → Add to Home Screen
                </p>
              )}
            </div>
            <button
              onClick={dismiss}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
