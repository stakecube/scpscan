// TODO: Collection Search
//const CoinSearchData = [];

// DOM Renderer optimization
const tbodyRef = document.getElementById('collectionsTable').getElementsByTagName('tbody')[0];
const domTotalNftsMinted = document.getElementById('totalNftsMinted');
const domTotalNftsBurned = document.getElementById('totalNftsBurned');
const domPopularColl = document.getElementById('popularColl');
const totalTokens = document.getElementById('totalTokens');

let data;

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getallcollectionheaders', (res) => {
    data = res;
    renderCollections();
    $.getJSON('https://stakecube.io/api/v2/marketplace/collectionVerified', (arrVerified) => {
      for (const cVerif of arrVerified.result) {
        if (cVerif.verified !== 1) continue;
        data.find(a => a.contract === cVerif.contract).verified = true;
      }
      renderCollections();
    });
});

function renderCollections() {
  tbodyRef.innerHTML = '';
  domPopularColl.innerHTML = '';

  // Update total tokens
  const dataLen = data.length;
  totalTokens.innerHTML = dataLen.toLocaleString('en-GB');

  let nTotalMints = 0;
  let nTotalBurns = 0;

  // --- DISTRO CALCULATIONS ---
  // Sort the data by distribution
  data = _.sortBy(data, [(a) => -((a.totalNFTs - a.burnedNFTs) > 0 ? percentOf(a.holders, a.totalNFTs - a.burnedNFTs) : 0)]);
  data.map(a => a.distroRank = (data.findIndex(b => b.index === a.index) + 1));

  // --- TX CALCULATIONS ---
  // Sort the data by TX velocity (Total TXs divided by Holders)
  data = _.sortBy(data, [(a) => -(((a.totalTXs - a.mints) * a.holders) / (a.totalNFTs - a.burnedNFTs))]);
  data.map(a => a.velocityRank = (data.findIndex(b => b.index === a.index) + 1));

  // --- AGE CALCULATIONS ---
  // Sort the data by age
  data = _.sortBy(data, [(a) => -a.age.blocks]);
  data.map(a => a.ageRank = (data.findIndex(b => b.index === a.index) + 1));

  // --- COMPLETENESS CALCULATIONS ---
  // Sort the data by completeness (the percentage of the supply minted to the max supply)
  data = _.sortBy(data, [(a) => -percentOf(a.totalNFTs - a.burnedNFTs, a.maxMints - a.burnedNFTs)]);
  data.map(a => a.completeRank = (data.findIndex(b => b.index === a.index) + 1));

  // Ensure that complete-tied ranks share the same rank
  let i = 1; 
  for (i = 1; i < dataLen; i++) {
    const a = data[i];
    const b = data[i - 1];
    if (percentOf(a.totalNFTs - a.burnedNFTs, a.maxMints - a.burnedNFTs) ===
        percentOf(b.totalNFTs - b.burnedNFTs, b.maxMints - b.burnedNFTs)) {
      b.completeRank = a.completeRank;
    }
  }

  // --- GLOBAL RANKING ---
  // Sort the data by all rankings multiplied by eachother
  data = _.sortBy(data, [(a) => (a.distroRank * a.velocityRank * a.ageRank * a.completeRank * (a.verified ? 1 : 2))]);

  i = 0;
  for (const cColl of data) {
    // Token variables
    const nSupply = cColl.totalNFTs - cColl.burnedNFTs;
    const nMaxMints = cColl.maxMints - cColl.burnedNFTs;

    // Add our stats
    nTotalMints += cColl.mints;
    nTotalBurns += cColl.burnedNFTs;
    
    // Token's row
    const row = tbodyRef.insertRow();

    // Index
    const tokenNo = row.insertCell();
    tokenNo.innerHTML = `<span class="tableNo">${i + 1}</span>`;
    tokenNo.style.verticalAlign = 'middle';

    // Notes
    const tokenNotes = row.insertCell();
    // --- Verification Status
    let strNotes = '';
    if (cColl.verified) strNotes += '<span title="This Collection has been verified by StakeCube!">✔️</span>';
    // --- Quality Medals
    if (i === 0) strNotes += '<span title="This Collection has exceptional properties!">🥇</span>';
    else if (i === 1) strNotes += '<span title="This Collection has great properties!">🥈</span>';
    else if (i === 2) strNotes += '<span title="This Collection has good properties!">🥉</span>';
    tokenNotes.innerHTML = `<span style="cursor:pointer;" class="tableNo">${strNotes}</span>`;
    tokenNotes.style.verticalAlign = 'middle';

    if (i === 0) domPopularColl.innerHTML += strNotes;

    // Name
    const tokenName = row.insertCell();
    tokenName.innerHTML = `<a style="text-decoration: none" title="${cColl.collectionName}" href="nfts.html?id=${cColl.contract}">${formatName(cColl.collectionName, isMobile ? 9 : 30)}</a><br><span class="scpVersion">SCP-${cColl.version}</span>`;

    // Supply
    const tokenSupply = row.insertCell();
    const fInfiniteSupply = cColl.maxMints === -1;
    const tokenSupplyPct = fInfiniteSupply ? -1 : (percentOf(nSupply, nMaxMints).toFixed(isMobile ? 1 : 2) + '%');
    const fDestroyed = nMaxMints === 0;
    if (fDestroyed) {
      tokenSupply.innerText = (isMobile ? 'Coll.' : 'Collection') + ' was destroyed';
    } else {
      tokenSupply.innerHTML = `${nHTML(nSupply, isMobile ? 2 : (nSupply > 100 ? 4 : 8))}${fInfiniteSupply ? '' : '<br style="margin-bottom: 5px;"><span style="margin-right:5px;cursor:pointer;' + (isMobile ? 'margin-bottom:5px;' : '\'\'') + '" class="badge bg-info-new" title="' + tokenSupplyPct + ' of the total supply has been minted!">' + tokenSupplyPct + '</span>'}`;
    }
    if (fInfiniteSupply || fDestroyed) tokenSupply.style.verticalAlign = 'middle';
    if (fDestroyed) tokenSupply.style.opacity = '0.75';

    // Max Mints
    const tokenMaxMints = row.insertCell();
    tokenMaxMints.innerText = `${fInfiniteSupply ? 'Unlimited' : formatAmount(nMaxMints)}`;
    tokenMaxMints.setAttribute('title', fInfiniteSupply ? 'This collection does not have a cap, unlimited NFTs can be issued by it\'s creator!' : 'Only ' + nMaxMints.toLocaleString('en-GB') + ' NFTs can be minted maximum!')
    tokenMaxMints.style.verticalAlign = 'middle';

    // Max Mints
    const tokenProtected = row.insertCell();
    tokenProtected.innerHTML = `<b>${(cColl.protected ? 'Yes' : 'No')}</b>`;
    tokenProtected.setAttribute('title', 'These NFTs ' + (cColl.protected ? 'cannot' : 'can') + ' be burned!');
    tokenProtected.style.verticalAlign = 'middle';

    i++;
  }

  // Total Mints
  domTotalNftsMinted.innerText = nTotalMints.toLocaleString('en-GB');

  // Total Burns
  domTotalNftsBurned.innerText = nTotalBurns.toLocaleString('en-GB');

  // Most Popular Collection
  domPopularColl.innerHTML += formatName(data[0].collectionName, 20);
  domPopularColl.setAttribute('href', 'nfts.html?id=' + data[0].contract);
}