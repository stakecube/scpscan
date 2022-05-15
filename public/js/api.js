const CoinSearchData = [];

// DOM Renderer optimization
const tbodyRef = document.getElementById('tokensTable').getElementsByTagName('tbody')[0];
const txTable = document.getElementById('txTable').getElementsByTagName('tbody')[0];
const transactions24h = document.getElementById('24hTransactions');
const popularToken = document.getElementById('mostPopularToken');
const totalUsers = document.getElementById('totalUsers');
const totalTokens = document.getElementById('totalTokens');
const userAddresses = document.getElementById("userAddresses");

// STATS!
let allUsers = [];

$.getJSON(window.location.origin + '/api/v1/gettokendata', function(data) {
    // Inserts data into array for searching
    for (const inf of data.arrTokens)
      CoinSearchData.push(`${inf.name} (${inf.ticker}):${inf.contract}`);

    // Update user address list
    allUsers = data.allUsers;

    // Update total tokens
    totalTokens.innerHTML = data.arrTokens.length.toLocaleString('en-GB');

    // Update daily TXs
    transactions24h.innerHTML = data.nDailyTXs.toLocaleString('en-GB');

    // Get all transactions and put them in table
    for (const cTxs of data.arrTXs) {
      const row = txTable.insertRow();
      const txName = row.insertCell();
      txName.innerHTML = `<a style="text-decoration: none" href="contract.html?id=${cTxs.contract}">${formatName(cTxs.name, isMobile ? 9 : 30)}${isMobile ? '<br>' : ' '}(${formatName(cTxs.ticker, 6)})</a>`;
      
      const txHash = row.insertCell();
      txHash.innerHTML = `<a class="hash" style="text-decoration: none;" href="https://scc.ccore.online/transaction/${cTxs.id}">${formatName(cTxs.id, isMobile ? 6 : 21)}</a>`;

      const txBlock = row.insertCell();
      txBlock.innerHTML = `<span class="badge bg-secondary-new">${cTxs.block.toLocaleString('en-US')}</span>`;

      // Types colors
      let typeColor = 'secondary';
      if (cTxs.type == 'staked') {
        typeColor = 'success-new';
      } else if (cTxs.type == 'sent') {
        typeColor = 'danger-new';
      } else if (cTxs.type == 'received') {
        typeColor = 'info-new';
      }
      const txType = row.insertCell();
      txType.innerHTML = `<span class="badge bg-${typeColor}" style="text-transform:capitalize;">${cTxs.type}</span>`;

      const txAddress = row.insertCell();
      txAddress.innerHTML = `${formatName(cTxs.address, isMobile ? 5 : 34)}`;

      const txAmount = row.insertCell();
      txAmount.innerHTML = `${nHTML(cTxs.amount / COIN, isMobile ? 2 : 8)} ${cTxs.ticker}`;
    }

    // Sort the list by total activity
    data.arrTokens.sort((a, b) => b.totalActivity - a.totalActivity);
    
    // Set most popular token
    popularToken.innerHTML = `${data.arrTokens[0].name} (${data.arrTokens[0].ticker})`;
    popularToken.setAttribute('href', 'contract.html?id=' + data.arrTokens[0].contract);

    let i; const len = data.arrTokens.length;
    for (i = 0; i < len; i++) {
      // Token variables
      const strContract = data.arrTokens[i].contract;
      const nVersion = data.arrTokens[i].version;
      const strName = data.arrTokens[i].name;
      const strTicker = data.arrTokens[i].ticker;
      const nSupply = data.arrTokens[i].supply / COIN;
      const nMaxSupply = data.arrTokens[i].maxSupply / COIN;
      
      // Token's row
      const row = tbodyRef.insertRow();

      // Index
      const tokenNo = row.insertCell();
      tokenNo.innerHTML = `<span class="tableNo">${i + 1}</span>`;
      tokenNo.style.verticalAlign = 'middle';

      // Name & Ticker
      const tokenName = row.insertCell();
      tokenName.innerHTML = `<a style="text-decoration: none" href="contract.html?id=${strContract}">${formatName(strName, isMobile ? 9 : 30)}${isMobile ? '<br>' : ' '}(${formatName(strTicker, 6)})</a><br><span class="scpVersion">SCP-${nVersion}</span>`;

      // Supply
      const tokenSupply = row.insertCell();
      const tokenSupplyPct = percentOf(nSupply, nMaxSupply).toFixed(isMobile ? 1 : 2) + '%';
      tokenSupply.innerHTML = `${nHTML(nSupply, isMobile ? 2 : (nSupply > 100 ? 4 : 8))}<br style="margin-bottom: 5px;"><span style="cursor:pointer;margin-right:5px;${isMobile ? 'margin-bottom:5px;' : ''}" class="badge bg-info-new" title="${nSupply === 0 ? 'This token is new! The creator has not issued any supply yet.' : (tokenSupplyPct + ' of the total ' + formatName(strTicker, 6) + ' supply has been minted!')}">${nSupply === 0 ? 'New!' : tokenSupplyPct}</span>`;
      if (nVersion === 2 && data.arrTokens[i].APR > 0) {
        const tokenAPRStr = data.arrTokens[i].APR.toLocaleString('en-US', { maximumFractionDigits: isMobile ? 0 : (data.arrTokens[i].APR > 100 ? 0 : 2)}) + '%';
        tokenSupply.innerHTML += '<span style="cursor:pointer" class="badge bg-success-new" title="' + formatName(strTicker, 6) + ' rewards it\'s holders with ' + tokenAPRStr + ' APR">' + tokenAPRStr + ' APR</span>';
      }

      // Max Supply
      const tokenMaxSupply = row.insertCell();
      tokenMaxSupply.innerText = `${nMaxSupply.toLocaleString('en-US')}`;
      tokenMaxSupply.style.verticalAlign = 'middle';
    }

    // Total Users
    totalUsers.innerHTML = allUsers.length.toLocaleString('en-GB');
    userAddresses.value = allUsers.join("\r\n");
});