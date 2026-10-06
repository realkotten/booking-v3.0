/**
 * Payment and Booking API Client for Static Hosting with PHP Backend (/payment)
 */

export const API_BASE = '/payment';

export interface ApiFailureResult {
  ok: false;
  error: string;
}

/**
 * Perform a safe POST request:
 * Reads response as TEXT first, then JSON.parse inside try/catch.
 * If server returns HTML error page (e.g., 500/502/404) or network fails, returns clean error object.
 */
export async function postJson<T = any>(
  url: string,
  body: unknown,
  extraHeaders?: Record<string, string>
): Promise<T | ApiFailureResult> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(extraHeaders || {}),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (typeof data === 'object' && data !== null) {
        return data as T;
      }
      return { ok: false, error: 'خطا در قالب پاسخ دریافتی از سرور' };
    } catch {
      console.warn(`[PaymentApi] Non-JSON response from POST ${url}:`, text.slice(0, 150));
      return { ok: false, error: 'خطا در ارتباط با سرور' };
    }
  } catch (err: any) {
    console.warn(`[PaymentApi] Network failure for POST ${url}:`, err?.message || err);
    return { ok: false, error: 'خطا در ارتباط با سرور' };
  }
}

/**
 * Perform a safe GET request:
 * Reads response as TEXT first, then JSON.parse inside try/catch.
 */
export async function getJson<T = any>(
  url: string,
  extraHeaders?: Record<string, string>
): Promise<T | ApiFailureResult> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(extraHeaders || {}),
      },
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (typeof data === 'object' && data !== null) {
        return data as T;
      }
      return { ok: false, error: 'خطا در قالب پاسخ دریافتی از سرور' };
    } catch {
      console.warn(`[PaymentApi] Non-JSON response from GET ${url}:`, text.slice(0, 150));
      return { ok: false, error: 'خطا در ارتباط با سرور' };
    }
  } catch (err: any) {
    console.warn(`[PaymentApi] Network failure for GET ${url}:`, err?.message || err);
    return { ok: false, error: 'خطا در ارتباط با سرور' };
  }
}
