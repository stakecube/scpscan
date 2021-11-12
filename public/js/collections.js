// TODO: Collection Search
//const CoinSearchData = [];

// DOM Renderer optimization
const tbodyRef = document.getElementById('collectionsTable').getElementsByTagName('tbody')[0];
const domTotalNftsMinted = document.getElementById('totalNftsMinted');
const domTotalNftsBurned = document.getElementById('totalNftsBurned');
const domPopularColl = document.getElementById('popularColl');
const totalTokens = document.getElementById('totalTokens');

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getallcollectionheaders', function(data) {
    // Update total tokens
    totalTokens.innerHTML = data.length.toLocaleString('en-GB');

    let nTotalMints = 0;
    let nTotalBurns = 0;

    let i = 0;
    for (const cColl of data.sort((a, b) => (b.totalNFTs - b.burnedNFTs) - (a.totalNFTs - a.burnedNFTs))) {
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

      // Name
      const tokenName = row.insertCell();
      tokenName.innerHTML = `<a style="text-decoration: none" title="${cColl.collectionName}" href="nfts.html?id=${cColl.contract}">${formatName(cColl.collectionName, isMobile ? 9 : 30)}</a><br><span class="scpVersion">SCP-${cColl.version}</span>`;

      // Supply
      const tokenSupply = row.insertCell();
      const fInfiniteSupply = nMaxMints === -1;
      const tokenSupplyPct = fInfiniteSupply ? -1 : (percentOf(nSupply, nMaxMints).toFixed(isMobile ? 1 : 2) + '%');
      const fDestroyed = nMaxMints === 0;
      if (fDestroyed) {
        tokenSupply.innerText = (isMobile ? 'Coll.' : 'Collection') + ' was destroyed';
      } else {
        tokenSupply.innerHTML = `${nHTML(nSupply, isMobile ? 2 : (nSupply > 100 ? 4 : 8))}${fInfiniteSupply ? '' : '<br style="margin-bottom: 5px;"><span style="margin-right: 5px;' + (isMobile ? 'margin-bottom: 5px;' : '\'\'') + '" class="badge bg-info-new" title="' + tokenSupplyPct + ' of the total supply has been minted!">' + tokenSupplyPct + '</span>'}`;
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
    domPopularColl.innerText = data[0].collectionName;
    domPopularColl.setAttribute('href', 'nfts.html?id=' + data[0].contract);
});