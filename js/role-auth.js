(() => {
  const form = document.querySelector('[data-role-auth-form]');
  if (!form) return;

  const role = form.dataset.roleAuthForm;
  const destinations = {
    admin: 'admin-profile.html',
    rider: 'rider-dashboard.html'
  };
  if (!Object.hasOwn(destinations, role)) {
    console.error(`Unsupported role login form: ${role}`);
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required]').forEach(input => {
      const error = input.closest('.form-field')?.querySelector('.form-error');
      const message = input.validity.valueMissing
        ? 'This field is required.'
        : input.validity.typeMismatch
          ? 'Enter a valid email address.'
          : input.validity.tooShort
            ? `Use at least ${input.minLength} characters.`
            : '';
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    if (!valid) return;

    const email = form.elements.email.value.trim();
    const session = {
      email,
      name: role === 'admin' ? 'Faidrop Admin' : 'Crebello Mark Niel',
      signedInAt: new Date().toISOString()
    };
    const save = role === 'admin'
      ? window.FaidropData.saveAdminSession(session)
      : window.FaidropData.saveRiderSession(session);
    if (!save) {
      window.showToast('We could not save your sign-in. Please check browser storage and try again.');
      return;
    }
    window.location.href = destinations[role];
  });

  form.querySelectorAll('input[required]').forEach(input => input.addEventListener('input', () => {
    const error = input.closest('.form-field')?.querySelector('.form-error');
    if (error) error.textContent = '';
  }));
})();
