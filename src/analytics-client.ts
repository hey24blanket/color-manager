import './blanket-analytics.js';
import type { BeforeSendEvent } from '@vercel/analytics';

declare global {
  interface Window {
    blanketAnalytics: {
      beforeSend(event: BeforeSendEvent): BeforeSendEvent | null;
      track(name: string, data?: Record<string, string | number | boolean | null | undefined>): void;
    };
  }
}

export function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  try { return window.blanketAnalytics.beforeSend(event); } catch { return null; }
}
export function track(name: string, data?: Record<string, string | number | boolean | null | undefined>): void {
  try { window.blanketAnalytics.track(name, data); } catch { /* Fail closed. */ }
}
