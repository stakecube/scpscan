const opts = new URLSearchParams(document.location.search.substring(1));
let theme = localStorage.getItem("theme");
let displayType = opts.get('display') || 'portrait';

if (theme === 'dark') {
  // Switch to the dark stylesheet
  document.getElementById('theme').setAttribute('href', 'css/style-dark.css');
}

function swapTheme() {
  if (theme === 'light') {
    document.getElementById('theme').setAttribute('href', 'css/style-dark.css');
    localStorage.setItem("theme","dark");
    themeBtn.innerText = '☀️';
    theme = 'dark';
  } else {
    document.getElementById('theme').setAttribute('href', 'css/style-light.css');
    localStorage.setItem("theme","light");
    themeBtn.innerText = '🌙';
    theme = 'light';
  }
}

let portBtn;
let landBtn;

function portrait(reload = true) {
  displayType = 'portrait';
  // Dull out the clicked button
  portBtn.style['background-color'] = '#0094f6c7';
  portBtn.style.cursor = 'default';
  // Brighten up the other one
  landBtn.style['background-color'] = '#0094f645';
  landBtn.style.cursor = 'pointer';
  // Re-render cards
  renderNFTs(document.getElementById('searchInput').value.replace(/ /g, ' ').toLowerCase());
  // Set location href
  opts.set('display', displayType);
  if (reload) location.href = '?' + opts.toString();
}

function landscape(reload = true) {
  displayType = 'landscape';
  // Dull out the clicked button
  landBtn.style['background-color'] = '#0094f6c7';
  landBtn.style.cursor = 'default';
  // Brighten up the other one
  portBtn.style['background-color'] = '#0094f645';
  portBtn.style.cursor = 'pointer';
  // Re-render cards
  renderNFTs(document.getElementById('searchInput').value.replace(/ /g, ' ').toLowerCase());
  // Set location href
  opts.set('display', displayType);
  if (reload) location.href = '?' + opts.toString();
}

function getAllAddonSettings() {
  return '&theme=' + theme + '&display=' + displayType;
}

function getDisplayType() {
  return displayType;
}

let themeBtn;
window.onload = () => {
  themeBtn = document.getElementById('themeBtn');
  portBtn = document.getElementById('portraitBtn');
  landBtn = document.getElementById('landscapeBtn');
  // Update the theme selector
  if (theme === 'dark') themeBtn.innerText = '☀️';
  // Update the display (if applicable)
  if (portBtn) {
    if (displayType === 'portrait')
      portrait(false);
    else
      landscape(false);
  }
}