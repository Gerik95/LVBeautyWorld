import { describe, expect, it } from "vitest";
import { blackWeek, campaignScript, isCampaignLive, liveCampaign } from "@/lib/campaign";

const at = (iso: string) => Date.parse(iso);

describe("campaign", () => {
  it("runs Black Week from Monday 00:00 to Sunday 23:59 in Berlin", () => {
    expect(isCampaignLive(blackWeek, at("2026-11-22T23:59:59+01:00"))).toBe(false);
    expect(isCampaignLive(blackWeek, at("2026-11-23T00:00:00+01:00"))).toBe(true);
    expect(isCampaignLive(blackWeek, at("2026-11-29T23:59:59+01:00"))).toBe(true);
    expect(isCampaignLive(blackWeek, at("2026-11-30T00:00:00+01:00"))).toBe(false);
  });

  it("previews with ?blackweek outside the dates", () => {
    expect(liveCampaign(at("2026-11-18T12:00:00+01:00"))).toBeNull();
    expect(liveCampaign(at("2026-11-18T12:00:00+01:00"), "?blackweek")?.id).toBe("blackweek");
    expect(liveCampaign(at("2026-11-25T12:00:00+01:00"))?.id).toBe("blackweek");
  });

  it("theme script sets data-campaign the same way", () => {
    const run = (now: number, search: string) => {
      const e = { dataset: {} as Record<string, string> };
      const realNow = Date.now;
      Date.now = () => now;
      try {
        new Function("e", "location", campaignScript())(e, { search });
      } finally {
        Date.now = realNow;
      }
      return e.dataset.campaign ?? null;
    };
    expect(run(at("2026-11-24T10:00:00+01:00"), "")).toBe("blackweek");
    expect(run(at("2026-12-01T10:00:00+01:00"), "")).toBeNull();
    expect(run(at("2026-12-01T10:00:00+01:00"), "?blackweek")).toBe("blackweek");
    expect(run(at("2026-12-01T10:00:00+01:00"), "?blackweeks")).toBeNull();
  });
});
