"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/content/messages";
import { blackWeek } from "@/lib/campaign";
import type { Locale } from "@/lib/site";
import { IconCheck, IconCopy } from "../icons";

const COPIED_MS = 2200;

/**
 * Copies inside the tap itself, before any `await`: Safari drops the user
 * gesture across a promise, and `navigator.clipboard` is missing outside a
 * secure context (the dev server opened as http://<LAN-IP> on a phone).
 * The text is written in the `copy` event, so success means it really landed;
 * `execCommand` alone returns true even when the selection was empty.
 * Safari enables the copy command only over a selection, hence the range.
 */
const copyInGesture = (text: string) => {
  let written = false;
  const onCopy = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
    written = true;
  };
  const holder = document.createElement("span");
  holder.textContent = text;
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText =
    "position:fixed;top:0;left:0;opacity:0;pointer-events:none;white-space:pre;user-select:text;-webkit-user-select:text";
  document.body.append(holder);
  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNodeContents(holder);
  selection?.removeAllRanges();
  selection?.addRange(range);
  document.addEventListener("copy", onCopy, true);
  try {
    document.execCommand("copy");
  } catch {
    // Unsupported: the async API below gets its turn.
  } finally {
    document.removeEventListener("copy", onCopy, true);
    selection?.removeAllRanges();
    holder.remove();
  }
  return written;
};

const copyText = async (text: string) => {
  if (copyInGesture(text)) return true;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Black Week plaque in the hero copy. Always in the markup; CSS shows it only
 * while `<html data-campaign="blackweek">` is set (`src/lib/campaign.ts`).
 * Dark theme: platinum letters that the spotlight brightens through
 * `--beam-hit` (`HeroSpotlight`). Light theme: a black card with a xenon rim.
 */
export const HeroPromo = ({ locale }: { locale: Locale }) => {
  const copy = t(locale).promo;
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    if (!(await copyText(blackWeek.code))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <aside className="promo" data-promo="" aria-label={copy.region}>
      <span className="promo-lit" aria-hidden="true" />
      <span className="promo-sheen" aria-hidden="true" />
      <p className="promo-line">
        <span className="promo-label">{copy.label}</span>
        <span className="promo-offer">{copy.offer}</span>
        <button type="button" className="promo-code" onClick={handleCopy} title={copy.copy}>
          <span className="promo-code-label">{copy.codeLabel}</span>
          <span className="promo-code-value">{blackWeek.code}</span>
          <span className="promo-code-icon">{copied ? <IconCheck /> : <IconCopy />}</span>
          <span className="sr-only">{copy.copy}</span>
        </button>
      </p>
      <p className="promo-note">{copy.note}</p>
      <span className="sr-only" aria-live="polite">
        {copied ? copy.copied : ""}
      </span>
    </aside>
  );
};
