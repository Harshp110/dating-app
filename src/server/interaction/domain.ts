export function canAccessConnection(userId: string, userAId: string, userBId: string) { return userId === userAId || userId === userBId; }
export function canSendMessage(userId: string, senderId: string, connectionOpen: boolean) { return userId === senderId && connectionOpen; }
export function canRespondToPlan(userId: string, proposerId: string, member: boolean) { return member && userId !== proposerId; }
export function canGiveMeetingFeedback(now: Date, startsAt: Date | undefined) { return Boolean(startsAt && now >= startsAt); }
