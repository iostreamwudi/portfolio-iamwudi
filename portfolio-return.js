(() => {
  const returnUrl = '/?portfolio-return=20260910#work';

  // The case page is a Next.js page. Capture the return click before its
  // router handler so the portfolio homepage is loaded fresh.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href*="#work"]');
    if (!link) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(new URL(returnUrl, window.location.origin).href);
  }, true);
})();
