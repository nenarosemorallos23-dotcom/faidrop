(() => {
  const shipment = window.FaidropData.shipment();
  const payment = window.FaidropData.payment();
  const total = (Number(shipment.weight || 2.5) * 28) + (shipment.option === 'express' ? 65 : 25) + 10;
  const money = window.FaidropData.money(total);
  const methodRadios = [...document.querySelectorAll('[name="payment-method"]')];
  if (methodRadios.length) {
    methodRadios.forEach(radio => {
      radio.checked = radio.value === payment.method;
      radio.addEventListener('change', () => {
        payment.method = radio.value;
        window.FaidropData.savePayment(payment);
      });
    });
    const pickupName = shipment.pickup.split(',').pop().trim();
    const deliveryName = shipment.delivery.split(',').pop().trim();
    document.querySelector('[data-summary-option]').textContent = shipment.option === 'express' ? 'Express' : 'Standard';
    document.querySelector('[data-summary-pickup]').textContent = pickupName;
    document.querySelector('[data-summary-delivery]').textContent = deliveryName;
    document.querySelector('[data-summary-total]').textContent = money;
    const payButton = document.querySelector('#pay-now');
    payButton.textContent = `Pay Now · ${money}`;
    payButton.addEventListener('click', () => {
      payment.method = methodRadios.find(radio => radio.checked)?.value || 'GCash';
      if (!window.FaidropData.savePayment(payment)) {
        window.showToast('We could not save your payment choice. Please try again.');
        return;
      }
      window.location.href = 'payment-success.html';
    });
  }
  const paid = document.querySelector('[data-paid]');
  if (paid) {
    paid.textContent = money;
    document.querySelector('[data-method]').textContent = payment.method;
  }
})();
