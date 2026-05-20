import { useEffect, useRef } from "react";
import { ChronicleButton } from "./chronicle-button";

const BAUHAUS_CARD_STYLES = `
.bauhaus-card {
  position: relative;
  z-index: 10;
  max-width: 24rem;
  min-height: 22rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 12px 25px rgb(0,0,0/40%);
  border-radius: var(--card-radius, 20px);
  border: var(--card-border-width, 2px) solid transparent;
  --rotation: 4.2rad;
  background-image:
    linear-gradient(var(--card-bg, #151419), var(--card-bg, #151419)),
    linear-gradient(calc(var(--rotation,4.2rad)), var(--card-accent, #156ef6) 0, var(--card-bg, #151419) 30%, transparent 80%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: var(--card-text-main, #f0f0f1);
  overflow: hidden;
}
.bauhaus-card-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.bauhaus-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.bauhaus-button-container > * {
  flex: 1;
  min-width: 0;
}
.bauhaus-date {
  color: var(--card-text-top, #bfc7d5);
  font-size: 0.75rem;
  font-weight: 500;
}
.bauhaus-size6 {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}
.bauhaus-card-body {
  flex: 1;
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.bauhaus-card-body h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--card-text-main, #f0f0f1);
}
.bauhaus-card-body p {
  color: var(--card-text-sub, #a0a1b3);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.bauhaus-progress {
  width: 100%;
}
.bauhaus-progress-bar {
  position: relative;
  width: 100%;
  background: var(--card-progress-bar-bg, #363636);
  height: 0.25rem;
  border-radius: 1rem;
  margin: 0.5rem 0;
}
.bauhaus-progress-bar > div {
  height: 100%;
  border-radius: 1rem;
}
.bauhaus-progress span:first-of-type {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  display: block;
  color: var(--card-text-progress-label, #b4c7e7);
}
.bauhaus-progress span:last-of-type {
  text-align: right;
  display: block;
  font-size: 0.75rem;
  color: var(--card-text-progress-value, #e7e7f7);
}
.bauhaus-card-footer {
  width: 100%;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid var(--card-separator, #2F2B2A);
}
`;

function injectBauhausCardStyles() {
  if (typeof window === "undefined") return;
  if (!document.getElementById("bauhaus-card-styles")) {
    const style = document.createElement("style");
    style.id = "bauhaus-card-styles";
    style.innerHTML = BAUHAUS_CARD_STYLES;
    document.head.appendChild(style);
  }
}

const isRTL = (text) =>
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);

export const BauhausCard = ({
  id,
  borderRadius = "var(--bauhaus-card-radius, 2em)",
  backgroundColor = "var(--bauhaus-card-bg, #151419)",
  separatorColor = "var(--bauhaus-card-separator, #2F2B2A)",
  accentColor = "var(--bauhaus-card-accent, #156ef6)",
  borderWidth = "var(--bauhaus-card-border-width, 2px)",
  topInscription = "Not Set!",
  swapButtons = false,
  mainText = "Not Set!",
  subMainText = "Not Set!",
  progressBarInscription = "Not Set!",
  progress = 0,
  progressValue = "Not Set!",
  filledButtonInscription = "Not Set!",
  outlinedButtonInscription = "Not Set!",
  onFilledButtonClick,
  onOutlinedButtonClick,
  onMoreOptionsClick,
  mirrored = false,
  textColorTop = "var(--bauhaus-card-inscription-top, #bfc7d5)",
  textColorMain = "var(--bauhaus-card-inscription-main, #f0f0f1)",
  textColorSub = "var(--bauhaus-card-inscription-sub, #a0a1b3)",
  textColorProgressLabel = "var(--bauhaus-card-inscription-progress-label, #b4c7e7)",
  textColorProgressValue = "var(--bauhaus-card-inscription-progress-value, #e7e7f7)",
  progressBarBackground = "var(--bauhaus-card-progress-bar-bg, #363636)",
  chronicleButtonBg = "var(--bauhaus-chronicle-bg, #fff)",
  chronicleButtonFg = "var(--bauhaus-chronicle-fg, #111)",
  chronicleButtonHoverFg = "var(--bauhaus-chronicle-hover-fg, #fff)",
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    injectBauhausCardStyles();
    const card = cardRef.current;
    const handleMouseMove = (e) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", angle + "rad");
      }
    };
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      className="bauhaus-card"
      ref={cardRef}
      style={{
        '--card-bg': backgroundColor,
        '--card-border': separatorColor,
        '--card-accent': accentColor,
        '--card-radius': borderRadius,
        '--card-border-width': borderWidth,
        '--card-text-top': textColorTop,
        '--card-text-main': textColorMain,
        '--card-text-sub': textColorSub,
        '--card-text-progress-label': textColorProgressLabel,
        '--card-text-progress-value': textColorProgressValue,
        '--card-separator': separatorColor,
        '--card-progress-bar-bg': progressBarBackground,
      }}
    >
      <div
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
        className="bauhaus-card-header"
      >
        <div
          className="bauhaus-date"
          style={{
            transform: mirrored ? 'scaleX(-1)' : 'none',
            direction: isRTL(topInscription) ? 'rtl' : 'ltr',
          }}
        >
          {topInscription}
        </div>
        <div
          onClick={() => onMoreOptionsClick(id)}
          style={{ cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24" fill="var(--card-text-main)" className="bauhaus-size6">
            <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="bauhaus-card-body">
        <h3 style={{ direction: isRTL(mainText) ? 'rtl' : 'ltr' }}>{mainText}</h3>
        <p style={{ direction: isRTL(subMainText) ? 'rtl' : 'ltr' }}>{subMainText}</p>
        <div className="bauhaus-progress">
          <span style={{
            direction: isRTL(progressBarInscription) ? 'rtl' : 'ltr',
            textAlign: mirrored ? 'right' : 'left'
          }}>
            {progressBarInscription}
          </span>
          <div
            style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
            className="bauhaus-progress-bar"
          >
            <div
              style={{
                width: `${(progress / 100) * 100}%`,
                backgroundColor: accentColor
              }}
            />
          </div>
          <span style={{
            direction: isRTL(progressValue) ? 'rtl' : 'ltr',
            textAlign: mirrored ? 'left' : 'right'
          }}>
            {progressValue}
          </span>
        </div>
      </div>
      <div className="bauhaus-card-footer">
        <div className="bauhaus-button-container">
          {swapButtons ? (
            <>
              <ChronicleButton
                text={outlinedButtonInscription}
                outlined={true}
                width="160px"
                onClick={() => onOutlinedButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
              <ChronicleButton
                text={filledButtonInscription}
                width="100%"
                onClick={() => onFilledButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
            </>
          ) : (
            <>
              <ChronicleButton
                text={filledButtonInscription}
                width="100%"
                onClick={() => onFilledButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
              <ChronicleButton
                text={outlinedButtonInscription}
                outlined={true}
                width="100%"
                onClick={() => onOutlinedButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
