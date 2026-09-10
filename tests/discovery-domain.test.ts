import { describe, expect, it } from "vitest";
import { canCreateAction, canOfferDiscovery, canTransition, connectionFromActions, shouldRevealAnswers } from "@/server/discovery/domain";

describe("discovery domain", () => {
  it("stops offering after the daily limit and blocks self introductions", () => {
    expect(canOfferDiscovery("a", "b", 4, 5)).toBe(true);
    expect(canOfferDiscovery("a", "b", 5, 5)).toBe(false);
    expect(canOfferDiscovery("a", "a", 0, 5)).toBe(false);
  });
  it("rejects duplicate directed actions", () => {
    expect(canCreateAction("a", "b", undefined)).toBe(true);
    expect(canCreateAction("a", "b", { senderId: "a", recipientId: "b", type: "INTEREST" })).toBe(false);
  });
  it("creates a connection only from reciprocal interest", () => {
    expect(connectionFromActions({ senderId: "a", recipientId: "b", type: "INTEREST" }, { senderId: "b", recipientId: "a", type: "INTEREST" })).toEqual({ userAId: "a", userBId: "b", state: "CONNECTED" });
    expect(connectionFromActions({ senderId: "a", recipientId: "b", type: "PASS" }, { senderId: "b", recipientId: "a", type: "INTEREST" })).toBeNull();
  });
  it("reveals answers only after both people answer", () => {
    expect(shouldRevealAnswers(true, false)).toBe(false);
    expect(shouldRevealAnswers(true, true)).toBe(true);
  });
  it("allows only natural connection progression", () => {
    expect(canTransition("CONNECTED", "GETTING_TO_KNOW")).toBe(true);
    expect(canTransition("CLOSED", "CONNECTED")).toBe(false);
  });
});