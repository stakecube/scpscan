const url = new URL(window.location.href);
const id = url.searchParams.get("id");

var isMobile = false;
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

const COIN = (10**8);

let cToken;
let CoinSearchData = [];

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
let domName = document.getElementById('contractName');
let domContract = document.getElementById('contractAddress');
let domVersion = document.getElementById('scpType');
let domMaxSupply = document.getElementById('maxSupply');
let domHolders = document.getElementById('holders');
let domTransfers = document.getElementById('transfers');
let domAprTab = document.getElementById('aprTab');
let domApr = document.getElementById('apr');
let tbodyRef = document.getElementById('txTable').getElementsByTagName('tbody')[0];
let tbodyRefHolders = document.getElementById('holdersTable').getElementsByTagName('tbody')[0];


let domStakingTab = document.getElementById('stakingTab');
let domStakingPage = document.getElementsByName('stakingPage')[0];
let domStakingAPR = document.getElementById('stakingAPR');
let domStakingInput = document.getElementById('stakingInput');
let domCalcReward1 = document.getElementById('rewardCalc1');
let domCalcReward2 = document.getElementById('rewardCalc2');
let domCalcReward3 = document.getElementById('rewardCalc3');
let domCalcReward4 = document.getElementById('rewardCalc4');
let domCalcReward5 = document.getElementById('rewardCalc5');

$.getJSON('https://stakecubecoin.net/web3/scp/getalltokens', function(data) {
  // Inserts data into array for searching
  for (const inf of data) {
    CoinSearchData.push(`${inf.name} (${inf.ticker}):${inf.contract}`);
  }
});

$.getJSON('https://stakecubecoin.net/web3/scp/gettoken/' + id, function(data) {// Inserts data into array for searching
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
  let txsArray = [];
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
  txsArray.sort(function(a, b) {
    return b.block - a.block;
  });
  
  // Get all transactions and put them in table
  for (const cTxs of txsArray) {
    let row = tbodyRef.insertRow();
    let txHash = row.insertCell();
    let txHashValue = document.createElement('td');
    //txHashValue.innerHTML = `<a href="transaction.html?id=${cTxs.id}">${formatName(cTxs.id, 21)}</a>`;
    txHashValue.innerHTML = `<a class="hash" style="color: black; text-decoration: none;" >${formatName(cTxs.id, isMobile ? 6 : 21)}</a>`;
    txHash.appendChild(txHashValue);
    let txBlock = row.insertCell();
    let txBlockvalue = document.createElement('td');
    txBlockvalue.innerHTML = `<span class="badge bg-secondary-new">${cTxs.block.toLocaleString('en-US')}</span>`;
    txBlock.appendChild(txBlockvalue);
    // Types colors
    let typeColor = 'secondary';
    if(cTxs.type == 'staked') {
      typeColor = 'success-new';
    } else if(cTxs.type == 'sent') {
      typeColor = 'danger-new';
    } else if(cTxs.type == 'received') {
      typeColor = 'info-new';
    }
    let txType = row.insertCell();
    let txTypeValue = document.createElement('td');
    txTypeValue.innerHTML = `<span class="badge bg-${typeColor}">${cTxs.type.charAt(0).toUpperCase() + cTxs.type.slice(1)}</span>`;
    txType.appendChild(txTypeValue);
    let txAddress = row.insertCell();
    let txAddressValue = document.createElement('td');
    txAddressValue.innerHTML = `${formatName(cTxs.address, isMobile ? 5 : 34)}`;
    txAddress.appendChild(txAddressValue);
    let txAmount = row.insertCell();
    let txAmountValue = document.createElement('td');
    txAmountValue.innerHTML = `${nHTML(cTxs.amount / COIN, isMobile ? 2 : 8)} ${cToken.ticker}`;
    txAmount.appendChild(txAmountValue);
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
    let row = tbodyRefHolders.insertRow();
    let holdersRank = row.insertCell();
    let holdersRankValue = document.createElement('td');
    holdersRankValue.innerHTML = `<span class="fw-500">${rankNumber}</span>`;
    holdersRank.appendChild(holdersRankValue);
    let holdersAddress = row.insertCell();
    let holdersAddressValue = document.createElement('td');
    holdersAddressValue.innerHTML = formatName(richList.address, isMobile ? 5 : 34);
    holdersAddress.appendChild(holdersAddressValue);
    let holdersAmount = row.insertCell();
    let holdersAmountValue = document.createElement('td');
    holdersAmountValue.innerHTML = `${nHTML(richList.balance / COIN, isMobile ? 2 : 8)} ${cToken.ticker}`;
    holdersAmount.appendChild(holdersAmountValue);
    let holdersPercentage = row.insertCell();
    let holdersPercentageValue = document.createElement('td');
    holdersPercentageValue.innerHTML = `${((richList.balance / cToken.supply) * 100).toFixed(isMobile ? 2 : 4)}%<br>
    <div class="progress" style="height: 2px; width:100px">
      <div class="progress-bar" role="progressbar" style="width: ${((richList.balance / cToken.supply) * 100).toFixed(0)}%" aria-valuenow="${((richList.balance / cToken.supply) * 100).toFixed(0)}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>`;
    holdersPercentage.appendChild(holdersPercentageValue);
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
    let nWeight = percentOf(cStaker.balance, cToken.supply) / 100;
    let nReward = cToken.inflation * nWeight;
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