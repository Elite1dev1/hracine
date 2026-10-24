import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  hasTrackingConsent,
  startTrackingScripts,
  TRACKING_CONSENT_KEY,
  revokeTrackingConsent,
} from "@/lib/tracking-consent";

const TrackingConsent = () => {
  const router = useRouter();
  const [choice, setChoice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(TRACKING_CONSENT_KEY);
    if (storedChoice === "granted") {
      setChoice("granted");
      startTrackingScripts();
    } else if (storedChoice === "denied") {
      setChoice("denied");
    } else {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const startWhenSafe = () => {
      if (hasTrackingConsent()) startTrackingScripts();
    };
    router.events.on("routeChangeComplete", startWhenSafe);
    return () => router.events.off("routeChangeComplete", startWhenSafe);
  }, [router.events]);

  const choose = (nextChoice) => {
    window.localStorage.setItem(TRACKING_CONSENT_KEY, nextChoice);
    setChoice(nextChoice);
    setIsOpen(false);
    if (nextChoice === "granted") startTrackingScripts();
    else revokeTrackingConsent();
  };

  if (!isOpen && !choice) return null;

  return (
    <aside
      aria-label="Cookie preferences"
      style={{
        position: "fixed",
        zIndex: 12000,
        left: 16,
        right: 16,
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        maxWidth: isOpen ? 560 : "none",
        marginLeft: isOpen ? "auto" : 0,
        padding: isOpen ? 18 : 0,
        border: isOpen ? "1px solid #e8e0dc" : 0,
        borderRadius: 10,
        background: isOpen ? "#fff" : "transparent",
        boxShadow: isOpen ? "0 8px 30px rgba(0,0,0,.16)" : "none",
        color: "#282323",
        font: "14px/1.5 Arial, sans-serif",
      }}
    >
      {isOpen ? (
        <>
          <p style={{ margin: "0 0 12px" }}>
            Hracine uses analytics and advertising cookies to understand site use and measure campaigns. Optional tracking stays off unless you allow it. You can change this choice any time.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => choose("denied")} style={buttonStyle(false)}>
              Reject optional
            </button>
            <button type="button" onClick={() => choose("granted")} style={buttonStyle(true)}>
              Accept optional
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Cookie settings (${choice === "granted" ? "accepted" : "rejected"})`}
          style={{ ...buttonStyle(false), padding: "7px 10px", fontSize: 12 }}
        >
          Cookie settings
        </button>
      )}
    </aside>
  );
};

const buttonStyle = (primary) => ({
  minHeight: 40,
  padding: "9px 14px",
  borderRadius: 7,
  border: "1px solid #702a27",
  background: primary ? "#702a27" : "#fff",
  color: primary ? "#fff" : "#702a27",
  cursor: "pointer",
  fontWeight: 600,
});

export default TrackingConsent;
