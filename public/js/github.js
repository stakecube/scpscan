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
    let isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }

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
        <div style="text-align:center;top:12vh;position:relative;cursor:pointer;width:max-content;margin-left:auto;margin-right:auto;" onclick="download('${getDownloadUrl(data.assets, strName)}')">
            <img src="${strImage}" style="width:12em;">
            <br>
            <h5 href="/" style="padding:10px;color:#006286;">Download for <b>${strName}</b></h5>
        </div>`;
});