"use client";

import { useState } from "react";
import styles from "../card.module.css";

interface AvatarProps {
  src?: string;
  name: string;
}

export function Avatar({ src, name }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.avatarOuter}>
      <div className={styles.avatarInner}>
        {failed || !src ? (
          <div className={styles.avatarFallback}>{initials}</div>
        ) : (
          <img
            src={src}
            alt={name}
            className={styles.avatarImg}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
