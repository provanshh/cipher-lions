document.addEventListener('DOMContentLoaded', function () {
  const tokenInput = document.getElementById('jwtToken');
  const passwordInput = document.getElementById('parentPassword');
  const saveButton = document.getElementById('saveToken');
  const disconnectButton = document.getElementById('disconnectExtension');
  const form = document.getElementById('form');
  const successMessage = document.getElementById('success-message');
  const statusTitle = document.querySelector('#form h3');
  const statusText = document.querySelector('#form p');
  const lockoutTimer = document.getElementById('lockoutTimer');
  const timerValue = document.getElementById('timerValue');
  const errorMessage = document.getElementById('errorMessage');
  let countdownInterval;

  // ... existing storage logic ...
  const storage = chrome.storage ? chrome.storage.local : {
    get: (key, callback) => {
      const value = localStorage.getItem(key);
      callback({ [key]: value });
    },
    set: (obj, callback) => {
      Object.keys(obj).forEach(key => {
        localStorage.setItem(key, obj[key]);
      });
      if (callback) callback();
    },
    remove: (key, callback) => { // Added remove
      localStorage.removeItem(key);
      if (callback) callback();
    }
  };

  const getFromStorage = (key) => {
    return new Promise((resolve) => {
      storage.get(key, (result) => resolve(result[key]));
    });
  };

  const setInStorage = (key, value) => {
    return new Promise((resolve) => {
      storage.set({ [key]: value }, resolve);
    });
  };

  const removeFromStorage = (key) => {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.local.remove(key, resolve);
      } else {
        storage.remove(key, resolve);
      }
    });
  };

  // Check initial state
  getFromStorage("token").then(async (token) => {
    const lockoutUntil = await getFromStorage("lockoutUntil");
    if (lockoutUntil && new Date(lockoutUntil) > new Date()) {
      startLockout(new Date(lockoutUntil));
    }

    if (token) {
      tokenInput.style.display = 'none';
      passwordInput.placeholder = "Enter password to disconnect";
      saveButton.style.display = 'none';
      disconnectButton.style.display = 'block';
      statusTitle.textContent = "SafeSurf Active";
      statusText.textContent = "You are currently protected.";
    } else {
      tokenInput.style.display = 'block';
      passwordInput.placeholder = "Enter parent password";
      saveButton.style.display = 'block';
      disconnectButton.style.display = 'none';
      statusTitle.textContent = "SafeSurf Disabled";
      statusText.textContent = "Please enter your token and password to enable protection.";
    }
  });

  function startLockout(untilDate) {
    if (countdownInterval) clearInterval(countdownInterval);

    lockoutTimer.style.display = 'block';
    errorMessage.style.display = 'none'; // Hide error if locked
    saveButton.disabled = true;
    disconnectButton.disabled = true;
    passwordInput.disabled = true;
    tokenInput.disabled = true;

    setInStorage("lockoutUntil", untilDate.toISOString());

    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = untilDate.getTime() - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        lockoutTimer.style.display = 'none';
        saveButton.disabled = false;
        disconnectButton.disabled = false;
        passwordInput.disabled = false;
        tokenInput.disabled = false;
        removeFromStorage("lockoutUntil");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerValue.textContent =
        String(hours).padStart(2, '0') + ":" +
        String(minutes).padStart(2, '0') + ":" +
        String(seconds).padStart(2, '0');
    }, 1000);
  }

  tokenInput.addEventListener('input', function () {
    saveButton.disabled = !this.value.trim();
    errorMessage.style.display = 'none';
  });

  passwordInput.addEventListener('input', function () {
    errorMessage.style.display = 'none';
  });

  saveButton.addEventListener('click', async function () {
    const token = tokenInput.value.trim();
    const password = passwordInput.value.trim();
    if (!token || !password) {
      alert("Please enter both token and password");
      return;
    }

    try {
      await setInStorage("token", token);

      // Notify backend about activation
      try {
        const response = await fetch("http://localhost:5000/api/monitor/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password })
        });

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 403 && data.lockoutUntil) {
            startLockout(new Date(data.lockoutUntil));
          }
          errorMessage.textContent = data.message || "Activation failed";
          errorMessage.style.display = 'block';
          return;
        }
      } catch (err) {
        console.error("Activation notification failed:", err);
      }

      tokenInput.style.display = 'none';
      passwordInput.value = '';
      passwordInput.placeholder = "Enter password to disconnect";
      saveButton.style.display = 'none';
      disconnectButton.style.display = 'block';
      statusTitle.textContent = "SafeSurf Active";
      statusText.textContent = "You are currently protected.";
      successMessage.style.display = 'block';

      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 3000);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  });

  disconnectButton.addEventListener('click', async function () {
    const token = await getFromStorage("token");
    const password = passwordInput.value.trim();
    if (!token) return;
    if (!password) {
      alert("Please enter password to disconnect");
      return;
    }

    try {
      // Notify backend about disconnection
      try {
        const response = await fetch("http://localhost:5000/api/monitor/disconnect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password })
        });

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 401 && data.lockoutUntil) {
            startLockout(new Date(data.lockoutUntil));
          } else if (response.status === 403 && data.lockoutUntil) {
            startLockout(new Date(data.lockoutUntil));
          }
          errorMessage.textContent = data.message || "Disconnection failed. Check password.";
          errorMessage.style.display = 'block';
          return;
        }
      } catch (err) {
        console.error("Disconnect notification failed:", err);
      }

      await removeFromStorage("token");

      tokenInput.value = '';
      passwordInput.value = '';
      passwordInput.placeholder = "Enter parent password";
      tokenInput.style.display = 'block';
      saveButton.style.display = 'block';
      disconnectButton.style.display = 'none';
      statusTitle.textContent = "SafeSurf Disabled";
      statusText.textContent = "Please enter your token and password to enable protection.";

      successMessage.textContent = "Extension disconnected successfully.";
      successMessage.style.display = 'block';
      successMessage.style.color = 'orange';

      setTimeout(() => {
        successMessage.style.display = 'none';
        successMessage.style.color = 'green';
        successMessage.textContent = "Hello user! Your protection is now active.";
      }, 3000);

    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  });
});
