// First-party acquisition context. Captured on landing, persisted in a
// first-party cookie, and written onto the Shopify cart as hidden attributes
// (keys starting with "_") so each order carries its source into Shopify.

const COOKIE = 'pf_attr';
const MAX_AGE_DAYS = 90;
const CAMPAIGN_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
// Ad-platform click identifiers: Meta, TikTok, Pinterest, Google.
const CLICK_ID_PARAMS = ['fbclid', 'ttclid', 'epik', 'gclid'] as const;

export type Touch = {
  params: Partial<Record<(typeof CAMPAIGN_PARAMS)[number] | (typeof CLICK_ID_PARAMS)[number], string>>;
  landingPath: string;
  referrer: string;
  at: string;
};

export type Attribution = { first: Touch; last: Touch };

function readCookie(): Attribution | null {
  const match = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.slice(COOKIE.length + 1))) as Attribution;
  } catch {
    return null;
  }
}

function writeCookie(value: Attribution) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE_DAYS * 86_400}; Path=/; SameSite=Lax${secure}`;
}

const externalReferrer = () => {
  try {
    return document.referrer && new URL(document.referrer).host !== location.host ? document.referrer.slice(0, 200) : '';
  } catch {
    return '';
  }
};

// Call once per page load. A visit with campaign params or a click ID, or an
// external referrer, becomes the new last touch; the first touch never changes.
export function captureAttribution(): Attribution {
  const url = new URL(location.href);
  const params: Touch['params'] = {};
  for (const key of [...CAMPAIGN_PARAMS, ...CLICK_ID_PARAMS]) {
    const value = url.searchParams.get(key);
    if (value) params[key] = value.slice(0, 200);
  }
  const referrer = externalReferrer();
  const existing = readCookie();
  const isNewTouch = Object.keys(params).length > 0 || Boolean(referrer);

  if (existing && !isNewTouch) return existing;

  const touch: Touch = { params, landingPath: url.pathname, referrer, at: new Date().toISOString() };
  const next: Attribution = { first: existing?.first ?? touch, last: touch };
  writeCookie(next);
  return next;
}

export function getAttribution(): Attribution | null {
  return typeof document === 'undefined' ? null : readCookie();
}

// Shopify cart attributes: hidden from the buyer at checkout, visible on the order.
export function attributionToCartAttributes(attribution: Attribution | null) {
  if (!attribution) return [];
  const { first, last } = attribution;
  const pairs: [string, string | undefined][] = [
    ...Object.entries(last.params).map(([key, value]) => [`_${key}`, value] as [string, string]),
    ['_landing_page', last.landingPath],
    ['_referrer', last.referrer],
    ['_first_utm_source', first.params.utm_source],
    ['_first_utm_campaign', first.params.utm_campaign],
    ['_first_landing_page', first.landingPath],
    ['_first_seen_at', first.at],
  ];
  return pairs.filter((pair): pair is [string, string] => Boolean(pair[1])).map(([key, value]) => ({ key, value: value.slice(0, 250) }));
}
