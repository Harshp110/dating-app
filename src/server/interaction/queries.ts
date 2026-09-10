import { prisma } from "@/lib/prisma";

export async function getConversationForUser(accountId: string, connectionId: string) {
  const connection = await prisma.connection.findUnique({ where: { id: connectionId }, include: { userA: { include: { profile: true } }, userB: { include: { profile: true } }, answers: { where: { revealState: "REVEALED" }, include: { question: true } }, conversation: { include: { messages: { orderBy: { createdAt: "asc" }, take: 50, include: { sender: { select: { id: true } } } } } }, datePlans: { orderBy: { createdAt: "desc" }, take: 5 } } });
  if (!connection || ![connection.userAId, connection.userBId].includes(accountId)) return null;
  return connection;
}