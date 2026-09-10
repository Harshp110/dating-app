"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canCreateAction, canTransition, canonicalPair, DEFAULT_DAILY_DISCOVERY_LIMIT } from "@/server/discovery/domain";
import { z } from "zod";

const candidateSchema = z.string().cuid();
const stateSchema = z.enum(["CONNECTED", "GETTING_TO_KNOW", "OPEN_TO_MEETING", "MET", "CONTINUE", "PAUSE", "CLOSED"]);
const answerSchema = z.object({ questionId: z.string().min(1).max(64), answer: z.string().trim().min(1).max(500), connectionId: z.string().cuid() });

export async function expressInterest(candidateId: string) {
  const user = await requireUser();
  const parsed = candidateSchema.safeParse(candidateId);
  if (!parsed.success) return { error: "That connection is not available." };
  const account = await prisma.user.findUnique({ where: { authUserId: user.id }, select: { id: true } });
  if (!account) return { error: "Complete your profile first." };
  if (parsed.data === account.id) return { error: "You cannot connect with yourself." };
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const discovery = await prisma.discovery.findFirst({ where: { viewerId: account.id, candidateId: parsed.data, discoveryDate: today, status: { not: "EXPIRED" } } });
  if (!discovery) return { error: "This person is not in today's introductions." };
  const offeredCount = await prisma.interestAction.count({ where: { senderId: account.id, createdAt: { gte: today } } });
  if (offeredCount >= DEFAULT_DAILY_DISCOVERY_LIMIT) return { error: "You have reached today's connection limit." };
  const existing = await prisma.interestAction.findUnique({ where: { senderId_recipientId: { senderId: account.id, recipientId: parsed.data } } });
  if (!canCreateAction(account.id, parsed.data, existing ?? undefined)) return { error: "You have already responded to this introduction." };
  const action = await prisma.interestAction.create({ data: { senderId: account.id, recipientId: parsed.data, type: "INTEREST" } });
  const reciprocal = await prisma.interestAction.findUnique({ where: { senderId_recipientId: { senderId: parsed.data, recipientId: account.id } } });
  if (reciprocal?.type === "INTEREST") {
    const [userAId, userBId] = canonicalPair(account.id, parsed.data);
    const connection = await prisma.connection.upsert({ where: { userAId_userBId: { userAId, userBId } }, update: {}, create: { userAId, userBId } });
    await prisma.conversation.upsert({ where: { connectionId: connection.id }, update: {}, create: { connectionId: connection.id } });
    return { connected: true, actionId: action.id };
  }
  return { connected: false, actionId: action.id };
}

export async function answerQuestion(_previousState: { error?: string } | undefined, formData: FormData) {
  const user = await requireUser();
  const parsed = answerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Write a short answer before continuing." };
  const account = await prisma.user.findUnique({ where: { authUserId: user.id }, select: { id: true } });
  if (!account) return { error: "Account not found." };
  const connection = await prisma.connection.findUnique({ where: { id: parsed.data.connectionId } });
  if (!connection || ![connection.userAId, connection.userBId].includes(account.id)) return { error: "You cannot answer this question." };
  await prisma.questionAnswer.upsert({ where: { questionId_authorId_connectionId: { questionId: parsed.data.questionId, authorId: account.id, connectionId: parsed.data.connectionId } }, update: { answer: parsed.data.answer }, create: { questionId: parsed.data.questionId, authorId: account.id, connectionId: parsed.data.connectionId, answer: parsed.data.answer } });
  const answerCount = await prisma.questionAnswer.count({ where: { questionId: parsed.data.questionId, connectionId: parsed.data.connectionId } });
  if (answerCount >= 2) await prisma.questionAnswer.updateMany({ where: { questionId: parsed.data.questionId, connectionId: parsed.data.connectionId }, data: { revealState: "REVEALED" } });
  return { success: true };
}

export async function updateConnectionState(_previousState: { error?: string } | undefined, formData: FormData) {
  const user = await requireUser();
  const connectionId = String(formData.get("connectionId") ?? "");
  const state = stateSchema.safeParse(formData.get("nextState"));
  if (!state.success) return { error: "That connection update is not available." };
  const account = await prisma.user.findUnique({ where: { authUserId: user.id }, select: { id: true } });
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!account || !connection || ![connection.userAId, connection.userBId].includes(account.id)) return { error: "You cannot update this connection." };
  if (!canTransition(connection.state, state.data)) return { error: "That connection cannot move to this stage." };
  await prisma.connection.update({ where: { id: connectionId }, data: { state: state.data } });
  redirect("/connections");
}
