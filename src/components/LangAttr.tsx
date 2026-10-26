"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/site";
import { t } from "@/content/messages";

export const LangAttr = ({ locale }: { locale: Locale }) => {
  useEffect(() => {
    document.documentElement.lang = t(locale).htmlLang;
  }, [locale]);
  return null;
};
