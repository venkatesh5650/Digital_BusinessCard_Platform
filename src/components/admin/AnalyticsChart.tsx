"use client";

import { motion } from "framer-motion";

export default function AnalyticsChart() {
  // Mock data for the trend line
  const points = [10, 40, 25, 60, 45, 80, 55, 90, 75, 100];
  const width = 400;
  const height = 120;
  const step = width / (points.length - 1);

  const pathData = points.reduce((acc, p, i) => {
    const x = i * step;
    const y = height - (p / 100) * height;
    return acc + `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }, "");

  const areaData = pathData + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", padding: "10px" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          d={areaData}
          fill="url(#chartGradient)"
        />

        {/* The line */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathData}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + (i * 0.1) }}
            cx={i * step}
            cy={height - (p / 100) * height}
            r="4"
            fill="var(--bg-elevated)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}
