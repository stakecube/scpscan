const url = new URL(window.location.href);
const id = url.searchParams.get("id");

// TODO: NFT Search
//const CoinSearchData = [];

let data;

// DOM Renderer optimization
const nftListDiv = document.getElementById('nftList');
const domCollName = document.getElementById('collName');
const domSupply = document.getElementById('totalSupply');
const domMaxSupply = document.getElementById('maxSupply');
const domTotalHolders = document.getElementById('totalHolders');
const domTotalBurns = document.getElementById('totalBurns');

function renderNFTs(query = '') {
  // Collection Name
  domCollName.innerText = data.collectionName;

  // Total Burns (Used for deducting from the total and max supply)
  let nTotalBurns = data.nfts.filter(a => a.owner === null).length;

  // Current Supply
  domSupply.innerText = (data.mints - nTotalBurns).toLocaleString('en-GB') + ' NFTs';
    
  // Max Supply
  domMaxSupply.innerText = (data.maxMints === -1 ? 'Unlimited' : (data.maxMints - nTotalBurns).toLocaleString('en-GB')) + ' NFTs';

  // Total Holders
  const arrOwners = [];

  let strRender = '';
  for (const cNFT of data.nfts) {
    // Don't display burned cards
    if (cNFT.owner !== null) {
      // Make a list of all individual owners
      if (!arrOwners.includes(cNFT.owner)) arrOwners.push(cNFT.owner);
      // Only render if this NFT passes a query (if any!)
      if (query.length && !(cNFT.name.toLowerCase().includes(query) || cNFT.owner.toLowerCase().includes(query) || query.includes(cNFT.id) || query.includes(cNFT.imgUrl))) continue;
      strRender += `
        <div class="col-6 col-md-4 col-lg-3 col-xl-2 mb-4">
          <div class="nft-card" onclick="window.location.href='nft.html?id=${cNFT.id}${getThemeQuery(true)}'" style="background:url('https://cloudflare-ipfs.com/ipfs/${cNFT.imgUrl}'), url('https://ipfs.infura.io:5001/api/v0/cat/${cNFT.imgUrl}'), url('https://ipfs.io/ipfs/${cNFT.imgUrl}') no-repeat; background-position-x: center;">
            <div class="badge nftname">
              ${formatName(cNFT.name, 20)}
            </div>
          </div>
        </div>`;
    }
  }
  nftListDiv.innerHTML = strRender;

  // Total Holders
  domTotalHolders.innerText = arrOwners.length.toLocaleString('en-GB');

  // Total Burns
  domTotalBurns.innerText = nTotalBurns.toLocaleString('en-GB');
}

// Fetch and render the collection!
$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getcollection/' + id, function(res) {
    data = res;
    renderNFTs();
});