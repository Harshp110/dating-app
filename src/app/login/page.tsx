import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <main className="auth-shell"><div className="auth-panel"><Link href="/" className="brand">kindred<span>_</span></Link><p className="eyebrow">Welcome back</p><h1>Good to see you.</h1><p className="lede">Pick up where you left off, at your own pace.</p><AuthForm action={signIn} submitLabel="Log in" /><p className="switch-link">New here? <Link href="/signup">Create an account</Link></p></div></main>; }
