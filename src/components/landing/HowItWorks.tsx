"use client";

import FeatureBlock from "./FeatureBlock";
import styles from "./landing.module.css";

const FEATURES = [
  {
    tag: "Digital Business Cards",
    tagIcon: <span style={{ fontSize: 16 }}>📇</span>,
    title: "Share who you are",
    description:
      "Create a digital business card that looks like you. Share by QR code, tap, or link — recipients don't need the app.",
    imageSrc: "/images/feature-share.png",
    videoSrc: "/videos/hero-share.mp4",
    reversed: false,
  },
  {
    tag: "Lead Capture",
    tagIcon: <span style={{ fontSize: 16 }}>👥</span>,
    title: "Capture contacts",
    description:
      "Let visitors share their details with you instantly. Every lead flows straight to your dashboard, ready for follow-up.",
    imageSrc: "/images/feature-capture.png",
    videoSrc: "/videos/hero-capture.mp4",
    reversed: true,
  },
  {
    tag: "Live Analytics",
    tagIcon: <span style={{ fontSize: 16 }}>📊</span>,
    title: "Track performance",
    description:
      "See who viewed your card, what they clicked, and when. Real-time insights to understand your networking impact.",
    imageSrc: "/images/feature-analytics.png",
    videoSrc: "/videos/hero-analytics.mp4",
    reversed: false,
  },
  {
    tag: "Multiple Sharing",
    tagIcon: <span style={{ fontSize: 16 }}>🔗</span>,
    title: "Share your way",
    description:
      "QR code, direct link, VCF download, or PNG image — give your contacts the choice that works for them.",
    imageSrc: "/images/feature-sharing.png",
    videoSrc: "/videos/hero-sharing.mp4",
    reversed: true,
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <p className={styles.sectionSubtitle}>
          Everything that happens after &lsquo;nice to meet you&rsquo;, done for you.
        </p>
      </div>

      {FEATURES.map((feature) => (
        <FeatureBlock
          key={feature.title}
          tag={feature.tag}
          tagIcon={feature.tagIcon}
          title={feature.title}
          description={feature.description}
          imageSrc={feature.imageSrc}
          videoSrc={feature.videoSrc}
          reversed={feature.reversed}
        />
      ))}
    </section>
  );
}
