console.log("CipherGuard background service worker loaded");

/* ================= CONFIG ================= */

const BACKEND_URL = "http://localhost:5000";

/* ================= INCognito MONITOR ================= */

chrome.windows.onCreated.addListener((window) => {
  if (window.incognito) {
    chrome.windows.remove(window.id);
    alertIncognitoOpen("Incognito Window Attempt");
  }
});

function monitorIncognitoPermission() {
  setInterval(() => {
    chrome.extension.isAllowedIncognitoAccess(isAllowed => {
      if (!isAllowed) {
        // This notifies the parent that the extension can't monitor incognito yet
        console.log("Incognito access not allowed");
      }
    });
  }, 60000); // every 1 minute
}

async function alertIncognitoOpen(url) {
  const { token } = await chrome.storage.local.get("token");
  if (!token) return;

  try {
    await fetch(`${BACKEND_URL}/api/monitor/incognito-alert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        incognitoDetected: true,
        url,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("Incognito alert failed", err);
  }
}

/* ================= ACTIVE TAB MONITOR ================= */

async function updateActiveTabToBackend() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url?.startsWith("http")) return;

  const { token } = await chrome.storage.local.get("token");
  if (!token) return;

  const urlObj = new URL(tab.url);
  const domain = urlObj.hostname;
  let searchQuery = "";

  // Extract search query if it's a known search engine
  if (domain.includes("google.com") || domain.includes("bing.com") || domain.includes("yahoo.com")) {
    const params = new URLSearchParams(urlObj.search);
    searchQuery = params.get("q") || params.get("p") || ""; // q for google/bing, p for yahoo
  }

  try {
    await fetch(`${BACKEND_URL}/api/monitor/monitor-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ domain, searchQuery }),
    });
  } catch (err) {
    console.error("Active tab update failed", err);
  }
}

/* ================= BLOCKED SITE CHECK ================= */

async function checkUrlWithBackend(domain) {
  const { token } = await chrome.storage.local.get("token");
  if (!token) return { blocked: false };

  try {
    const res = await fetch(`${BACKEND_URL}/api/monitor/check-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: domain }),
    });

    if (!res.ok) return { blocked: false };
    return await res.json(); // { blocked: true/false }
  } catch (err) {
    console.error("URL check failed", err);
    return { blocked: false };
  }
}

async function handleTab(tabId, url) {
  try {
    const domain = new URL(url).hostname;
    const { blocked } = await checkUrlWithBackend(domain);

    if (blocked) {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () =>
          alert("This website is restricted by parental control."),
      });

      chrome.tabs.remove(tabId);
    }
  } catch { }
}

/* ================= TAB LISTENERS (MV3 SAFE) ================= */

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url?.startsWith("http")) {
    handleTab(tabId, changeInfo.url);
    updateActiveTabToBackend();
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url?.startsWith("http")) {
    handleTab(tabId, tab.url);
    updateActiveTabToBackend();
  }
});

/* ================= HEARTBEAT ================= */

async function sendHeartbeat() {
  const { token } = await chrome.storage.local.get("token");
  if (!token) return;

  try {
    await fetch(`${BACKEND_URL}/api/monitor/activate`, { // Reuse activate endpoint for heartbeat
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (err) {
    console.error("Heartbeat failed", err);
  }
}

/* ================= START SERVICES ================= */

monitorIncognitoPermission();

setInterval(updateActiveTabToBackend, 60000); // track URL every 1 minute
setInterval(sendHeartbeat, 60000); // ensure heartbeat every 1 minute


/* ================= LIFECYCLE LISTENERS ================= */

async function notifyLifecycleEvent(endpoint) {
  const { token } = await chrome.storage.local.get("token");
  if (!token) return;

  try {
    await fetch(`${BACKEND_URL}/api/monitor/${endpoint}`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (err) {
    console.error(`Lifecycle event ${endpoint} failed`, err);
  }
}

// When browser starts
chrome.runtime.onStartup.addListener(() => {
  console.log("Browser started - notifying activation");
  notifyLifecycleEvent("activate");
});

// When extension is installed/updated/reloaded
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated - notifying activation");
  notifyLifecycleEvent("activate");
});

