const url = new URL(window.location.href);
const id = url.searchParams.get("id");

let cToken;
const CoinSearchData = [];

// --- COOL STATS TO DISPLAY
// - Richlist
let arrRichList = [];
const nMaxRich = 100;
// - Total Holders
let nTotalHolders = 0;
// - Total transactions
let nTotalTXs = 0;
// - (SCP-2 ONLY) Staking APR
let nAPR = 0;

// Cached DOM Elements
const domName = document.getElementById('contractName');
const domContract = document.getElementById('contractAddress');
const domVersion = document.getElementById('scpType');
const domMaxSupply = document.getElementById('maxSupply');
const domHolders = document.getElementById('holders');
const domTransfers = document.getElementById('transfers');
const domAprTab = document.getElementById('aprTab');
const domApr = document.getElementById('apr');
const tbodyRef = document.getElementById('txTable').getElementsByTagName('tbody')[0];
const tbodyRefHolders = document.getElementById('holdersTable').getElementsByTagName('tbody')[0];


const domStakingTab = document.getElementById('stakingTab');
const domStakingPage = document.getElementsByName('stakingPage')[0];
const domStakingAPR = document.getElementById('stakingAPR');
const domStakingInput = document.getElementById('stakingInput');
const domCalcReward1 = document.getElementById('rewardCalc1');
const domCalcReward2 = document.getElementById('rewardCalc2');
const domCalcReward3 = document.getElementById('rewardCalc3');
const domCalcReward4 = document.getElementById('rewardCalc4');
const domCalcReward5 = document.getElementById('rewardCalc5');

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getalltokens', function(data) {
  // Inserts data into array for searching
  for (const inf of data) {
    CoinSearchData.push(`${inf.name} (${inf.ticker}):${inf.contract}`);
  }
});

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/gettoken/' + id, function(data) {// Inserts data into array for searching
  if (!data || !data.name || !data.ticker) return window.location.href = "/";
  cToken = data;
  domName.innerHTML = `${cToken.name} (${cToken.ticker})`;
  //domContract.innerHTML = `${formatName(cToken.contract, 6)}${cToken.contract.substr(cToken.contract.length - 7, 6)}`;
  domContract.innerHTML = `${cToken.contract}`;
  domVersion.innerHTML = `[SCP-${cToken.version}]`;
  domMaxSupply.innerHTML = `${(cToken.maxSupply / COIN).toLocaleString('en-US')} ${cToken.ticker}`;
  if (cToken.version !== 2) {
    domStakingPage.remove();
    domStakingTab.remove();
  } else {
    domStakingInput.max = cToken.supply / COIN;
    domStakingInput.placeholder = "100 " + cToken.ticker;
  }
  // Get all transactions and put them in an array
  const txsArray = [];
  for (const cOwners of cToken.owners) {
    for (const cTxs of cOwners.activity) {
      txsArray.push({
        id: cTxs.id,
        block: cTxs.block,
        type: cTxs.type,
        amount: cTxs.amount,
        address: cOwners.address
      });
    }
  }
  // Sort array on block number (high to low)
  txsArray.sort((a, b) => b.block - a.block);
  
  // Get all transactions and put them in table
  for (const cTxs of txsArray) {
    const row = tbodyRef.insertRow();
    const txHash = row.insertCell();
    //txHash.innerHTML = `<a href="transaction.html?id=${cTxs.id}">${formatName(cTxs.id, 21)}</a>`;
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
    txAmount.innerHTML = `${nHTML(cTxs.amount / COIN, isMobile ? 2 : 8)} ${cToken.ticker}`;
  }
  // Compute TX stats from owners
  for (const cOwner of cToken.owners) {
    // Add activity to Total TXs
    nTotalTXs += cOwner.activity.length;
    // Add to Total Holders list if they have a balance
    if (cOwner.balance > 0) {
      nTotalHolders++;
    }
  }
  domTransfers.innerHTML = nTotalTXs.toLocaleString('en-US')
  domHolders.innerHTML = nTotalHolders.toLocaleString('en-US');
  // Compute richlist data (100 holders max)
  arrRichList = JSON.parse(JSON.stringify(cToken.owners));
  arrRichList.sort((a, b) => b.balance - a.balance);
  arrRichList = arrRichList.splice(0, Math.min(arrRichList.length, nMaxRich));
  // Show richlist in table
  let rankNumber = 1;
  for (const richList of arrRichList) {
    const row = tbodyRefHolders.insertRow();

    const holdersRank = row.insertCell();
    holdersRank.innerHTML = `<span class="fw-500">${rankNumber}</span>`;

    const holdersAddress = row.insertCell();
    holdersAddress.innerHTML = formatName(richList.address, isMobile ? 5 : 34);

    const holdersAmount = row.insertCell();
    holdersAmount.innerHTML = `${nHTML(richList.balance / COIN, isMobile ? 2 : 8)} ${cToken.ticker}`;

    const holdersPercentage = row.insertCell();
    holdersPercentage.innerHTML = `${((richList.balance / cToken.supply) * 100).toFixed(isMobile ? 2 : 4)}%<br>
      <div class="progress" style="height: 2px; width:100px">
        <div class="progress-bar" role="progressbar" style="width: ${((richList.balance / cToken.supply) * 100).toFixed(0)}%" aria-valuenow="${((richList.balance / cToken.supply) * 100).toFixed(0)}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>`;
    rankNumber++;
  }
  // (SCP-2 ONLY) Compute staking APR from our largest richlist staker
  let cStaker = false;
  if (cToken.version === 2) {
    for (const cOwner of arrRichList) {
      if (cStaker && cStaker.unclaimed_balance < cOwner.unclaimed_balance) {
        cStaker = cOwner;
      } else if (!cStaker) {
        cStaker = cOwner;
      }
    }
  } else {
    domAprTab.style.display = 'none';
  }
  if (cStaker) {
    const nWeight = percentOf(cStaker.balance, cToken.supply) / 100;
    const nReward = cToken.inflation * nWeight;
    nAPR = percentOf((nReward * 720) * 365, cStaker.balance);
    domApr.innerText = nAPR.toFixed(2) + "%";
    domStakingAPR.innerText = nAPR.toFixed(2) + "% APR!";
    calcRewards("0");
  }
});

