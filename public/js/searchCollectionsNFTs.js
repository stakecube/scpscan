let AllCollectionsNFTs = [];

function getAllCollections() {
  // Get all Collections
  $.getJSON('https://stakecubecoin.net/web3/scp/tokens/getallcollectionheaders', function(collections) {
    // Select Collections
    for(let i = 0; i < collections.length; i++) {
      // Push to array
      AllCollectionsNFTs.push(`${collections[i].collectionName}:${collections[i].contract}:collection`)

      // Get collection NFTs
      $.getJSON('https://stakecubecoin.net/web3/scp/tokens/getcollection/' + collections[i].contract, function(nfts) {
        // Select NFTs
        for(let j = 0; j < nfts.nfts.length; j++) {
          // Push to array
          AllCollectionsNFTs.push(`${nfts.nfts[j].name}:${nfts.nfts[j].id}:nft`)

          // Check if last
          if(i+1 == collections.length) {
            if(j+1 == nfts.nfts.length) {
              autocomplete(document.getElementById("myInput"), AllCollectionsNFTs);
              document.getElementById('myInput').placeholder="Search"
            }
          }
        }

        // If last collection is empty
        if(nfts.nfts.length == 0) {
          if(i+1 == collections.length) {
            autocomplete(document.getElementById("myInput"), AllCollectionsNFTs);
            document.getElementById('myInput').placeholder="Search"
          }
        }
      });
    }
  });
}

getAllCollections();

function multiSearchOr(text, searchWords){
  for(const strWord of searchWords)
  {
   if(text.indexOf(strWord) == -1)
     return false;
  }
  return true;
}

function autocomplete(inp, arr) {
  var currentFocus;
  
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;

    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);

    let maxResults = 10;
    let maxResultsCounting = 0;
    for (i = 0; i < arr.length; i++) {
      if (multiSearchOr(arr[i].toLowerCase(), val.toLowerCase().split(" "))) {
        maxResultsCounting++;
        if(maxResultsCounting <= maxResults) {
          b = document.createElement("DIV");
          b.setAttribute("onClick", `window.location.href ='./${(arr[i].split(':')[2] == 'collection' ? 'nfts' : 'nft')}.html?id=${arr[i].split(":")[1]}'`);
          b.innerHTML += `<span class="nameSearch">${arr[i].split(":")[0]}</span><br>`;
          b.innerHTML += `<span class="contractSearch">${arr[i].split(":")[1].substring(0,20)}...${arr[i].split(":")[1].substr(arr[i].split(":")[1].length - 20)}</span>`;
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          a.appendChild(b);
        }
      }
    }
  });
  
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });

  inp.addEventListener("click", function (e) {
    
  });
}