(() => {
  const photoInput = document.querySelector('#rider-profile-photo');
  const avatar = document.querySelector('#rider-profile-avatar');
  const removeButton = document.querySelector('#remove-rider-photo');
  const errorMessage = document.querySelector('#rider-photo-error');
  const fallbackImage = '../assets/marcus-rider.svg';
  const rider = window.FaidropData.riderProfile();

  const updateRiderPhotos = () => {
    const profileImage = rider.avatar || fallbackImage;
    const mainImage = avatar?.querySelector('img');
    if (mainImage) mainImage.src = profileImage;
    document.querySelectorAll('.rider-photo').forEach(image => {
      image.src = profileImage;
    });
    if (removeButton) removeButton.hidden = !rider.avatar;
    const uploadLabel = document.querySelector('label[for="rider-profile-photo"]');
    if (uploadLabel) uploadLabel.textContent = rider.avatar ? 'Change rider picture' : 'Add rider picture';
  };

  updateRiderPhotos();
  if (!photoInput || !avatar || !removeButton || !errorMessage) return;

  photoInput.addEventListener('change', () => {
    errorMessage.textContent = '';
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      errorMessage.textContent = 'Choose an image file.';
      photoInput.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.textContent = 'Choose an image smaller than 5 MB.';
      photoInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('error', () => {
      errorMessage.textContent = 'The selected image could not be read. Choose another picture.';
      photoInput.value = '';
    });
    reader.addEventListener('load', () => {
      const source = new Image();
      source.addEventListener('error', () => {
        errorMessage.textContent = 'The selected image could not be opened. Choose another picture.';
        photoInput.value = '';
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
        const previousAvatar = rider.avatar;
        rider.avatar = canvas.toDataURL('image/jpeg', 0.82);
        if (!window.FaidropData.saveRiderProfile(rider)) {
          if (previousAvatar) rider.avatar = previousAvatar;
          else delete rider.avatar;
          errorMessage.textContent = 'The rider picture could not be saved. Try a smaller image.';
          return;
        }
        updateRiderPhotos();
        window.showToast('Rider profile picture updated.');
      });
      source.src = reader.result;
    });
    reader.readAsDataURL(file);
  });

  removeButton.addEventListener('click', () => {
    delete rider.avatar;
    if (!window.FaidropData.saveRiderProfile(rider)) {
      errorMessage.textContent = 'The rider picture could not be removed. Please try again.';
      return;
    }
    photoInput.value = '';
    errorMessage.textContent = '';
    updateRiderPhotos();
    window.showToast('Default rider illustration restored.');
  });
})();