function calcRewards(strAmount) {
  let nAmount = Number(strAmount.trim());
  if (!Number.isFinite(nAmount) || Number.isNaN(nAmount)) return;
  if (nAmount > cToken.supply / COIN) {
    nAmount = cToken.supply / COIN;
    domStakingInput.value = nAmount;
  }
  if (nAmount < 0) {
    nAmount = 0;
    domStakingInput.value = nAmount;
  }
  const nHourlyPercent = ((nAPR / 100) / 365) / 24;
  const nDailyPercent = ((nAPR / 100) / 365);
  const nWeeklyPercent = ((nAPR / 100) / 365) * 7;
  const nMonthlyPercent = ((nAPR / 100) / 365) * 30.4375;
  
  let nReward = (nAmount * nHourlyPercent);
  domCalcReward1.innerHTML = nHTML(nReward, nReward > 100 ? 2 : 8) + " " + cToken.ticker;
  nReward = (nAmount * nDailyPercent);
  domCalcReward2.innerHTML = nHTML(nReward, nReward > 100 ? 2 : 8) + " " + cToken.ticker;
  nReward = (nAmount * nWeeklyPercent);
  domCalcReward3.innerHTML = nHTML(nReward, nReward > 100 ? 2 : 8) + " " + cToken.ticker;
  nReward = (nAmount * nMonthlyPercent);
  domCalcReward4.innerHTML = nHTML(nReward, nReward > 100 ? 2 : 8) + " " + cToken.ticker;
  nReward = (nAmount * (nAPR / 100));
  domCalcReward5.innerHTML = nHTML(nReward, nReward > 100 ? 2 : 8) + " " + cToken.ticker;
}