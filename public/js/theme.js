const opts = new URLSearchParams(document.location.search.substring(1));
const theme = opts.get('theme') || 'light';

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

function getThemeQuery(addon = false) {
    return (addon ? '&' : '?') + 'theme=' + theme;
}

// Here's our trick to evade using cookies for remembering themes... mwahahaha, go away GDPR!
setInterval(() => {
    // Update the theme selector
    if (theme === 'dark') themeBtn.innerText = '☀️';
    // Routinely check the page for links missing the theme specifier
    for (const domLink of document.links) {
        const fLocalDomain = (domLink.href.startsWith('/') || domLink.href.includes('file:') || domLink.href.includes('127.0.0.1') || domLink.href.includes('scpscan.net'));
        if (fLocalDomain && !domLink.href.includes('theme=')) {
            if (domLink.href.includes('?'))
                domLink.href += '&theme=' + theme;
            else
                domLink.href += '?theme=' + theme;
        }
    }
}, 1000);

let themeBtn;
window.onload = () => {
    themeBtn = document.getElementById('themeBtn');
    // Update the theme selector
    if (theme === 'dark') themeBtn.innerText = '☀️';
}