/* eslint-disable max-lines, sonarjs/cognitive-complexity, sonarjs/no-nested-conditional, sonarjs/super-linear-regex, @typescript-eslint/naming-convention, @typescript-eslint/no-base-to-string, @typescript-eslint/prefer-nullish-coalescing, unicorn/prefer-await, unicorn/max-nested-calls, lodash/prefer-constant -- FCM enrolment flow */
/**
 * Web Push + FCM registration helpers (no Firebase JS SDK).
 * Pass project config explicitly — nothing is read from env at module load.
 */

/* eslint-disable @typescript-eslint/no-magic-numbers -- crypto / TTL constants */
/* eslint-disable max-statements -- enrolment flow is inherently branched */

const FCM_REGISTRATION_API = "https://fcmregistrations.googleapis.com/v1";
const FIREBASE_INSTALLATIONS_API =
  "https://firebaseinstallations.googleapis.com/v1";
const INSTALLATIONS_SDK_VERSION = "w:0.6.4";
const AUTH_TOKEN_SKEW_MS = 5 * 60 * 1000;
const DEFAULT_STORAGE_KEY = "app.firebase.installation";

export interface FirebaseWebPushConfig {
  apiKey: string;
  appId: string;
  projectId: string;
  vapidKey: string;
  /** localStorage key for the installation cache. */
  storageKey?: string;
}

export interface WebPushStatus {
  configured: boolean;
  permission: NotificationPermission | "unsupported";
  supported: boolean;
}

export function getWebPushStatus(
  config: null | Partial<FirebaseWebPushConfig> | undefined,
): WebPushStatus {
  const supported =
    typeof window !== "undefined" &&
    "Notification" in globalThis &&
    "serviceWorker" in navigator &&
    "PushManager" in globalThis;

  return {
    configured: Boolean(
      config?.apiKey && config.projectId && config.vapidKey && config.appId,
    ),
    permission: supported ? Notification.permission : "unsupported",
    supported,
  };
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.codePointAt(i) ?? 0;
  }
  return bytes;
}

function bytesToBase64Url(buffer: ArrayBuffer | null): string {
  if (!buffer) {
    return "";
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll(/=+$/g, "");
}

export function describeDevice(
  userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent,
): string {
  const browser = userAgent.includes("Edg/")
    ? "Edge"
    : userAgent.includes("OPR/")
      ? "Opera"
      : userAgent.includes("Chrome/")
        ? "Chrome"
        : userAgent.includes("Firefox/")
          ? "Firefox"
          : userAgent.includes("Safari/")
            ? "Safari"
            : "Browser";
  const os = userAgent.includes("Android")
    ? "Android"
    : /iPhone|iPad|iPod/.test(userAgent)
      ? "iOS"
      : userAgent.includes("Windows")
        ? "Windows"
        : userAgent.includes("Mac OS X")
          ? "macOS"
          : userAgent.includes("Linux")
            ? "Linux"
            : "this device";
  return `${browser} on ${os}`;
}

export class WebPushError extends Error {}

interface StoredInstallation {
  authToken: string;
  expiresAt: number;
  fid: string;
  refreshToken: string;
}

function readStoredInstallation(storageKey: string): null | StoredInstallation {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredInstallation>;
    if (!parsed.fid || !parsed.refreshToken) {
      return null;
    }
    return {
      authToken: parsed.authToken ?? "",
      expiresAt: parsed.expiresAt ?? 0,
      fid: parsed.fid,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
}

function writeStoredInstallation(
  storageKey: string,
  installation: StoredInstallation,
): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(installation));
  } catch {
    /* cache is optional */
  }
}

function generateFid(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(17));
  bytes[0] = 0b0111_0000 + (bytes[0] % 0b0001_0000);
  return bytesToBase64Url(bytes.buffer).slice(0, 22);
}

function parseExpiresIn(value: unknown): number {
  const seconds = Number(String(value ?? "").replace(/s$/, ""));
  return (Number.isFinite(seconds) && seconds > 0 ? seconds : 60 * 60) * 1000;
}

