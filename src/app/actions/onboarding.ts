"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validation";

export async function saveOnboarding(_previousState: { error?: string } | undefined, formData: FormData) {
  const user = await requireUser();
  const raw = Object.fromEntries(formData);
  const parsed = onboardingSchema.safeParse({ ...raw, interestIds: formData.getAll("interestIds"), experienceYears: raw.experienceYears || undefined });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check your answers." };
  const data = parsed.data;
  await prisma.user.upsert({ where: { authUserId: user.id }, update: { email: user.email ?? "" }, create: { authUserId: user.id, email: user.email ?? "" } });
  const account = await prisma.user.findUniqueOrThrow({ where: { authUserId: user.id } });
  await prisma.profile.upsert({ where: { userId: account.id }, update: { firstName: data.firstName, dateOfBirth: data.dateOfBirth, gender: data.gender, city: data.city, energyStyle: data.energyStyle, rhythmStyle: data.rhythmStyle, planningStyle: data.planningStyle, onboardingCompleted: true }, create: { userId: account.id, firstName: data.firstName, dateOfBirth: data.dateOfBirth, gender: data.gender, city: data.city, energyStyle: data.energyStyle, rhythmStyle: data.rhythmStyle, planningStyle: data.planningStyle, onboardingCompleted: true } });
  const profile = await prisma.profile.findUniqueOrThrow({ where: { userId: account.id } });
  await prisma.$transaction([
    prisma.engineeringEducation.upsert({ where: { profileId: profile.id }, update: { degree: data.degree, branch: data.branch, college: data.college, graduationYear: data.graduationYear }, create: { profileId: profile.id, degree: data.degree, branch: data.branch, college: data.college, graduationYear: data.graduationYear } }),
    prisma.employment.upsert({ where: { profileId: profile.id }, update: { status: data.employmentStatus, role: data.role || null, industry: data.industry || null, company: data.company || null, experienceYears: data.experienceYears ?? null }, create: { profileId: profile.id, status: data.employmentStatus, role: data.role || null, industry: data.industry || null, company: data.company || null, experienceYears: data.experienceYears ?? null } }),
    prisma.preference.upsert({ where: { profileId: profile.id }, update: { intent: data.intent, communicationNote: data.communicationNote || null }, create: { profileId: profile.id, intent: data.intent, communicationNote: data.communicationNote || null } }),
    prisma.verification.upsert({ where: { userId: account.id }, update: {}, create: { userId: account.id } }),
    prisma.profileInterest.deleteMany({ where: { profileId: profile.id } }),
  ]);
  await prisma.profileInterest.createMany({ data: data.interestIds.map((interestId) => ({ profileId: profile.id, interestId })), skipDuplicates: true });
  redirect("/profile");
}
