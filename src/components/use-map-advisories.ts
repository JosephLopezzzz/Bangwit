"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PHILIPPINE_PROVINCES } from "@/data/phl-provinces";
import {
  ADVISORY_FRESHNESS_MS,
  type AdvisorySnapshot,
  mergeAdvisorySnapshots,
  PUBLIC_ADVISORY_CACHE_KEY,
  parseAdvisorySnapshot,
} from "@/lib/map-advisories";

const provinceIds = PHILIPPINE_PROVINCES.map((province) => province.id);

export function useMapAdvisories() {
  const [snapshot, setSnapshot] = useState<AdvisorySnapshot | null>(null);
  const [connection, setConnection] = useState<"loading" | "ready" | "unavailable" | "offline">("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(0);
  const currentSnapshot = useRef<AdvisorySnapshot | null>(null);
  const request = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    setNow(Date.now());
    if (!navigator.onLine) {
      setConnection("offline");
      return;
    }
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setRefreshing(true);
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch("/api/advisories", {
        cache: "no-store",
        credentials: "omit",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Advisory source unavailable");
      const result = await response.json();
      if (result.status !== "ready") throw new Error("Advisory publication unavailable");
      const next = parseAdvisorySnapshot(result.snapshot, provinceIds);
      const age = Date.now() - Date.parse(next.generatedAt);
      if (age < 0 || age > ADVISORY_FRESHNESS_MS) throw new Error("Outdated advisory publication");
      const accepted = mergeAdvisorySnapshots(currentSnapshot.current, next, Date.now());
      currentSnapshot.current = accepted;
      setSnapshot(accepted);
      setConnection("ready");
      try {
        localStorage.setItem(PUBLIC_ADVISORY_CACHE_KEY, JSON.stringify(accepted));
      } catch {
        // Storage availability does not determine whether a fetched public bulletin can be displayed.
      }
    } catch {
      if (!controller.signal.aborted) setConnection(navigator.onLine ? "unavailable" : "offline");
      else if (request.current === controller) setConnection("unavailable");
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(PUBLIC_ADVISORY_CACHE_KEY);
      if (cached) {
        const saved = parseAdvisorySnapshot(JSON.parse(cached), provinceIds);
        currentSnapshot.current = saved;
        setSnapshot(saved);
      }
    } catch {
      // An invalid cache is unavailable, never an empty live warning set.
    }
    void refresh();
    const tick = window.setInterval(() => {
      setNow(Date.now());
      if (document.visibilityState === "visible") void refresh();
    }, 60_000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const onOffline = () => setConnection("offline");
    window.addEventListener("online", refresh);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisibility);
      const pending = request.current;
      request.current = null;
      pending?.abort();
    };
  }, [refresh]);

  return { snapshot, connection, refreshing, now, refresh };
}
