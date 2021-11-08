const opts = new URLSearchParams(document.location.search.substring(1));
const theme = opts.get('theme');
if (!theme) {
    // Light mode is default, so do nothing
} else if (theme === 'dark') {
    // Switch to the dark stylesheet
    document.getElementById('theme').setAttribute('href', 'css/style-dark.css');
}

function swapTheme() {
    if (!theme || theme === 'light') {
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

// Here's our trick to evade using cookies for remembering themes... mwahahaha, go away GDPR!
if (theme) {
    setInterval(() => {
        // Update the theme selector
        if (theme === 'dark') document.getElementById('themeBtn').innerText = '☀️';
        // Routinely check the page for links missing the theme specifier
        for (const domLink of document.links) {
            const fLocalDomain = (domLink.href.startsWith('/') || domLink.href.includes('file:') || domLink.href.includes('scpscan.net'));
            if (fLocalDomain && !domLink.href.includes('theme=')) {
                if (domLink.href.includes('?'))
                    domLink.href += '&theme=' + theme;
                else
                    domLink.href += '?theme=' + theme;
            }
        }
    }, 1000);
}

window.onload = () => {
    // Update the theme selector
    if (theme === 'dark') document.getElementById('themeBtn').innerText = '☀️';
}