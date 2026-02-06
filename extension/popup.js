document.addEventListener('DOMContentLoaded', function () {
  const tokenInput = document.getElementById('jwtToken');
  const saveButton = document.getElementById('saveToken');
  const disconnectButton = document.getElementById('disconnectExtension');
  const form = document.getElementById('form');
  const successMessage = document.getElementById('success-message');
  const statusTitle = document.querySelector('#form h3');
  const statusText = document.querySelector('#form p');

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
  getFromStorage("token").then(token => {
    if (token) {
      tokenInput.style.display = 'none';
      saveButton.style.display = 'none';
      disconnectButton.style.display = 'block';
      statusTitle.textContent = "SafeSurf Active";
      statusText.textContent = "You are currently protected.";
    } else {
      tokenInput.style.display = 'block';
      saveButton.style.display = 'block';
      disconnectButton.style.display = 'none';
      statusTitle.textContent = "SafeSurf Disabled";
      statusText.textContent = "Please enter your token to enable protection.";
    }
  });

  tokenInput.addEventListener('input', function () {
    saveButton.disabled = !this.value.trim();
  });

  saveButton.addEventListener('click', async function () {
    const token = tokenInput.value.trim();
    if (!token) return;

    try {
      await setInStorage("token", token);

      // Notify backend about activation
      try {
        await fetch("http://localhost:5000/api/monitor/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
      } catch (err) {
        console.error("Activation notification failed:", err);
      }

      tokenInput.style.display = 'none';
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
    if (!token) return;

    try {
      // Notify backend about disconnection
      try {
        await fetch("http://localhost:5000/api/monitor/disconnect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
      } catch (err) {
        console.error("Disconnect notification failed:", err);
      }

      await removeFromStorage("token");

      tokenInput.value = '';
      tokenInput.style.display = 'block';
      saveButton.style.display = 'block';
      disconnectButton.style.display = 'none';
      statusTitle.textContent = "SafeSurf Disabled";
      statusText.textContent = "Please enter your token to enable protection.";

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
