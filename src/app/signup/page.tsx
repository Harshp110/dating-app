import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
export default function SignupPage() { return <main className="auth-shell"><div className="auth-panel"><Link href="/" className="brand">kindred<span>_</span></Link><p className="eyebrow">Start somewhere real</p><h1>Make room for a better hello.</h1><p className="lede">A few thoughtful details help people meet you beyond the profile photo.</p><AuthForm action={signUp} submitLabel="Create account" /><p className="switch-link">Already have an account? <Link href="/login">Log in</Link></p></div></main>; }
