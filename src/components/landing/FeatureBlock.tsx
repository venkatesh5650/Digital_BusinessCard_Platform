"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./landing.module.css";

type FeatureBlockProps = {
  tag: string;
  tagIcon?: ReactNode;
  title: string;
  description: string;
  videoSrc?: string;
  imageSrc?: string;
  reversed?: boolean;
};

export default function FeatureBlock({
  tag,
  tagIcon,
  title,
  description,
  videoSrc,
  imageSrc,
  reversed = false,
}: FeatureBlockProps) {
  return (
    <motion.div
      className={`${styles.featureBlock} ${reversed ? styles.featureBlockReversed : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className={styles.featureContent}>
        <span className={styles.featureTag}>
          {tagIcon}
          {tag}
        </span>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>

      <div className={styles.featureMedia}>
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={imageSrc}
            style={{ width: "100%" }}
          />
        ) : imageSrc ? (
          <img src={imageSrc} alt={title} />
        ) : (
          <div
            style={{
              aspectRatio: "16/10",
              background: "var(--bg-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-3)",
              fontSize: 14,
            }}
          >
            Video placeholder
          </div>
        )}
      </div>
    </motion.div>
  );
}
