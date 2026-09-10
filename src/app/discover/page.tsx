import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTodaysDiscoveries } from "@/server/discovery/queries";
import { DiscoveryCard } from "@/components/discovery-card";

export default async function DiscoverPage() {
  const user = await requireUser();
  const account = await prisma.user.findUnique({ where: { authUserId: user.id }, select: { id: true, profile: { select: { onboardingCompleted: true } } } });
  if (!account?.profile?.onboardingCompleted) return <main className="profile-shell"><div className="empty-state"><p className="eyebrow">Before introductions</p><h1>Give people a little context first.</h1><Link className="button button-primary" href="/onboarding">Complete your profile</Link></div></main>;
  const introductions = await getTodaysDiscoveries(account.id);
  return <main className="profile-shell"><header className="topbar"><Link href="/profile" className="brand">kindred<span>_</span></Link><nav className="topnav"><Link href="/connections">Connections</Link><Link href="/profile">Profile</Link></nav></header><div className="discovery-heading"><p className="eyebrow">Today&apos;s introductions</p><h1>A few people, with room to actually notice them.</h1><p className="lede">No endless feed here. Take your time with the people who show up today.</p><span className="daily-count">{introductions.length} of 5 introductions</span></div><div className="discovery-list">{introductions.length ? introductions.map((item) => <DiscoveryCard key={item.id} candidate={item.candidate} />) : <div className="empty-state"><p className="eyebrow">A quiet day</p><h2>There are no new introductions right now.</h2><p className="lede">Come back tomorrow. Good things do not need an infinite scroll.</p></div>}</div></main>;
}
