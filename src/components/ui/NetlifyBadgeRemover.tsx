"use client";

import { useEffect } from "react";

export const NetlifyBadgeRemover: React.FC = () => {
  useEffect(() => {
    const purgeNetlify = () => {
      // 1. Remove all iframes (VeriSpec uses zero iframes, so any iframe is injected)
      document.querySelectorAll("iframe").forEach((frame) => {
        try {
          frame.remove();
        } catch {
          frame.style.display = "none";
          frame.style.visibility = "hidden";
        }
      });

      // 2. Remove any Netlify custom elements or containers
      const netlifySelectors = [
        "#netlify-preview-drawer",
        "[data-netlify-deploy-preview]",
        ".netlify-identity-widget",
        "[id*='netlify' i]",
        "[class*='netlify' i]",
        "[aria-label*='netlify' i]",
        "a[href*='netlify' i]",
        "netlify-badge",
      ];

      netlifySelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          try {
            el.remove();
          } catch {
            (el as HTMLElement).style.display = "none";
          }
        });
      });

      // 3. Scan for any fixed bottom-right container that contains "Powered by Netlify" or "Netlify"
      document.querySelectorAll("div, span, p, a, section, aside").forEach((el) => {
        const text = el.textContent || "";
        if (
          text.includes("Powered by Netlify") ||
          (text.includes("Netlify") && (el.className.toString().includes("badge") || el.className.toString().includes("pill") || el.className.toString().includes("drawer")))
        ) {
          // If this is the badge or its wrapper, remove it
          const host = el.closest("div[style*='position: fixed'], div[style*='position:fixed'], div.fixed, [class*='netlify']") || el;
          try {
            host.remove();
          } catch {
            (host as HTMLElement).style.display = "none";
          }
        }
      });
    };

    purgeNetlify();

    // Continually observe DOM mutations to instantly eradicate dynamically injected Netlify elements
    const observer = new MutationObserver(() => {
      purgeNetlify();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Also run after window load and timeout
    window.addEventListener("load", purgeNetlify);
    const timer1 = setTimeout(purgeNetlify, 500);
    const timer2 = setTimeout(purgeNetlify, 1500);
    const timer3 = setTimeout(purgeNetlify, 3000);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", purgeNetlify);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return null;
};
