const url = new URL(window.location.href);
const id = url.searchParams.get("addr");

const CoinSearchData = [];
let txData = [];
let txTokens = [];

const txTable = document.getElementById('txTable').getElementsByTagName('tbody')[0];
const walletAddress = document.getElementById('walletAddress');
const totalTransactions = document.getElementById('totalTransactions');
const tokenFilters = document.getElementById('tokenFilters');

const totalBalance = document.getElementById('totalBalance');
const amountSent = document.getElementById('amountSent');
const amountReceived = document.getElementById('amountReceived');

const totalBalanceTicker = document.getElementById('totalBalanceTicker');
const amountSentTicker = document.getElementById('amountSentTicker');
const amountReceivedTicker = document.getElementById('amountReceivedTicker');

$.getJSON('https://stakecubecoin.net/web3/scp/tokens/getalltokens', function(data) {
  /* Inserts data into array for searching */
  for (const inf of data) {
    CoinSearchData.push(`${inf.name} (${inf.ticker}):${inf.contract}`);
  }

  let tokenCounter = 1;
  for (token of data) {

    /* When there is no activity on the last token, call the function */
    if(data.length == tokenCounter & token.owners.length == 0) {
      showTransactions();
      console.log(token)
    }

    let txsNo = 1;
    let ownersNo = 1;
    for (owners of token.owners) {
      /* Check if address is created in token */
      if(owners.address == id) {
        /* Check activity */
        for (activity of owners.activity) {
          txData.push({
            address: owners.address,
            id: activity.id,
            block: activity.block,
            type: activity.type,
            amount: activity.amount,
            name: token.name,
            contract: token.contract,
            ticker: token.ticker
          });

          txsNo++
        }
      } else {
        // wallet address is not there
        if(data.length == tokenCounter && token.owners.length == ownersNo) {
          showTransactions();
        }
      }

      ownersNo++;
    }

    tokenCounter++;
  }
});

function showTransactions(filter) {
  /* If wallet is not found */
  if(txData.length == 0) {
    return window.location.href = "/";
  }

  /* Sort from block height high to low */
  txTable.innerHTML = "";
  txData.sort(function(a, b) {
    var keyA = new Date(a.block),
        keyB = new Date(b.block);
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  walletAddress.innerHTML = txData[0].address;
  totalTransactions.innerHTML = txData.length;

  for(txDataD of txData) {
    /* Add TX to frontend */
    function addTx() {
      const row = txTable.insertRow();

      const txHash = row.insertCell();
      txHash.innerHTML = `<a class="hash" target="_blank" style="text-decoration: none;" href="https://scc.ccore.online/transaction/${txDataD.id}">${formatName(txDataD.id, isMobile ? 6 : 21)}</a>`;

      const txBlock = row.insertCell();
      txBlock.innerHTML = `<span class="badge bg-secondary-new">${txDataD.block.toLocaleString('en-US')}</span>`;

      /* Types colors */
      let typeColor = 'secondary';
      if(txDataD.type == 'staked') {
        typeColor = 'success-new';
      } else if(txDataD.type == 'sent') {
        typeColor = 'danger-new';
      } else if(txDataD.type == 'received') {
        typeColor = 'info-new';
      }
      const txType = row.insertCell();
      txType.innerHTML = `<span class="badge bg-${typeColor}" style="text-transform:capitalize;">${txDataD.type}</span>`;

      const txToken = row.insertCell();
      txToken.innerHTML = `<a href="contract.html?id=${txDataD.contract}">${txDataD.name}</a>`;
      
      const txAmount = row.insertCell();
      txAmount.innerHTML = `${nHTML(txDataD.amount / COIN, isMobile ? 2 : 8)} ${txDataD.ticker}`;
    }

    /* Add filter to select box */
    if(!txTokens.includes(txDataD.name)) {
      txTokens.push(txDataD.name);
      let option = document.createElement("option");
      option.text = txDataD.name;
      tokenFilters.add(option);
    }

    if(filter !== undefined) {
      /* Process balance, sent, received and tx's */
      if(txDataD.name == filter) {
        
        /* If empty, set default data */
        if(totalBalance.innerHTML == "-") { totalBalance.innerHTML = '0'; totalBalanceTicker.innerHTML = txDataD.ticker; }
        if(amountSent.innerHTML == "-") { amountSent.innerHTML = '0'; amountSentTicker.innerHTML = txDataD.ticker; }
        if(amountReceived.innerHTML == "-") { amountReceived.innerHTML = '0'; amountReceivedTicker.innerHTML = txDataD.ticker; }

        /* Process balance, sent and received values */
        if(txDataD.type == "sent") {
          totalBalance.innerHTML = (parseFloat(totalBalance.innerHTML.replace(',', '')) - (txDataD.amount / COIN)).toLocaleString('en-US', {maximumFractionDigits: 8});
          amountSent.innerHTML = (parseFloat(amountSent.innerHTML.replace(',', '')) + (txDataD.amount / COIN)).toLocaleString('en-US', {maximumFractionDigits: 8});
        } else if(txDataD.type == "staked" || txDataD.type == "received") {
          totalBalance.innerHTML = (parseFloat(totalBalance.innerHTML.replace(',', '')) + (txDataD.amount / COIN)).toLocaleString('en-US', {maximumFractionDigits: 8});
          amountReceived.innerHTML = (parseFloat(amountReceived.innerHTML.replace(',', '')) + (txDataD.amount / COIN)).toLocaleString('en-US', {maximumFractionDigits: 8});
        }

        /* Add tx to table */
        addTx();
      }
    } else {
      addTx();
    }
  }
}

/* On update filter selectbox */
function updateFilter() {
  /* Set data to empty */
  totalBalance.innerHTML = '-';
  amountSent.innerHTML = '-';
  amountReceived.innerHTML = '-';
  totalBalanceTicker.innerHTML = '';
  amountSentTicker.innerHTML = '';
  amountReceivedTicker.innerHTML = '';

  if(tokenFilters.value == "-") {
    showTransactions();
  } else {
    showTransactions(tokenFilters.value);
  }
}