import { describe, expect, it } from "vitest";
import { canAccessConnection, canGiveMeetingFeedback, canRespondToPlan, canSendMessage } from "@/server/interaction/domain";

describe("interaction authorization", () => {
  it("allows only connection members", () => {
    expect(canAccessConnection("a", "a", "b")).toBe(true);
    expect(canAccessConnection("c", "a", "b")).toBe(false);
  });
  it("requires the authenticated sender and an open connection", () => {
    expect(canSendMessage("a", "a", true)).toBe(true);
    expect(canSendMessage("a", "b", true)).toBe(false);
    expect(canSendMessage("a", "a", false)).toBe(false);
  });
  it("does not let the proposer accept their own plan", () => {
    expect(canRespondToPlan("b", "a", true)).toBe(true);
    expect(canRespondToPlan("a", "a", true)).toBe(false);
    expect(canRespondToPlan("c", "a", false)).toBe(false);
  });
  it("opens meeting feedback only after the proposed time", () => {
    const start = new Date("2026-09-10T10:00:00Z");
    expect(canGiveMeetingFeedback(new Date("2026-09-10T09:59:00Z"), start)).toBe(false);
    expect(canGiveMeetingFeedback(new Date("2026-09-10T10:01:00Z"), start)).toBe(true);
  });
});
