import { z } from "zod";

const today = new Date();
const adultCutoff = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

export const onboardingSchema = z.object({
  firstName: z.string().trim().min(2).max(40),
  dateOfBirth: z.coerce.date().refine((date) => date <= adultCutoff, "You must be at least 18 to join."),
  gender: z.enum(["WOMAN", "MAN", "NON_BINARY", "SELF_DESCRIBED", "PREFER_NOT_TO_SAY"]),
  city: z.string().trim().min(2).max(80),
  degree: z.string().trim().min(2).max(120),
  branch: z.string().trim().min(2).max(120),
  college: z.string().trim().min(2).max(160),
  graduationYear: z.coerce.number().int().min(1950).max(today.getFullYear() + 8),
  employmentStatus: z.enum(["STUDENT", "EMPLOYED_SELF_EMPLOYED", "LOOKING_FOR_WORK", "NOT_WORKING", "PREFER_NOT_TO_SAY"]),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  experienceYears: z.coerce.number().int().min(0).max(80).optional(),
  interestIds: z.array(z.string().cuid()).min(2).max(12),
  intent: z.enum(["EXPLORING", "DATING", "SERIOUS_RELATIONSHIP", "LONG_TERM_MARRIAGE"]),
  energyStyle: z.enum(["INTROVERT", "EXTROVERT", "IN_BETWEEN"]),
  rhythmStyle: z.enum(["EARLY_BIRD", "NIGHT_OWL"]),
  planningStyle: z.enum(["PLANNED", "SPONTANEOUS"]),
  communicationNote: z.string().trim().max(240).optional().or(z.literal("")),
});

export const authSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});

export const photoSchema = z.object({
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(5 * 1024 * 1024),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
