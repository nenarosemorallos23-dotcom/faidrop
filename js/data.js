window.FaidropData = (() => {
  const keys = {
    user: 'faidropUser',
    adminSession: 'faidropAdminSession',
    adminProfile: 'faidropAdminProfile',
    riderSession: 'faidropRiderSession',
    riderProfile: 'faidropRiderProfile',
    shipment: 'faidropShipment',
    shipments: 'faidropShipments',
    payment: 'faidropPayment',
    rating: 'faidropRating'
  };
  const defaults = {
    name: 'Neña M.',
    email: 'nena@example.com',
    phone: '+63 917 555 0142',
    parcel: 'Documents',
    weight: 2.5,
    pickup: 'Allen Terminal, Allen',
    delivery: 'UEP Zone 3, Catarman',
    option: 'standard',
    payment: 'GCash'
  };
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (error) { console.error(`Unable to read ${key} from local storage.`, error); return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { console.error(`Unable to save ${key} to local storage.`, error); return false; }
  };
  return {
    keys, defaults,
    user: () => read(keys.user, null),
    adminSession: () => read(keys.adminSession, null),
    adminProfile: () => read(keys.adminProfile, {}),
    riderSession: () => read(keys.riderSession, null),
    riderProfile: () => read(keys.riderProfile, {}),
    shipment: () => ({ ...defaults, ...read(keys.shipment, {}) }),
    payment: () => read(keys.payment, { method: defaults.payment }),
    shipments: () => read(keys.shipments, []),
    addShipment: shipment => {
      const shipments = read(keys.shipments, []);
      if (shipments.some(item => item.trackingId === shipment.trackingId)) return true;
      return write(keys.shipments, [shipment, ...shipments]);
    },
    saveShipment: value => write(keys.shipment, value),
    savePayment: value => write(keys.payment, value),
    saveUser: value => write(keys.user, value),
    saveAdminSession: value => write(keys.adminSession, value),
    saveAdminProfile: value => write(keys.adminProfile, value),
    saveRiderSession: value => write(keys.riderSession, value),
    saveRiderProfile: value => write(keys.riderProfile, value),
    saveRating: value => write(keys.rating, value),
    money: amount => `₱${Number(amount).toFixed(2)}`
  };
})();
