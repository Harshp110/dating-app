import { prisma } from "@/lib/prisma";
import { DEFAULT_DAILY_DISCOVERY_LIMIT } from "@/server/discovery/domain";

function dateKey(date = new Date()) { return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())); }

export async function getTodaysDiscoveries(userId: string, limit = DEFAULT_DAILY_DISCOVERY_LIMIT) {
  const today = dateKey();
  return prisma.discovery.findMany({ where: { viewerId: userId, discoveryDate: today, status: { not: "EXPIRED" } }, orderBy: { position: "asc" }, take: limit, include: { candidate: { include: { profile: { include: { education: true, employment: true, preference: true, interests: { include: { interest: true } }, photos: { where: { status: "APPROVED" }, orderBy: { sortOrder: "asc" } } } } } } } });
}
