import React from "react";
import { createRoot } from "react-dom/client";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const layerAssets = {
  background: "/hero/background.png",
  character: "/hero/character.png",
  cards: "/hero/cards.png",
  desk: "/hero/desk.png",
};

const springConfig = {
  stiffness: 70,
  damping: 22,
};

function BackgroundLayer({ style, reducedMotion }) {
  return (
    <div className="portrait-layer portrait-layer-background" aria-hidden="true">
      <motion.div className="portrait-layer-parallax" style={style}>
        <motion.img
          className="portrait-layer-image"
          src={layerAssets.background}
          alt=""
          width="1448"
          height="1086"
          loading="eager"
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
        />
      </motion.div>
    </div>
  );
}

function CharacterLayer({ style, reducedMotion }) {
  return (
    <div className="portrait-layer portrait-layer-character">
      <motion.div className="portrait-layer-parallax" style={style}>
        <motion.div
          className="portrait-layer-idle"
          animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <motion.img
            className="portrait-layer-image"
            src={layerAssets.character}
            alt="AI 产品经理漫画画像"
            width="1448"
            height="1086"
            loading="eager"
            decoding="async"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: "easeOut" }}
            style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function CardLayer({ style, reducedMotion }) {
  return (
    <div className="portrait-layer portrait-layer-cards" aria-hidden="true">
      <motion.div className="portrait-layer-parallax" style={style}>
        <motion.div
          className="portrait-layer-entry"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.92, delay: 0.24, ease: "easeOut" }}
        >
          <motion.div
            className="portrait-layer-idle"
            animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <motion.img
              className="portrait-layer-image"
              src={layerAssets.cards}
              alt=""
              width="1448"
              height="1086"
              loading="eager"
              decoding="async"
              style={{ willChange: reducedMotion ? "auto" : "transform" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function DeskLayer({ style, reducedMotion }) {
  return (
    <div className="portrait-layer portrait-layer-desk" aria-hidden="true">
      <motion.div className="portrait-layer-parallax" style={style}>
        <motion.img
          className="portrait-layer-image"
          src={layerAssets.desk}
          alt=""
          width="1448"
          height="1086"
          loading="eager"
          decoding="async"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.88, delay: 0.34, ease: "easeOut" }}
          style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
        />
      </motion.div>
    </div>
  );
}

function InteractionController({ children }) {
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const motionScale = reducedMotion ? 0 : 1;

  const backgroundStyle = {
    x: useTransform(springX, (value) => value * 5 * motionScale),
    y: useTransform(springY, (value) => value * 5 * motionScale),
  };
  const characterStyle = {
    x: useTransform(springX, (value) => value * 25 * motionScale),
    y: useTransform(springY, (value) => value * 15 * motionScale),
  };
  const cardsStyle = {
    x: useTransform(springX, (value) => value * 18 * motionScale),
    y: useTransform(springY, (value) => value * 12 * motionScale),
  };
  const deskStyle = {
    x: useTransform(springX, (value) => value * 35 * motionScale),
    y: useTransform(springY, (value) => value * 20 * motionScale),
  };
  const highlightStyle = {
    x: useTransform(springX, (value) => value * 10 * motionScale),
    y: useTransform(springY, (value) => value * 10 * motionScale),
  };
  const rotateX = useTransform(springY, (value) => value * -3 * motionScale);
  const rotateY = useTransform(springX, (value) => value * 4 * motionScale);

  const handleMouseMove = (event) => {
    if (reducedMotion || window.matchMedia("(max-width: 900px)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const nextY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    mouseX.set(Math.max(-1, Math.min(1, nextX)));
    mouseY.set(Math.max(-1, Math.min(1, nextY)));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="interactive-portrait-shell">
      <motion.div
        className="interactive-portrait"
        aria-label="AI 产品经理画像"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        whileHover={
          reducedMotion
            ? undefined
            : {
                scale: 1.03,
                filter: "drop-shadow(0 32px 58px rgb(50 65 50 / 0.16))",
              }
        }
        transition={{ type: "spring", stiffness: 70, damping: 22 }}
      >
        {children({
          backgroundStyle,
          characterStyle,
          cardsStyle,
          deskStyle,
          reducedMotion,
        })}
        <motion.div
          className="portrait-highlight"
          style={highlightStyle}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

function InteractivePortrait() {
  return (
    <InteractionController>
      {({ backgroundStyle, characterStyle, cardsStyle, deskStyle, reducedMotion }) => (
        <div className="portrait-layer-stage">
          <BackgroundLayer style={backgroundStyle} reducedMotion={reducedMotion} />
          <CharacterLayer style={characterStyle} reducedMotion={reducedMotion} />
          <CardLayer style={cardsStyle} reducedMotion={reducedMotion} />
          <DeskLayer style={deskStyle} reducedMotion={reducedMotion} />
        </div>
      )}
    </InteractionController>
  );
}

function mountInteractivePortrait() {
  const hero = document.querySelector(".portfolio-hero");
  if (!hero) return;

  let mount = document.getElementById("hero-portrait-root");
  if (!mount || !hero.contains(mount)) {
    mount = document.createElement("div");
    mount.id = "hero-portrait-root";
    mount.setAttribute("aria-label", "个人画像展示区域");
    hero.appendChild(mount);
  }

  if (mount.dataset.mounted === "true") return;
  mount.dataset.mounted = "true";
  createRoot(mount).render(<InteractivePortrait />);
}

const bootInteractivePortrait = () => {
  window.setTimeout(mountInteractivePortrait, 240);
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", bootInteractivePortrait, { once: true });
} else {
  bootInteractivePortrait();
}
