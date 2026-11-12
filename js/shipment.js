(() => {
  const form = document.querySelector('#shipment-form');
  if (form) {
    const saved = window.FaidropData.shipment();
    form.elements.parcel.value = saved.parcel;
    form.elements.weight.value = saved.weight;
    form.elements.pickup.value = saved.pickup;
    form.elements.delivery.value = saved.delivery;
    form.addEventListener('submit', event => {
      event.preventDefault();
      let valid = true;
      [...form.querySelectorAll('[required]')].forEach(input => {
        const error = input.closest('.form-field')?.querySelector('.form-error');
        let message = '';
        if (!input.value.trim()) message = 'Please complete this field.';
        else if (input.name === 'weight' && (Number(input.value) < .1 || Number(input.value) > 30)) message = 'Enter a weight from 0.1 to 30 kg.';
        if (error) error.textContent = message;
        if (message) valid = false;
      });
      if (!valid) return;
      const shipment = {
        ...window.FaidropData.shipment(),
        parcel: form.elements.parcel.value.trim(),
        weight: Number(form.elements.weight.value),
        pickup: form.elements.pickup.value,
        delivery: form.elements.delivery.value,
        option: 'standard'
      };
      delete shipment.trackingId;
      if (!window.FaidropData.saveShipment(shipment)) {
        window.showToast('We could not save your shipment. Please check your browser storage and try again.');
        return;
      }
      window.location.href = 'pricing.html';
    });
  }

  const trackingNumber = document.querySelector('[data-tracking-number]');
  if (trackingNumber) {
    const shipment = window.FaidropData.shipment();
    const payment = window.FaidropData.payment();
    const id = shipment.trackingId || `FD${Date.now().toString(36).toUpperCase()}`;
    shipment.trackingId = id;
    const sender = window.FaidropData.user()?.name || shipment.name;
    const record = {
      trackingId: id,
      sender,
      parcel: shipment.parcel,
      weight: shipment.weight,
      pickup: shipment.pickup,
      delivery: shipment.delivery,
      option: shipment.option,
      payment: payment.method,
      status: 'pickup',
      createdAt: new Date().toISOString()
    };
    if (!window.FaidropData.saveShipment(shipment) || !window.FaidropData.addShipment(record)) {
      window.showToast('Shipment details could not be saved to My Shipments. Please try again.');
    }
    trackingNumber.textContent = id;
    document.querySelector('[data-sender]').textContent = sender;
    document.querySelector('[data-receiver]').textContent = shipment.delivery;
    const paymentField = document.querySelector('[data-created-payment]');
    if (paymentField) paymentField.textContent = payment.method;
  }

  const shipmentList = document.querySelector('.shipment-list');
  if (shipmentList) {
    window.FaidropData.shipments().forEach(shipment => {
      const row = document.createElement('article');
      row.className = 'shipment-row';
      row.dataset.status = shipment.status;

      const details = document.createElement('div');
      const route = document.createElement('div');
      route.className = 'route';
      const pickup = document.createElement('span');
      pickup.textContent = shipment.pickup.split(',').pop().trim();
      const arrow = document.createElement('span');
      arrow.className = 'route-arrow';
      arrow.textContent = '→';
      const delivery = document.createElement('span');
      delivery.textContent = shipment.delivery;
      route.append(pickup, arrow, delivery);

      const meta = document.createElement('div');
      meta.className = 'shipment-meta';
      const id = document.createElement('span');
      id.className = 'shipment-id';
      id.textContent = shipment.trackingId;
      const date = shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : '';
      meta.append(id, document.createTextNode(` · ${date} · ${shipment.parcel}`));
      details.append(route, meta);

      const actions = document.createElement('div');
      actions.className = 'shipment-actions';
      const badge = document.createElement('span');
      badge.className = 'badge badge-red';
      badge.textContent = '● Pickup scheduled';
      const trackLink = document.createElement('a');
      trackLink.className = 'button button-secondary';
      trackLink.href = 'tracking.html';
      trackLink.textContent = 'Track parcel';
      actions.append(badge, trackLink);
      row.append(details, actions);
      shipmentList.prepend(row);
    });
  }

  const tabs = [...document.querySelectorAll('[data-filter]')];
  if (tabs.length) {
    const rows = [...document.querySelectorAll('.shipment-row[data-status]')];
    const empty = document.querySelector('[data-empty]');
    const counts = {
      all: rows.length,
      transit: rows.filter(row => row.dataset.status === 'transit').length,
      delivered: rows.filter(row => row.dataset.status === 'delivered').length
    };
    Object.entries(counts).forEach(([status, count]) => {
      const countElement = document.querySelector(`[data-count="${status}"]`);
      if (countElement) countElement.textContent = count;
    });
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(item => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      let visible = 0;
      rows.forEach(row => {
        const show = tab.dataset.filter === 'all' || row.dataset.status === tab.dataset.filter;
        row.hidden = !show;
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
    }));
  }

  document.querySelectorAll('[data-job]').forEach(button => button.addEventListener('click', () => {
    const accepted = button.textContent.includes('Accept');
    button.textContent = accepted ? 'Pickup accepted' : button.textContent.includes('Mark delivered') ? 'Delivered ✓' : 'Delivery details opened';
    button.disabled = accepted || button.textContent.startsWith('Delivered');
    window.showToast(`${button.dataset.job}: ${accepted ? 'pickup accepted' : 'job updated'}.`);
  }));
})();
