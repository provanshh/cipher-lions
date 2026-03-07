const BACKEND_URL = "https://cipher-shds.onrender.com";

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
      // For now, keep existing behaviour: simple alert + close.
      // SuperSafe-specific warning/voice can be enhanced here using result.voiceMessageUrl.
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () =>
          alert("This website is restricted by parental control."),
      });

      chrome.tabs.remove(tabId);
    }
  } catch { }
}

/* ================= TAB LISTENERS ================= */

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

/* ================= PERIODIC MONITORING ================= */

setInterval(updateActiveTabToBackend, 60000);
