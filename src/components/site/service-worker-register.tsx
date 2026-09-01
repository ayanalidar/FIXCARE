"use client";

import { useEffect } from "react";

/**
 * Registers the FixCare service worker on the client side.
 * - Only runs in production to avoid caching dev assets
 * - Handles update notifications (posts a message to refresh the app)
 * - Logs registration errors to console (no UI interruption)
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    // Skip SW registration in dev mode — Next.js HMR conflicts with SW caching
    if (process.env.NODE_ENV !== "production") return;

    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version ready — notify the app to show "Refresh" toast
              window.dispatchEvent(
                new CustomEvent("sw-update-available", {
                  detail: { version: "v1" },
                })
              );
            }
          });
        });

        // Listen for SW activation messages
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data?.type === "SW_ACTIVATED") {
            console.info(`[PWA] Service worker activated: ${event.data.version}`);
          }
        });

        // Listen for controller change (new SW took over)
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      } catch (err) {
        console.warn("[PWA] Service worker registration failed:", err);
      }
    };

    // Defer registration until after page load to avoid competing with first paint
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
