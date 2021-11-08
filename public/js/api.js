const COIN = (10**8);
const CoinSearchData = [];

// DOM Renderer optimization
const tbodyRef = document.getElementById('tokensTable').getElementsByTagName('tbody')[0];
const txTable = document.getElementById('txTable').getElementsByTagName('tbody')[0];
const transactions24h = document.getElementById('24hTransactions');
const popularToken = document.getElementById('mostPopularToken');
const totalUsers = document.getElementById('totalUsers');
const totalTokens = document.getElementById('totalTokens');
const userAddresses = document.getElementById("userAddresses");

var isMobile = false;
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

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
      txHash.innerHTML = `<a class="hash" style="text-decoration: none;" href="https://scc.ccore.online/transaction/${cTxs.id}">${formatName(cTxs.id, isMobile ? 6 : 21)}</a>`;

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
      txAddress.innerHTML = `${formatName(cTxs.address, isMobile ? 5 : 34)}`;

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
      tokenSupply.innerHTML = `${nHTML(nSupply, isMobile ? 2 : (nSupply > 100 ? 4 : 8))}<br style="margin-bottom: 5px;"><span style="margin-right: 5px;${isMobile ? 'margin-bottom: 5px;' : ''}" class="badge bg-info-new">${percentOf(nSupply, nMaxSupply).toFixed(isMobile ? 1 : 2) + '%'}</span>`;
      if (nVersion === 2 && data[i].APR > 0) {
        tokenSupply.innerHTML += '<span class="badge bg-success-new">' + data[i].APR.toLocaleString('en-US', { maximumFractionDigits: isMobile ? 0 : (data[i].APR > 100 ? 0 : 2)}) + '% APR</span>';
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

// --- Utils
function formatName(name, limit) {
  return (name.length > limit ? name.substr(0, limit) + "…" : name);
}

function percentOf(partial, full) {
  return (partial / full) * 100;
}

function percentChange(decrease, oldNumber) {
  return (decrease / oldNumber) * 100;
}

function nHTML(amount, maxDecimals = 8, opacity = 0.3) {
  amount = amount.toLocaleString('en-GB', { maximumFractionDigits: maxDecimals });
  let amountHTML = '';
  if (amount.includes('.')) {
    let tmp = amount.split('.');
    if (Number(tmp[0].replace(/,/g, '')) > 0) {
      // We have full digits, so let's lower the decimal opacity
      if (tmp[1].length > 8) tmp[1] = tmp[1].substr(0, 8);
      amountHTML = tmp[0] + '<span style="opacity: ' + opacity + '">.' + tmp[1] + '</span>';
    } else {
      // No digits (or decimals), so decimals are equal priority
      amountHTML = amount;
    }
  } else {
    amountHTML = amount;
  }
  return amountHTML;
}