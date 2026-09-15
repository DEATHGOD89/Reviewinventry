"use client";

import { useEffect } from "react";

export const NetlifyBadgeRemover: React.FC = () => {
  useEffect(() => {
    const purgeNetlify = () => {
      const selectors = [
        "#netlify-preview-drawer",
        "iframe#netlify-drawer",
        "iframe[src*='netlify']",
        "[data-netlify-deploy-preview]",
        ".netlify-identity-widget",
        "[id*='netlify']",
        "[class*='netlify']",
        "a[href*='netlify.com']",
        "a[href*='netlify.app']",
      ];

      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          try {
            el.remove();
          } catch {
            (el as HTMLElement).style.display = "none";
          }
        });
      });
    };

    purgeNetlify();

    // Continually observe DOM mutations to instantly remove dynamically injected Netlify scripts/iframes
    const observer = new MutationObserver(() => {
      purgeNetlify();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
};
