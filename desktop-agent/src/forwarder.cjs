const axios = require("axios");

function createForwarder(backendUrl, deviceId) {
  const api = axios.create({
    baseURL: backendUrl,
    timeout: 15000,
    headers: { "Content-Type": "application/json", "X-Device-ID": deviceId || "" },
  });

  async function forwardMonitorUrl(token, payload) {
    await api.post("/api/monitor/monitor-url", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function sendTamperAlert(token) {
    await api.post("/api/monitor/tamper-alert", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function sendTamperAlertFailed(token) {
    await api.post("/api/monitor/tamper-alert-failed", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function sendAgentEvent(token, type) {
    await api.post("/api/monitor/agent-event", { type }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return { forwardMonitorUrl, sendTamperAlert, sendTamperAlertFailed, sendAgentEvent };
}

module.exports = { createForwarder };
