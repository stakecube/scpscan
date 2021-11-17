const url = new URL(window.location.href);
const id = url.searchParams.get("id");

// DOM Renderer optimization
const nftName = document.getElementById('nftName');
const nftMintCount = document.getElementById('nftMintCount');
const nftImg = document.getElementById('nftImg');
const nftId = document.getElementById('nftId');
const nftIpfsCid = document.getElementById('nftIpfsCid');
const nftAddr = document.getElementById('nftAddr');
const activityList = document.getElementById('activityList').getElementsByTagName('tbody')[0];

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getnft/' + id, (data) => {
    // NFT name
    nftName.innerText = isMobile ? formatName(data.name, 20) : data.name;
    // Image
    nftImg.style.background = `url('https://cloudflare-ipfs.com/ipfs/${data.imgUrl}'), url('https://ipfs.infura.io:5001/api/v0/cat/${data.imgUrl}'), url('https://ipfs.io/ipfs/${data.imgUrl}') no-repeat center center`;
    // ID
    nftId.innerText = data.nft;
    // IPFS CID
    nftIpfsCid.innerText = data.imgUrl;
    // Address
    nftAddr.innerText = data.owner;

    // Activity
    for (const cAction of data.activity.reverse()) {
      const row = activityList.insertRow();

      const nftTx = row.insertCell();
      nftTx.innerHTML = formatName(cAction.tx, isMobile ? 5 : 20);
      
      const nftType = row.insertCell();
      nftType.innerHTML = `<div class="badge bg-danger" style="text-transform:capitalize;">${cAction.type}</div>`;
      
      const nftFrom = row.insertCell();
      nftFrom.innerHTML = formatName(cAction.from === null ? 'Mint' : cAction.from, isMobile ? 5 : 10);
      
      const nftTo = row.insertCell();
      nftTo.innerHTML = formatName(cAction.to === null ? 'Burn' : cAction.to, isMobile ? 5 : 10);
      
      const nftBlock = row.insertCell();
      nftBlock.innerHTML = cAction.block.toLocaleString('en-GB');
    }

    $.getJSON('https://stakecubecoin.net/web3/scp/tokens/getcollection/' + data.collection, (collData) => {
        const nBurned = collData.nfts.reduce((a, b) => a + (b.owner === null ? 1 : 0), 0);
        const mintPos = collData.nfts.filter(a => a.owner !== null).findIndex(a => a.id === data.nft) + 1;
        const maxPos = collData.nfts.length - nBurned;
        nftMintCount.innerHTML = '<b>#' + mintPos.toLocaleString('en-GB') + '</b><b style="opacity: 0.75">/' + maxPos + '</b>';
    });
});