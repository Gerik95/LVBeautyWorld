import { describe, expect, it } from "vitest";
import { prices } from "@/content/prices";
import { team } from "@/content/team";
import { salonCategoryList, salonCheckout, salonkeeServiceIds, serviceLeadId } from "@/lib/booking";

describe("salonkee checkout", () => {
  it("opens one treatment in the salon checkout", () => {
    const url = new URL(salonCheckout(152284));
    expect(`${url.origin}${url.pathname}`).toBe("https://salonkee.de/checkout/lv-beauty-world-gmbh");
    expect(url.searchParams.get("serviceID")).toBe("152284");
    expect(url.searchParams.has("employeeID")).toBe(false);
  });

  it("books classic manicure from the nails page", () => {
    expect(serviceLeadId.nails).toBe(152284);
    expect(salonkeeServiceIds["nail-classic"]).toBe(152284);
  });

  it("gives every price row its own Salonkee treatment", () => {
    for (const item of prices) {
      expect(salonkeeServiceIds[item.id], item.id).toEqual(expect.any(Number));
    }
  });

  it("sends each master to the list of treatments they actually do", () => {
    const bySlug = Object.fromEntries(team.map((member) => [member.slug, member.salonkeeCategory]));
    expect(bySlug.kateryna).toBe("nagelstudio");
    expect(bySlug.tetiana).toBe("nagelstudio");
    expect(bySlug.diana).toBe("augenbrauen-und-make-up");
    expect(bySlug.kristina).toBe("augenbrauen-und-make-up");
    expect(bySlug.karina).toBe("gesichtspflege");
    expect(bySlug.viktoriia).toBe("friseure");
    expect(bySlug.ilona).toBe("friseure");
    const url = new URL(salonCategoryList("friseure"));
    expect(`${url.origin}${url.pathname}`).toBe("https://salonkee.de/salon/lv-beauty-world-gmbh/widget/service");
    expect(url.searchParams.get("search")).toBe("friseure");
    expect(url.searchParams.get("goTo")).toBe("services");
  });
});
