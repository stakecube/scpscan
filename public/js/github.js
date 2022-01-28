const domTitle = document.getElementById('title');
const domRow = document.getElementById('downloadRow');

function getDownloadUrl(assets, os) {
    for (const asset of assets) {
        if (os === 'Windows' && asset.browser_download_url.endsWith('.exe')) return asset.browser_download_url;
        if (os === 'MacOS' && asset.browser_download_url.endsWith('darwin-x64.zip')) return asset.browser_download_url;
        if (os === 'Linux') return 'https://github.com/stakecube/StakeCubeProtocol';
    }
    // If there's no OS match to any GitHub asset, simply redirect to GitHub, something is fishy
    return 'https://github.com/stakecube/StakeCubeProtocol';
}

function download(url) {
    window.open(url);
}

$.getJSON('https://api.github.com/repos/stakecube/StakeCubeProtocol/releases/latest', function(data) {
    domTitle.innerText = data.name;

    // Figure out which OS we're using
    let strName = 'unknown';
    let strImage = '';

    if (isMobile) {
        return domRow.innerHTML = '<h5 style="opacity:0.75;text-align:center;margin-top:12vh;">Mobile is <b>not supported yet</b>!</h5>';
    }

    const OS_Name = navigator.appVersion;
	if (OS_Name.indexOf("Win") != -1) {
		strName = "Windows";
        strImage = "img/win.webp";
	} else if (OS_Name.indexOf("Mac") != -1) {
		strName = "MacOS";
        strImage = "img/mac.png";
	} else if (OS_Name.indexOf("X11") != -1) {
		strName = "Linux";
        strImage = "img/linux.png";
	} else if (OS_Name.indexOf("Linux") != -1) {
		strName = "Linux";
        strImage = "img/linux.png";
	}

    if (strName === 'unknown' || strName === 'Linux') {
        return domRow.innerHTML = `
            <h5 style="opacity:0.75;text-align:center;margin-top:12vh;">
                <b>${strName === 'Linux' ? 'Hey Linux guy! We don\'t offer pre-compiled binaries here.' : 'Unknown OS!'}</b>
                <br>
                <br>
                Check out the <a href="https://github.com/stakecube/StakeCubeProtocol">SCP Wallet repo</a> for our open-source codebase and releases!
            </h5>`;
    }

    domRow.innerHTML = `
        <div style="text-align:center;margin-top:12vh;position:relative;cursor:pointer;width:max-content;margin-left:auto;margin-right:auto;" onclick="download('${getDownloadUrl(data.assets, strName)}')">
            <img src="${strImage}" style="width:8em;">
            <br>
            <button class="btn btn-stakecube" style="margin-top:20px;">Download for ${strName}</button
        </div>`;
});