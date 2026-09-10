"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

async function requireAdmin() { const authUser = await requireUser(); const admin = await prisma.user.findUnique({ where: { authUserId: authUser.id }, select: { id: true, role: true } }); if (!admin || admin.role !== "ADMIN") redirect("/profile"); return admin; }
export async function resolveReport(formData: FormData) { await requireAdmin(); const reportId = z.string().cuid().parse(formData.get("reportId")); await prisma.report.update({ where: { id: reportId }, data: { status: "RESOLVED" } }); redirect("/admin"); }
export async function suspendUser(formData: FormData) { await requireAdmin(); const userId = z.string().cuid().parse(formData.get("userId")); await prisma.user.update({ where: { id: userId }, data: { status: "SUSPENDED" } }); redirect("/admin"); }
export async function createQuestion(formData: FormData) { await requireAdmin(); const prompt = z.string().trim().min(10).max(240).parse(formData.get("prompt")); const category = z.enum(["WEEKEND", "LIFESTYLE", "VALUES", "INTERESTS", "COMMUNICATION"]).parse(formData.get("category")); await prisma.microQuestion.create({ data: { prompt, category } }); redirect("/admin"); }
export async function toggleQuestion(formData: FormData) { await requireAdmin(); const questionId = z.string().cuid().parse(formData.get("questionId")); const question = await prisma.microQuestion.findUniqueOrThrow({ where: { id: questionId }, select: { active: true } }); await prisma.microQuestion.update({ where: { id: questionId }, data: { active: !question.active } }); redirect("/admin"); }
export async function createActivityCategory(formData: FormData) { await requireAdmin(); const label = z.string().trim().min(2).max(60).parse(formData.get("label")); const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); await prisma.activityCategory.upsert({ where: { slug }, update: { active: true }, create: { slug, label } }); redirect("/admin"); }
