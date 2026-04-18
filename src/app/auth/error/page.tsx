import Link from "next/link";
import styles from "../auth.module.css";

const errorMessages: Record<string, string> = {
  OAuthSignin: "Could not start sign-in. Please try again.",
  OAuthCallback: "There was a problem with the OAuth callback.",
  OAuthCreateAccount: "Could not create account with this provider.",
  EmailCreateAccount: "Could not create account with this email.",
  Callback: "Something went wrong during sign-in.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  default: "An unknown error occurred. Please try again.",
};

type AuthErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error } = await searchParams;
  const errorKey = error ?? "default";
  const message = errorMessages[errorKey] ?? errorMessages.default;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>I</div>
          <span className={styles.brandName}>Imprint</span>
        </div>
        <div className={styles.errorIcon}>⚠️</div>
        <h1 className={styles.title}>Sign-in Error</h1>
        <p className={styles.subtitle}>{message}</p>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "center" }}>
          <Link href="/auth/signin" className={styles.submitBtn} style={{ textDecoration: "none", display: "inline-block", padding: "12px 28px" }}>
            Try Again
          </Link>
          <Link href="/" className={styles.googleBtn} style={{ textDecoration: "none", display: "inline-block", padding: "12px 28px" }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
