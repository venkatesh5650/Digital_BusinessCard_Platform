"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProviders, signIn } from "next-auth/react";
import { registerUser } from "@/lib/actions";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);

  useEffect(() => {
    getProviders()
      .then((providers) => setHasGoogle(Boolean(providers?.google)))
      .catch(() => setHasGoogle(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>I</div>
          <span className={styles.brandName}>Imprint</span>
        </div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Start sharing your digital business card in minutes</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {hasGoogle && (
          <button
            id="btn-google-register"
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        )}
        {hasGoogle === false && (
          <div className={styles.errorBanner}>
            Google sign-in is disabled. Add Google OAuth keys in `.env` to enable it.
          </div>
        )}

        <div className={styles.divider}><span>or</span></div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" placeholder="John Doe" required autoComplete="name" />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Min. 8 characters" required autoComplete="new-password" />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat password" required autoComplete="new-password" />
          </div>
          <button
            id="btn-register-submit"
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link href="/auth/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
