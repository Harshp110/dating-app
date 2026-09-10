import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const interests = [
  ["live-music", "Live music"], ["gaming", "Gaming"], ["travel", "Travel"],
  ["cooking", "Cooking"], ["reading", "Reading"], ["fitness", "Fitness"],
  ["photography", "Photography"], ["film", "Film"],
];
const questions = [
  ["Your perfect Saturday suddenly becomes free. What are you doing?", "WEEKEND"],
  ["You have one free evening in the city. What&apos;s the plan?", "LIFESTYLE"],
  ["Pick one: spontaneous plan or carefully planned plan?", "COMMUNICATION"],
  ["What&apos;s something you&apos;d happily spend three hours talking about?", "INTERESTS"],
] as const;

async function main() {
  for (const [slug, label] of interests) await prisma.interest.upsert({ where: { slug }, update: { label }, create: { slug, label } });
  for (const [prompt, category] of questions) await prisma.microQuestion.upsert({ where: { id: `seed-${category.toLowerCase()}` }, update: { prompt, category }, create: { id: `seed-${category.toLowerCase()}`, prompt, category } });
  for (const label of ["Coffee", "Walk", "Bookstore", "Campus event", "Casual food", "Arcade", "Museum", "Park", "Local event"]) { const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-"); await prisma.activityCategory.upsert({ where: { slug }, update: { active: true }, create: { slug, label } }); }
  const seeded = [
    { id: "seed-user-a", authUserId: "seed-auth-a", email: "ava@example.test", firstName: "Ava", city: "Bengaluru", branch: "Computer Science", college: "Northstar Institute" },
    { id: "seed-user-b", authUserId: "seed-auth-b", email: "rohan@example.test", firstName: "Rohan", city: "Pune", branch: "Electrical Engineering", college: "Harbor University" },
  ];
  for (const item of seeded) { const user = await prisma.user.upsert({ where: { id: item.id }, update: {}, create: { id: item.id, authUserId: item.authUserId, email: item.email } }); const profile = await prisma.profile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, firstName: item.firstName, dateOfBirth: new Date("1998-05-20"), gender: "PREFER_NOT_TO_SAY", city: item.city, energyStyle: "IN_BETWEEN", rhythmStyle: "NIGHT_OWL", planningStyle: "SPONTANEOUS", onboardingCompleted: true } }); await prisma.engineeringEducation.upsert({ where: { profileId: profile.id }, update: {}, create: { profileId: profile.id, degree: "B.Tech", branch: item.branch, college: item.college, graduationYear: 2020 } }); await prisma.preference.upsert({ where: { profileId: profile.id }, update: {}, create: { profileId: profile.id, intent: "DATING" } }); await prisma.verification.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } }); }
}

main().finally(() => prisma.$disconnect());