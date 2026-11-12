(() => {
  const options = [...document.querySelectorAll('[name="delivery-option"]')];
  if (!options.length) return;
  const shipment = window.FaidropData.shipment();
  const subtotalEl = document.querySelector('[data-subtotal]');
  const feeEl = document.querySelector('[data-fee]');
  const totalEl = document.querySelector('[data-total]');
  const routeEl = document.querySelector('[data-route-summary]');

  // The standard 2.5 kg example totals ₱105: ₱70 parcel + ₱25 delivery + ₱10 service.
  const price = option => {
    const subtotal = Math.round(Number(shipment.weight || 2.5) * 28 * 100) / 100;
    const delivery = option === 'express' ? 65 : 25;
    return { subtotal, delivery, total: subtotal + delivery + 10 };
  };
  const update = () => {
    const selected = options.find(input => input.checked)?.value || 'standard';
    const standard = price('standard').total;
    const express = price('express').total;
    document.querySelector('[data-option-price="standard"]').textContent = window.FaidropData.money(standard);
    document.querySelector('[data-option-price="express"]').textContent = window.FaidropData.money(express);
    const amounts = price(selected);
    subtotalEl.textContent = window.FaidropData.money(amounts.subtotal);
    feeEl.textContent = window.FaidropData.money(amounts.delivery);
    totalEl.textContent = window.FaidropData.money(amounts.total);
    if (routeEl) routeEl.textContent = `${shipment.pickup} → ${shipment.delivery} · ${Number(shipment.weight).toFixed(1)} kg`;
    return { selected, total: amounts.total };
  };
  const savedOption = shipment.option === 'express' ? 'express' : 'standard';
  options.forEach(input => {
    input.checked = input.value === savedOption;
    input.addEventListener('change', update);
  });
  update();
  document.querySelector('#confirm-pricing').addEventListener('click', () => {
    const { selected } = update();
    if (!window.FaidropData.saveShipment({ ...shipment, option: selected })) {
      window.showToast('We could not save your delivery choice. Please try again.');
      return;
    }
    window.location.href = 'payment.html';
  });
})();
