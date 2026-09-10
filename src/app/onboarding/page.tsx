import { requireUser } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding-form";
export default async function OnboardingPage() { await requireUser(); return <main className="onboarding-shell"><header className="topbar"><span className="brand">kindred<span>_</span></span><span className="step-count">Your profile, your pace</span></header><div className="onboarding-intro"><p className="eyebrow">A little context</p><h1>Let people meet the real you.</h1><p className="lede">This takes a few minutes. You can change anything later.</p></div><OnboardingForm /></main>; }
