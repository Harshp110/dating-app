"use client";

import { useActionState } from "react";

type Action = (previousState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
export function AuthForm({ action, submitLabel }: { action: Action; submitLabel: string }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return <form action={formAction} className="space-y-5"><label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label className="field"><span>Password</span><input name="password" type="password" autoComplete="current-password" minLength={8} required placeholder="At least 8 characters" /></label>{state?.error && <p className="form-error" role="alert">{state.error}</p>}<button className="button button-primary w-full" disabled={pending}>{pending ? "Working..." : submitLabel}</button></form>;
}
