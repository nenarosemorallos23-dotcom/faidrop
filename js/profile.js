(() => {
  const fileInput = document.querySelector('#profile-photo');
  const avatar = document.querySelector('#profile-avatar');
  const removeButton = document.querySelector('#remove-profile-photo');
  const errorMessage = document.querySelector('#profile-photo-error');
  const user = window.FaidropData.user() || {
    name: window.FaidropData.defaults.name,
    email: window.FaidropData.defaults.email
  };
  if (!fileInput || !avatar || !removeButton || !errorMessage) return;

  const initials = user.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const renderAvatar = () => {
    avatar.replaceChildren();
    if (user.avatar) {
      const image = document.createElement('img');
      image.src = user.avatar;
      image.alt = `${user.name}'s profile picture`;
      avatar.append(image);
    } else {
      avatar.textContent = initials || 'NM';
    }
    removeButton.hidden = !user.avatar;
    const profileLink = document.querySelector('.nav-profile');
    if (profileLink) {
      profileLink.replaceChildren();
      if (user.avatar) {
        const image = document.createElement('img');
        image.src = user.avatar;
        image.alt = '';
        profileLink.append(image);
      } else {
        profileLink.textContent = initials || 'NM';
      }
    }
  };

  document.querySelector('[data-profile-name]').textContent = user.name;
  document.querySelector('[data-profile-email]').textContent = user.email;
  renderAvatar();

  fileInput.addEventListener('change', () => {
    errorMessage.textContent = '';
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      errorMessage.textContent = 'Choose an image file.';
      fileInput.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.textContent = 'Choose an image smaller than 5 MB.';
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('error', () => {
      errorMessage.textContent = 'The selected image could not be read. Please choose another picture.';
      fileInput.value = '';
    });
    reader.addEventListener('load', () => {
      const source = new Image();
      source.addEventListener('error', () => {
        errorMessage.textContent = 'The selected image could not be opened. Please choose another picture.';
        fileInput.value = '';
      });
      source.addEventListener('load', () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(source.naturalWidth, source.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          errorMessage.textContent = 'Your browser could not process this image.';
          return;
        }
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        user.avatar = canvas.toDataURL('image/jpeg', 0.82);
        if (!window.FaidropData.saveUser(user)) {
          delete user.avatar;
          errorMessage.textContent = 'The profile picture could not be saved. Try a smaller image.';
          return;
        }
        renderAvatar();
        window.showToast('Profile picture updated.');
      });
      source.src = reader.result;
    });
    reader.readAsDataURL(file);
  });

  removeButton.addEventListener('click', () => {
    delete user.avatar;
    if (!window.FaidropData.saveUser(user)) {
      errorMessage.textContent = 'The profile picture could not be removed. Please try again.';
      return;
    }
    fileInput.value = '';
    errorMessage.textContent = '';
    renderAvatar();
    window.showToast('Profile picture removed.');
  });
})();
