const BACKEND_URL = "https://cipher-shds.onrender.com";

/* ================= HELPERS ================= */

async function syncSuperSafeSettings() {
  try {
    const { token } = await chrome.storage.local.get("token");
    if (!token) return;
    const res = await fetch(`${BACKEND_URL}/api/supersafe/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return;
    const settings = await res.json();
    await chrome.storage.local.set({ superSafeSettings: settings });
  } catch (err) {
    console.error("SuperSafe settings sync failed", err);
  }
}

/* ================= INCOGNITO MONITOR ================= */

chrome.windows.onCreated.addListener((window) => {
  if (window.incognito) {
    chrome.windows.remove(window.id);
    alertIncognitoOpen("Incognito Window Attempt");
  }
});

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

/* ================= EXTENSIONS PAGE BLOCKER ================= */

async function checkAndBlockExtensionsPage(tabId, url) {
  if (!url) return;
  if (!url.startsWith("chrome://extensions")) return;

  const { token } = await chrome.storage.local.get("token");
  if (!token) return;

  let blockEnabled = false;
  try {
    const res = await fetch(`${BACKEND_URL}/api/supersafe/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const settings = await res.json();
      await chrome.storage.local.set({ superSafeSettings: settings });
      blockEnabled = settings.blockExtensionsPage !== false;
    }
  } catch {
    const { superSafeSettings } = await chrome.storage.local.get("superSafeSettings");
    blockEnabled = superSafeSettings?.blockExtensionsPage !== false;
  }

  if (!blockEnabled) return;

  try {
    await chrome.tabs.remove(tabId);
  } catch {}

  try {
    await fetch(`${BACKEND_URL}/api/monitor/incognito-alert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        incognitoDetected: false,
        url: "chrome://extensions (blocked)",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {}
}

/* ================= BLOCKED SEARCH KEYWORDS ================= */

const BLOCKED_SEARCH_KEYWORDS = [
  "proxy", "proxies", "web proxy", "free proxy",
  "vpn", "free vpn", "vpn extension", "vpn chrome",
  "unblock sites", "unblock websites", "unblock school",
  "bypass filter", "bypass blocker", "bypass parental control",
  "bypass restriction", "bypass firewall",
  "how to unblock", "how to bypass", "how to disable parental",
  "remove parental control", "disable parental control",
  "turn off parental control", "get around parental control",
  "unblocker", "site unblocker", "ultrasurf", "psiphon",
  "hide browsing", "hide history", "anonymous browsing",
  "tor browser", "tor download",
  "disable cipherguard", "remove cipherguard", "uninstall cipherguard",
  "disable extension", "remove extension", "uninstall extension",
  "chrome extension remove", "how to remove chrome extension",
];

async function getAllBlockedKeywords() {
  const { superSafeSettings } = await chrome.storage.local.get("superSafeSettings");
  const custom = superSafeSettings?.customBlockedWords || [];
  return [...BLOCKED_SEARCH_KEYWORDS, ...custom];
}

async function containsBlockedKeyword(query) {
  if (!query) return null;
  const lower = query.toLowerCase();
  const allKeywords = await getAllBlockedKeywords();
  return allKeywords.find((kw) => lower.includes(kw)) || null;
}

async function alertBlockedSearch(token, searchQuery, domain) {
  try {
    await fetch(`${BACKEND_URL}/api/monitor/blocked-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searchQuery, domain }),
    });
  } catch {}
}

async function checkAndBlockSearchQuery(tabId, url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    if (!domain.includes("google.com") && !domain.includes("bing.com") && !domain.includes("yahoo.com")) {
      return false;
    }
    const params = new URLSearchParams(urlObj.search);
    const query = params.get("q") || params.get("p") || "";
    const matched = await containsBlockedKeyword(query);
    if (!matched) return false;

    const { token } = await chrome.storage.local.get("token");
    if (!token) return false;

    try { await chrome.tabs.remove(tabId); } catch {}
    await alertBlockedSearch(token, query, domain);
    return true;
  } catch {
    return false;
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

  if (domain.includes("google.com") || domain.includes("bing.com") || domain.includes("yahoo.com")) {
    const params = new URLSearchParams(urlObj.search);
    searchQuery = params.get("q") || params.get("p") || "";
  }

  const matchedKeyword = containsBlockedKeyword(searchQuery);
  if (matchedKeyword) {
    try {
      await chrome.tabs.remove(tab.id);
    } catch {}
    await alertBlockedSearch(token, searchQuery, domain);
    return;
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
    return await res.json();
  } catch (err) {
    console.error("URL check failed", err);
    return { blocked: false };
  }
}

async function handleTab(tabId, url) {
  try {
    const domain = new URL(url).hostname;
    const result = await checkUrlWithBackend(domain);

    if (result.blocked) {
      // Store info for the warning page
      await chrome.storage.local.set({
        supersafeWarning: {
          domain,
          voiceMessageUrl: result.voiceMessageUrl || null,
          blockedBySuperSafe: !!result.blockedBySuperSafe,
        },
      });

      // Redirect to local warning page
      await chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL("warning.html"),
      });
    }
  } catch { }
}

/* ================= TAB LISTENERS ================= */

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url?.startsWith("chrome://extensions")) {
    checkAndBlockExtensionsPage(tabId, changeInfo.url);
    return;
  }
  if (changeInfo.url?.startsWith("http")) {
    const blocked = await checkAndBlockSearchQuery(tabId, changeInfo.url);
    if (!blocked) {
      handleTab(tabId, changeInfo.url);
      updateActiveTabToBackend();
    }
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url?.startsWith("chrome://extensions")) {
      checkAndBlockExtensionsPage(tabId, tab.url);
      return;
    }
    if (tab.url?.startsWith("http")) {
      const blocked = await checkAndBlockSearchQuery(tabId, tab.url);
      if (!blocked) {
        handleTab(tabId, tab.url);
        updateActiveTabToBackend();
      }
    }
  } catch {}
});

/* ================= PERIODIC MONITORING ================= */

setInterval(updateActiveTabToBackend, 60000);

// Initial sync when service worker starts, then every 2 minutes
syncSuperSafeSettings();
setInterval(syncSuperSafeSettings, 120000);
