# Faidrop

A responsive, multi-page parcel delivery website concept for Northern Samar. It uses plain HTML, CSS, and vanilla JavaScript; there is no build step.

## Run in VS Code

1. Open the `faidrop` folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The landing page redirects to Login. Sign up or enter any valid email and a password of at least six characters to preview the logged-in pages.

Google Fonts and the Leaflet/OpenStreetMap map use online resources, so those parts need an internet connection.

## Pages

- **Authentication:** `login.html`, `signup.html`, `forgot-password.html`
- **Role login:** `rider-login.html`, `admin-login.html`
- **Dashboard:** `home.html`, `home-v2.html`, `shipments.html`
- **Create and pay:** `create-shipment.html`, `pricing.html`, `payment.html`, `payment-success.html`, `shipment-created.html`
- **Delivery:** `tracking.html`, `contact-rider.html`, `rate-rider.html`
- **Account:** `profile.html`, `rider-dashboard.html`, `rider-profile.html`, `admin-profile.html`
- **Fallback:** `404.html`

The app stores customer, rider, admin, shipment, payment, and rider-rating demo data in browser localStorage. Customer, rider, and admin profiles and login sessions are separate in this demo. Rider and admin demo logins accept any valid email and a password of at least six characters; credentials are not authenticated by a server. This static prototype does not provide production role-based authentication or server-side access control.
