"use client";

import { useSyncExternalStore } from "react";
import { skinConfig } from "./config";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
  return () => observer.disconnect();
};

const read = () => document.documentElement.dataset.skin || skinConfig.activeSkinId;
const readServer = () => skinConfig.activeSkinId;

/** The skin on `<html data-skin>`: the configured one, or the one the visitor switched on. */
export const useSkinId = () => useSyncExternalStore(subscribe, read, readServer);
