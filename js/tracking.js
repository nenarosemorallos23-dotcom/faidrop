(() => {
  const container = document.querySelector('#tracking-map');
  if (!container) return;
  let attempts = 0;
  const initialize = () => {
    if (!window.L) {
      attempts += 1;
      if (attempts >= 20) {
        container.innerHTML = '<div class="map-placeholder"><span>Map could not load. Check your internet connection and refresh.</span></div>';
        return;
      }
      window.setTimeout(initialize, 250);
      return;
    }
    const allen = [12.502, 124.29];
    const uep = [12.278, 124.99];
    const map = window.L.map(container, { scrollWheelZoom: false });
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);
    const route = window.L.polyline([allen, [12.44, 124.52], [12.36, 124.77], uep], {
      color: '#b0124f', weight: 5, opacity: .8, dashArray: '9 8'
    }).addTo(map);
    window.L.marker(allen).addTo(map).bindPopup('Pickup · Allen Terminal');
    window.L.marker(uep).addTo(map).bindPopup('Delivery · UEP Zone 3');
    route.addTo(map);
    map.fitBounds(route.getBounds(), { padding: [28, 28] });
  };
  initialize();
})();
