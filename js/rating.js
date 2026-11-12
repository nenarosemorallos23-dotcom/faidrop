(() => {
  const form = document.querySelector('#rating-form');
  if (!form) return;
  const stars = [...form.querySelectorAll('[data-rating]')];
  const submit = document.querySelector('#submit-rating');
  const error = document.querySelector('#rating-error');
  let rating = 0;
  const select = value => {
    rating = value;
    stars.forEach(star => {
      const selected = Number(star.dataset.rating) <= rating;
      star.classList.toggle('selected', selected);
      star.setAttribute('aria-checked', String(Number(star.dataset.rating) === rating));
    });
    submit.disabled = rating === 0;
    error.textContent = '';
  };
  stars.forEach((star, index) => {
    star.addEventListener('click', () => select(Number(star.dataset.rating)));
    star.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = Math.min(5, Math.max(1, (rating || index + 1) + direction));
        select(next);
        stars[next - 1].focus();
      }
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!rating) {
      error.textContent = 'Choose a star rating before submitting.';
      return;
    }
    if (!window.FaidropData.saveRating({ rating, comment: form.elements.comment.value.trim(), rider: 'Crebello Mark Niel' })) {
      window.showToast('Your rating could not be saved. Please try again.');
      return;
    }
    window.showToast('Thanks for rating your Faidrop rider!');
    window.setTimeout(() => { window.location.href = 'home.html'; }, 1000);
  });
})();
