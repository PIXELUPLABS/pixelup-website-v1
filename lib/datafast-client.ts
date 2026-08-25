type DatafastMetadata = Record<string, string>;

interface DatafastFunction {
  (goalName: string, metadata?: DatafastMetadata): void;
  q?: IArguments[];
}

declare global {
  interface Window {
    datafast?: DatafastFunction;
  }
}

export interface CurrentAttribution {
  originPage?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

export interface TallyHiddenFields extends CurrentAttribution {
  datafast_visitor_id?: string;
}

const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

export function trackDatafastGoal(goalName: string, metadata: DatafastMetadata = {}) {
  if (typeof window === "undefined" || typeof window.datafast !== "function") return;

  const nonEmptyMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => value !== "")
  );

  if (Object.keys(nonEmptyMetadata).length > 0) {
    window.datafast(goalName, nonEmptyMetadata);
  } else {
    window.datafast(goalName);
  }
}

export function readDatafastVisitorId() {
  if (typeof document === "undefined") return undefined;

  for (const cookie of document.cookie.split(";")) {
    const separatorIndex = cookie.indexOf("=");
    if (separatorIndex === -1) continue;

    const name = cookie.slice(0, separatorIndex).trim();
    if (name !== "datafast_visitor_id") continue;

    const value = cookie.slice(separatorIndex + 1).trim();
    if (!value) return undefined;

    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return undefined;
}

export function readCurrentAttribution(): CurrentAttribution {
  if (typeof window === "undefined") return {};

  const attribution: CurrentAttribution = {};
  if (window.location.pathname) attribution.originPage = window.location.pathname;

  const searchParams = new URLSearchParams(window.location.search);
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = searchParams.get(key);
    if (value) attribution[key] = value;
  }

  return attribution;
}

export function buildTallyHiddenFields(
  attribution: CurrentAttribution,
  visitorId: string | undefined
): TallyHiddenFields {
  return {
    ...(visitorId ? { datafast_visitor_id: visitorId } : {}),
    ...attribution,
  };
}

export function buildDatafastMetadata(
  attribution: CurrentAttribution,
  formId: string
): DatafastMetadata {
  return {
    ...(attribution.originPage ? { origin_page: attribution.originPage } : {}),
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    ...(attribution.utm_medium ? { utm_medium: attribution.utm_medium } : {}),
    ...(attribution.utm_campaign ? { utm_campaign: attribution.utm_campaign } : {}),
    ...(attribution.utm_content ? { utm_content: attribution.utm_content } : {}),
    ...(formId ? { form_id: formId } : {}),
  };
}
