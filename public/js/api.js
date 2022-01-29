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
let nDailyTXs = 0;
const allUsers = [];

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getalltokens', function(data) {
    // Inserts data into array for searching
    for (const inf of data) {
      CoinSearchData.push(`${inf.name} (${inf.ticker}):${inf.contract}`);
    }

    // Update total tokens
    totalTokens.innerHTML = data.length.toLocaleString('en-GB');
    
    // Precompute the stats of each token
    let nHighestBlock = 0;
    const txsArray = [];
    for (const cToken of data) {
      let cStaker = false;
      // --- ACTIVITY DATA
      cToken.totalActivity = 0;
      cToken.APR = 0;
      // Loop every owner
      for (const cOwner of cToken.owners) {
        // Add all users to array
        if (!allUsers.includes(cOwner.address))
          allUsers.push(cOwner.address);
        // Add the activity
        cToken.totalActivity += cOwner.activity.length;
        // If their latest activity's block is higher than our current one, set it
        if (cOwner.activity.length) {
          let cLastBlk = cOwner.activity[cOwner.activity.length - 1].block;
          if (cLastBlk)
            nHighestBlock = cLastBlk;
        }
        if (cToken.version === 2) {
          if (cStaker && cStaker.unclaimed_balance < cOwner.unclaimed_balance) {
            cStaker = cOwner;
          } else if (!cStaker) {
            cStaker = cOwner;
          }
        }

        // Get all transactions and put them in a array
        for (const cTxs of cOwner.activity) {
          txsArray.push({
            name: cToken.name,
            ticker: cToken.ticker,
            contract: cToken.contract,
            id: cTxs.id,
            block: cTxs.block,
            type: cTxs.type,
            amount: cTxs.amount,
            address: cOwner.address
          });
        }
      }
      
      // Sort all arrays on block height
      txsArray.sort((a, b) => b.block - a.block);
      
      // --- SCP-2 --- APR DATA - (based on a sample of the largest staker)
      if (cToken.version === 2 && cStaker) {
        const nWeight = percentOf(cStaker.balance, cToken.supply) / 100;
        const nReward = cToken.inflation * nWeight;
        cToken.APR = percentOf((nReward * 720) * 365, cStaker.balance);
      }
    }

    // Get all transactions and put them in table
    let txsCounter = 0;
    for (const cTxs of txsArray) {
      // End loop when 25 are shown
      if (txsCounter > 24) break;

      const row = txTable.insertRow();
      const txName = row.insertCell();
      txName.innerHTML = `<a style="text-decoration: none" href="contract.html?id=${cTxs.contract}">${formatName(cTxs.name, isMobile ? 9 : 30)}${isMobile ? '<br>' : ' '}(${formatName(cTxs.ticker, 6)})</a>`;
      
      const txHash = row.insertCell();
      txHash.innerHTML = `<a class="hash" target="_blank" style="text-decoration: none;" href="https://scc.ccore.online/transaction/${cTxs.id}">${formatName(cTxs.id, isMobile ? 6 : 21)}</a>`;

      const txBlock = row.insertCell();
      txBlock.innerHTML = `<span class="badge bg-secondary-new">${cTxs.block.toLocaleString('en-US')}</span>`;

      // Types colors
      let typeColor = 'secondary';
      if(cTxs.type == 'staked') {
        typeColor = 'success-new';
      } else if(cTxs.type == 'sent') {
        typeColor = 'danger-new';
      } else if(cTxs.type == 'received') {
        typeColor = 'info-new';
      }
      const txType = row.insertCell();
      txType.innerHTML = `<span class="badge bg-${typeColor}" style="text-transform:capitalize;">${cTxs.type}</span>`;

      const txAddress = row.insertCell();
      txAddress.innerHTML = `<a style="text-decoration:none;" href="wallet.html?addr=${cTxs.address}">${formatName(cTxs.address, isMobile ? 5 : 34)}</a>`;

      const txAmount = row.insertCell();
      txAmount.innerHTML = `${nHTML(cTxs.amount / COIN, isMobile ? 2 : 8)} ${cTxs.ticker}`;
      txsCounter++;
    }

    // --- TX Aggregation Data ---
    // Roll a backwards forloop until we hit a block older than 720 from our tip
    for (const cToken of data) {
      for (const cOwner of cToken.owners) {
        for (const cActivity of cOwner.activity) {
          if (cActivity.block >= nHighestBlock - 720) {
            nDailyTXs++;
          }
        }
      }
    }

    transactions24h.innerHTML = nDailyTXs.toLocaleString('en-GB');

    // Sort the list by total activity
    data.sort((a, b) => b.totalActivity - a.totalActivity);
    
    // Set most popular token
    popularToken.innerHTML = `${data[0].name} (${data[0].ticker})`;
    popularToken.setAttribute('href', 'contract.html?id=' + data[0].contract);

    let i; const len = data.length;
    for (i = 0; i < len; i++) {
      // Token variables
      const strContract = data[i].contract;
      const nVersion = data[i].version;
      const strName = data[i].name;
      const strTicker = data[i].ticker;
      const nSupply = data[i].supply / COIN;
      const nMaxSupply = data[i].maxSupply / COIN;
      
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
      if (nVersion === 2 && data[i].APR > 0) {
        const tokenAPRStr = data[i].APR.toLocaleString('en-US', { maximumFractionDigits: isMobile ? 0 : (data[i].APR > 100 ? 0 : 2)}) + '%';
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