async function createInstallation(
  config: FirebaseWebPushConfig,
): Promise<StoredInstallation> {
  const fid = generateFid();
  const response = await fetch(
    `${FIREBASE_INSTALLATIONS_API}/projects/${config.projectId}/installations`,
    {
      body: JSON.stringify({
        appId: config.appId,
        authVersion: "FIS_v2",
        fid,
        sdkVersion: INSTALLATIONS_SDK_VERSION,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-goog-api-key": config.apiKey,
      },
      method: "POST",
    },
  );
  const body = (await response.json().catch(() => null)) as {
    authToken?: { expiresIn?: string; token?: string };
    error?: { message?: string };
    fid?: string;
    refreshToken?: string;
  } | null;
  if (!response.ok || !body?.refreshToken || !body.authToken?.token) {
    throw new WebPushError(
      body?.error?.message ||
        `Could not register this browser with Firebase (${String(response.status)}).`,
    );
  }
  return {
    authToken: body.authToken.token,
    expiresAt: Date.now() + parseExpiresIn(body.authToken.expiresIn),
    fid: body.fid ?? fid,
    refreshToken: body.refreshToken,
  };
}

async function refreshAuthToken(
  config: FirebaseWebPushConfig,
  installation: StoredInstallation,
): Promise<StoredInstallation> {
  const response = await fetch(
    `${FIREBASE_INSTALLATIONS_API}/projects/${config.projectId}/installations/${installation.fid}/authTokens:generate`,
    {
      body: JSON.stringify({
        installation: {
          appId: config.appId,
          sdkVersion: INSTALLATIONS_SDK_VERSION,
        },
      }),
      headers: {
        Accept: "application/json",
        Authorization: `FIS_v2 ${installation.refreshToken}`,
        "Content-Type": "application/json",
        "x-goog-api-key": config.apiKey,
      },
      method: "POST",
    },
  );
  const body = (await response.json().catch(() => null)) as {
    expiresIn?: string;
    token?: string;
  } | null;
  if (!response.ok || !body?.token) {
    return createInstallation(config);
  }
  return {
    ...installation,
    authToken: body.token,
    expiresAt: Date.now() + parseExpiresIn(body.expiresIn),
  };
}

async function getInstallationAuthToken(
  config: FirebaseWebPushConfig,
): Promise<string> {
  const storageKey = config.storageKey ?? DEFAULT_STORAGE_KEY;
  const stored = readStoredInstallation(storageKey);
  if (stored?.authToken && stored.expiresAt - AUTH_TOKEN_SKEW_MS > Date.now()) {
    return stored.authToken;
  }
  const installation = stored
    ? await refreshAuthToken(config, stored)
    : await createInstallation(config);
  writeStoredInstallation(storageKey, installation);
  return installation.authToken;
}

async function exchangeSubscriptionForFcmToken(
  config: FirebaseWebPushConfig,
  subscription: PushSubscription,
): Promise<string> {
  const installationAuth = await getInstallationAuthToken(config);
  const response = await fetch(
    `${FCM_REGISTRATION_API}/projects/${config.projectId}/registrations`,
    {
      body: JSON.stringify({
        web: {
          applicationPubKey: config.vapidKey,
          auth: bytesToBase64Url(subscription.getKey("auth")),
          endpoint: subscription.endpoint,
          p256dh: bytesToBase64Url(subscription.getKey("p256dh")),
        },
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-goog-api-key": config.apiKey,
        "x-goog-firebase-installations-auth": installationAuth,
      },
      method: "POST",
    },
  );
  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string };
    token?: string;
  } | null;
  if (!response.ok || !body?.token) {
    throw new WebPushError(
      body?.error?.message ||
        `FCM registration failed (${String(response.status)}).`,
    );
  }
  return body.token;
}

export interface WebPushEnrolment {
  deviceName: string;
  platform: "web";
  token: string;
}

export async function enableWebPush(
  config: FirebaseWebPushConfig,
): Promise<WebPushEnrolment> {
  const status = getWebPushStatus(config);
  if (!status.supported) {
    throw new WebPushError("This browser cannot receive push notifications.");
  }
  if (!status.configured) {
    throw new WebPushError("Push is not configured for this build.");
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new WebPushError(
      permission === "denied"
        ? "Notifications are blocked for this site. Allow them in the browser settings, then reload."
        : "Notification permission was dismissed. Try again and choose Allow.",
    );
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      applicationServerKey: base64UrlToBytes(config.vapidKey),
      userVisibleOnly: true,
    }));
  const token = await exchangeSubscriptionForFcmToken(config, subscription);
  return { deviceName: describeDevice(), platform: "web", token };
}

export async function disableWebPush(
  config: FirebaseWebPushConfig,
): Promise<null | string> {
  if (!getWebPushStatus(config).supported) {
    return null;
  }
  const registration = await navigator.serviceWorker.getRegistration("/");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) {
    return null;
  }
  let token: null | string = null;
  try {
    token = await exchangeSubscriptionForFcmToken(config, subscription);
  } catch {
    /* still unsubscribe */
  }
  await subscription.unsubscribe();
  return token;
}
