(() => {
  const adminAvatar = document.querySelector('#admin-profile-avatar');
  const fileInput = document.querySelector('#admin-photo');
  const removeButton = document.querySelector('#remove-admin-photo');
  const errorMessage = document.querySelector('#admin-photo-error');
  if (!adminAvatar || !fileInput || !removeButton || !errorMessage) return;

  const admin = window.FaidropData.adminProfile();
  const rider = window.FaidropData.riderProfile();
  const label = document.querySelector('label[for="admin-photo"]');

  const setAvatar = (element, src, alt, initials) => {
    element.replaceChildren();
    if (src) {
      const image = document.createElement('img');
      image.src = src;
      image.alt = alt;
      element.append(image);
    } else {
      element.classList.add('initials');
      element.textContent = initials;
    }
  };

  const renderAdminAvatar = () => {
    const existing = adminAvatar.querySelector('img');
    if (admin.avatar) {
      const image = existing || document.createElement('img');
      image.src = admin.avatar;
      image.alt = 'Faidrop administrator profile picture';
      if (!existing) adminAvatar.replaceChildren(image);
    } else {
      adminAvatar.textContent = 'FA';
    }
    removeButton.hidden = !admin.avatar;
    label.textContent = admin.avatar ? 'Change admin picture' : 'Add admin picture';
    const navProfile = document.querySelector('.nav-profile');
    if (navProfile) {
      if (admin.avatar) {
        const image = document.createElement('img');
        image.src = admin.avatar;
        image.alt = '';
        navProfile.replaceChildren(image);
      } else {
        navProfile.textContent = 'FA';
      }
    }
  };

  const riderAvatar = document.querySelector('#admin-rider-avatar');
  setAvatar(riderAvatar, rider.avatar || '../assets/marcus-rider.svg', 'Crebello Mark Niel, Faidrop delivery rider', 'CM');
  renderAdminAvatar();

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
      errorMessage.textContent = 'The selected image could not be read. Choose another picture.';
      fileInput.value = '';
    });
    reader.addEventListener('load', () => {
      const source = new Image();
      source.addEventListener('error', () => {
        errorMessage.textContent = 'The selected image could not be opened. Choose another picture.';
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
        const previousAvatar = admin.avatar;
        admin.avatar = canvas.toDataURL('image/jpeg', 0.82);
        if (!window.FaidropData.saveAdminProfile(admin)) {
          if (previousAvatar) admin.avatar = previousAvatar;
          else delete admin.avatar;
          errorMessage.textContent = 'The admin picture could not be saved. Try a smaller image.';
          return;
        }
        renderAdminAvatar();
        window.showToast('Admin profile picture updated.');
      });
      source.src = reader.result;
    });
    reader.readAsDataURL(file);
  });

  removeButton.addEventListener('click', () => {
    delete admin.avatar;
    if (!window.FaidropData.saveAdminProfile(admin)) {
      errorMessage.textContent = 'The admin picture could not be removed. Please try again.';
      return;
    }
    fileInput.value = '';
    errorMessage.textContent = '';
    renderAdminAvatar();
    window.showToast('Admin profile picture removed.');
  });
})();
