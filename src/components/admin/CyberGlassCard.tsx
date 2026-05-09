"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./cyber-glass-card.module.css";

interface CyberGlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function CyberGlassCard({ children, className, delay = 0 }: CyberGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for the glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the glow position
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${styles.card} ${className || ""}`}
    >
      {/* Dynamic Glow Layer */}
      <motion.div
        className={styles.glow}
        style={{
          left: smoothX,
          top: smoothY,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Content Layer */}
      <div className={styles.content}>
        {children}
      </div>
    </motion.div>
  );
}
