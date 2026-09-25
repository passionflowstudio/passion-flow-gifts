import type { AnalyticsAdapter, CommerceEvent, TrackedEvent } from './events';
import { ga4Adapter } from './ga4';

declare global {
  interface Window { __pfEvents?: TrackedEvent[] }
}

// Ad-platform adapters (Meta, Pinterest, TikTok) are added here in Phase 5.
// The shared eventId lets those platforms deduplicate browser + server events.
const adapters: AnalyticsAdapter[] = [ga4Adapter];

const isDev = process.env.NODE_ENV !== 'production';

export function track(event: CommerceEvent): TrackedEvent {
  const tracked: TrackedEvent = { ...event, eventId: crypto.randomUUID(), at: new Date().toISOString() };
  // Event log for QA (e.g. verifying a failed add-to-cart emits nothing).
  (window.__pfEvents ??= []).push(tracked);
  if (isDev) console.debug('[analytics]', tracked.name, tracked);
  for (const adapter of adapters) {
    try {
      adapter.send(tracked);
    } catch (error) {
      if (isDev) console.warn(`[analytics] ${adapter.name} failed`, error);
    }
  }
  return tracked;
}
