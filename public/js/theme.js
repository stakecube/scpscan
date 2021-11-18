const opts = new URLSearchParams(document.location.search.substring(1));
const theme = opts.get('theme') || 'light';
let displayType = opts.get('display') || 'portrait';

if (theme === 'dark') {
    // Switch to the dark stylesheet
    document.getElementById('theme').setAttribute('href', 'css/style-dark.css');
}

function swapTheme() {
    if (theme === 'light') {
        if (document.location.href.includes('theme=')) {
            window.location = document.location.href.replace('light', 'dark');
        } else {
            if (document.location.href.includes('?'))
                window.location = document.location.href + '&theme=dark';
            else
                window.location = document.location.href + '?theme=dark';
        }
    } else
    if (theme === 'dark') {
        if (document.location.href.includes('theme=')) {
            window.location = document.location.href.replace('dark', 'light');
        } else {
            if (document.location.href.includes('?'))
                window.location = document.location.href + '&theme=light';
            else
                window.location = document.location.href + '?theme=light';
        }
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

// Here's our trick to evade using cookies for remembering themes... mwahahaha, go away GDPR!
setInterval(() => {
    // Update the theme selector
    if (theme === 'dark') themeBtn.innerText = '☀️';
    // Routinely check the page for links missing the theme specifier
    for (const domLink of document.links) {
        const fLocalDomain = (domLink.href.startsWith('/') || domLink.href.includes('file:') || domLink.href.includes('127.0.0.1') || domLink.href.includes('scpscan.net'));
        // Theme
        if (fLocalDomain && !domLink.href.includes('theme=')) {
            if (domLink.href.includes('?'))
                domLink.href += '&theme=' + theme;
            else
                domLink.href += '?theme=' + theme;
        }
        // Display rotation
        if (fLocalDomain && !domLink.href.includes('display=')) {
            if (domLink.href.includes('?'))
                domLink.href += '&display=' + displayType;
            else
                domLink.href += '?display=' + displayType;
        }
    }
}, 1000);

let themeBtn;
window.onload = () => {
    themeBtn = document.getElementById('themeBtn');
    portBtn = document.getElementById('portraitBtn');
    landBtn = document.getElementById('landscapeBtn');
    // Update the theme selector
    if (theme === 'dark') themeBtn.innerText = '☀️';
    // Update the display
    if (displayType === 'portrait')
        portrait(false);
    else
        landscape(false);
}