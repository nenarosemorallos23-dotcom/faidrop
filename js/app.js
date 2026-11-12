(() => {
  const page = document.body.dataset.page || 'login';
  const authPages = ['login', 'signup', 'forgot-password', 'admin-login', 'rider-login'];
  const customerPages = ['home', 'home-v2', 'shipments', 'create-shipment', 'pricing', 'payment', 'payment-success', 'shipment-created', 'tracking', 'contact-rider', 'rate-rider', 'profile'];
  const riderPages = ['rider-dashboard', 'rider-profile'];
  const path = name => authPages.includes(name) || name === '404' ? `${name}.html` : `${name}.html`;
  const logo = `<svg class="brand-cube" viewBox="0 0 40 40" aria-hidden="true"><path fill="#b0124f" d="M20 2 37 11.5v17L20 38 3 28.5v-17L20 2Zm0 4.1-11.2 6.3L20 18.7l11.2-6.3L20 6.1ZM7 16v10.2l11 6.1V22.1L7 16Zm15 16.3 11-6.1V16l-11 6.1v10.2Z"/><path fill="#fff" d="m11 12.4 11.1 6.2 3.2-1.8-11.2-6.3-3.1 1.9Z"/></svg>`;
  const header = document.querySelector('#site-header');
  if (header && !authPages.includes(page)) {
    const isAdmin = page === 'admin-profile';
    const isRider = ['rider-dashboard', 'rider-profile'].includes(page);
    const brandPage = isAdmin ? 'admin-profile.html' : isRider ? 'rider-dashboard.html' : path('home');
    const navLinks = isAdmin
      ? `<a class="nav-link ${page === 'admin-profile' ? 'active' : ''}" href="admin-profile.html#rider-updates">Rider Updates</a>`
      : isRider
        ? `<a class="nav-link ${page === 'rider-dashboard' ? 'active' : ''}" href="rider-dashboard.html">Dashboard</a>`
        : `<a class="nav-link ${(page === 'home' || page === 'home-v2') ? 'active' : ''}" href="${path('home')}"><span class="nav-icon" aria-hidden="true">⌂</span> Home</a><a class="nav-link ${page === 'shipments' ? 'active' : ''}" href="${path('shipments')}"><span class="nav-icon" aria-hidden="true">▣</span> Shipments</a>`;
    const profilePage = isAdmin ? 'admin-profile.html' : isRider ? 'rider-profile.html' : 'profile.html';
    header.className = 'site-header';
    header.innerHTML = `<nav class="nav-inner" aria-label="Main navigation"><a class="brand" href="${brandPage}" aria-label="Faidrop home">${logo}<span>Faidrop</span></a><div class="nav-links">${navLinks}<a class="nav-profile active" href="${profilePage}" aria-label="Profile">NM</a></div></nav>`;
    const user = isAdmin
      ? { name: 'Faidrop Admin', ...window.FaidropData.adminProfile() }
      : isRider
        ? { name: 'Crebello Mark Niel', ...window.FaidropData.riderProfile() }
        : window.FaidropData.user();
    const profileLink = header.querySelector('.nav-profile');
    if (user && profileLink) {
      profileLink.textContent = user.name?.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'NM';
      if (user.avatar) {
        const avatar = document.createElement('img');
        avatar.src = user.avatar;
        avatar.alt = '';
        profileLink.replaceChildren(avatar);
      }
    }
  }
  const footer = document.querySelector('#site-footer');
  if (footer) footer.innerHTML = '© 2026 Faidrop · Delivering with care across Northern Samar';

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);
  let toastTimer;
  window.showToast = message => {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3000);
  };

  if (customerPages.includes(page) && !window.FaidropData.user()) {
    window.location.replace(path('login'));
    return;
  }
  if (riderPages.includes(page) && !window.FaidropData.riderSession()) {
    window.location.replace(path('rider-login'));
    return;
  }
  if (page === 'admin-profile' && !window.FaidropData.adminSession()) {
    window.location.replace(path('admin-login'));
    return;
  }

  document.addEventListener('click', event => {
    const roleLogout = event.target.closest('[data-role-logout]');
    if (roleLogout) {
      const role = roleLogout.dataset.roleLogout;
      if (role === 'admin') {
        localStorage.removeItem(window.FaidropData.keys.adminSession);
        window.location.href = path('admin-login');
      } else if (role === 'rider') {
        localStorage.removeItem(window.FaidropData.keys.riderSession);
        window.location.href = path('rider-login');
      }
      return;
    }
    const logout = event.target.closest('[data-logout]');
    if (logout) {
      localStorage.removeItem(window.FaidropData.keys.user);
      window.location.href = path('login');
      return;
    }
    const toastLink = event.target.closest('[data-toast]');
    if (toastLink) {
      event.preventDefault();
      window.showToast(toastLink.dataset.toast);
    }
  });

  const form = document.querySelector('[data-auth-form]');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const inputs = [...form.querySelectorAll('input[required]')];
      let valid = true;
      inputs.forEach(input => {
        const error = input.closest('.form-field')?.querySelector('.form-error');
        const message = input.validity.valueMissing ? 'This field is required.' : input.validity.typeMismatch ? 'Enter a valid email address.' : input.validity.tooShort ? `Use at least ${input.minLength} characters.` : '';
        if (error) error.textContent = message;
        if (message) valid = false;
      });
      if (!valid) return;
      if (page === 'forgot-password') {
        window.showToast('If that email is registered, a reset link is on its way.');
        window.setTimeout(() => { window.location.href = path('login'); }, 1800);
        return;
      }
      const name = form.elements.name?.value.trim() || window.FaidropData.defaults.name;
      const email = form.elements.email.value.trim();
      if (window.FaidropData.saveUser({ name, email })) window.location.href = path('home');
      else window.showToast('We could not save your sign-in. Please check your browser storage and try again.');
    });
    form.querySelectorAll('input[required]').forEach(input => input.addEventListener('input', () => {
      const error = input.closest('.form-field')?.querySelector('.form-error');
      if (error) error.textContent = '';
    }));
  }

  document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => {
    window.showToast(`${button.dataset.social} sign-in is coming soon.`);
  }));
})();
