// Runs before first paint so an explicit light/dark choice never flashes the system theme.
(function () {
  try {
    var choice = localStorage.getItem('vxcv-theme');
    if (choice === 'light' || choice === 'dark') {
      document.documentElement.setAttribute('data-theme', choice);
    }
  } catch (e) {}
})();
