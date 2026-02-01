document.addEventListener('DOMContentLoaded', function () {
  const tokenInput = document.getElementById('jwtToken');
  const saveButton = document.getElementById('saveToken');
  const form = document.getElementById('form');
  const successMessage = document.getElementById('success-message');


  // Fallback for chrome.storage
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


  tokenInput.addEventListener('input', function () {
    saveButton.disabled = !this.value.trim();
  });


  saveButton.addEventListener('click', async function () {
    const token = tokenInput.value.trim();
    if (!token) return;


    try {
      await setInStorage("token", token);
      form.style.display = 'none';
      successMessage.style.display = 'block';


      setTimeout(() => {
        window.close(); // Optional: close popup after showing success
      }, 3000);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  });
});
