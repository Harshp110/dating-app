export const DEFAULT_DAILY_DISCOVERY_LIMIT = 5;

export type ActionRecord = { senderId: string; recipientId: string; type: "INTEREST" | "PASS" };
export type ConnectionRecord = { userAId: string; userBId: string; state: ConnectionState };
export type ConnectionState = "INTERESTED" | "CONNECTED" | "GETTING_TO_KNOW" | "OPEN_TO_MEETING" | "MET" | "CONTINUE" | "PAUSE" | "CLOSED";

export function canOfferDiscovery(viewerId: string, candidateId: string, offeredCount: number, limit = DEFAULT_DAILY_DISCOVERY_LIMIT) {
  return viewerId !== candidateId && offeredCount < limit;
}

export function canCreateAction(senderId: string, recipientId: string, existing: ActionRecord | undefined) {
  return senderId !== recipientId && !existing;
}

export function canonicalPair(firstId: string, secondId: string) {
  return firstId < secondId ? [firstId, secondId] as const : [secondId, firstId] as const;
}

export function connectionFromActions(first: ActionRecord, second: ActionRecord): ConnectionRecord | null {
  if (first.senderId !== second.recipientId || first.recipientId !== second.senderId) return null;
  if (first.type !== "INTEREST" || second.type !== "INTEREST") return null;
  const [userAId, userBId] = canonicalPair(first.senderId, first.recipientId);
  return { userAId, userBId, state: "CONNECTED" };
}

const allowedTransitions: Record<ConnectionState, ConnectionState[]> = {
  INTERESTED: ["CONNECTED", "CLOSED"], CONNECTED: ["GETTING_TO_KNOW", "PAUSE", "CLOSED"], GETTING_TO_KNOW: ["OPEN_TO_MEETING", "PAUSE", "CLOSED"], OPEN_TO_MEETING: ["MET", "PAUSE", "CLOSED"], MET: ["CONTINUE", "CLOSED"], CONTINUE: ["CLOSED", "PAUSE"], PAUSE: ["CONTINUE", "CLOSED"], CLOSED: [],
};

export function canTransition(from: ConnectionState, to: ConnectionState) {
  return from === to || allowedTransitions[from].includes(to);
}

export function shouldRevealAnswers(firstAnswered: boolean, secondAnswered: boolean) {
  return firstAnswered && secondAnswered;
}
