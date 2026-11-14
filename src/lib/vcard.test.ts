import { describe, expect, it } from "vitest";
import { buildVCard, describeWeek, escapeText, foldLine } from "@/lib/vcard";
import { site } from "@/lib/site";

const unfold = (card: string) => card.replace(/\r\n /g, "");

describe("vcard", () => {
  it("escapes the characters that separate vCard values", () => {
    expect(escapeText("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
  });

  it("folds long lines at 75 octets without splitting a character", () => {
    const line = `NOTE:${"Öffnungszeiten ".repeat(12)}`;
    const folded = foldLine(line);
    const encoder = new TextEncoder();
    for (const part of folded.split("\r\n")) {
      expect(encoder.encode(part).length).toBeLessThanOrEqual(75);
      expect(part).not.toContain("�");
    }
    expect(folded.replace(/\r\n /g, "")).toBe(line);
  });

  it("describes the week Monday first with shared ranges", () => {
    expect(describeWeek("de")).toBe("Mo–Sa 10:00–19:00, So geschlossen");
    expect(describeWeek("uk")).toBe("Пн–Сб 10:00–19:00, Нд зачинено");
  });

  it("carries the salon facts from site.ts", () => {
    const card = unfold(buildVCard("de"));
    expect(card.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(card.endsWith("END:VCARD\r\n")).toBe(true);
    expect(card).toContain(`TEL;TYPE=WORK,VOICE:${site.phoneTel}`);
    expect(card).toContain(`EMAIL;TYPE=INTERNET,WORK:${site.email}`);
    expect(card).toContain(`ADR;TYPE=WORK:;;${site.street};${site.city};;${site.postalCode};Deutschland`);
    expect(card).toContain("URL:https://lvbeautyworld.de/de");
    expect(card).toContain("NOTE:Öffnungszeiten: Mo–Sa 10:00–19:00\\, So geschlossen.");
    expect(card).not.toContain("PHOTO");
  });

  it("speaks the visitor's language and embeds the photo when given", () => {
    const card = unfold(buildVCard("uk", { photo: "QUJD" }));
    expect(card).toContain(";Німеччина");
    expect(card).toContain("URL:https://lvbeautyworld.de/uk");
    expect(card).toContain("PHOTO;ENCODING=b;TYPE=PNG:QUJD");
  });
});
