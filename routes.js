/* Required Libraries */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const net = require('./net');

// Load config file
const CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Always wear your helmet!
const helmet = require('helmet');
router.use(helmet());
router.use(bodyParser.json());
router.use(express.json());
/* ------------------ */

// States
let arrTokens = [];
let arrTXs = [];
let arrFrontendTXs = [];
let allUsers = [];
let nDailyTXs = 0;


async function updateGlobalCache() {
    // Update the token storage from the node API
    try {
        arrTokens = JSON.parse(await net.get(CONFIG.scpnode + 'tokens/getalltokens'));
    } catch (e) {
        console.error('Unable to refresh cache from SCP Node! Trying again later...');
        console.error(e);
        return;
    }

    // Reset cache
    arrTXs = [];
    arrFrontendTXs = [];
    nDailyTXs = 0;

    // Precompute a bunch of nice data!
    // Throw all known TXs of each global token into an array
    for (const cToken of arrTokens) {
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
            if (cToken.version === 2) {
                if (cStaker && cStaker.unclaimed_balance < cOwner.unclaimed_balance) {
                    cStaker = cOwner;
                } else if (!cStaker) {
                    cStaker = cOwner;
                }
            }
        }
        
        // --- SCP-2 --- APR DATA - (based on a sample of the largest staker)
        if (cToken.version === 2 && cStaker) {
            const nWeight = percentOf(cStaker.balance, cToken.supply) / 100;
            const nReward = cToken.inflation * nWeight;
            cToken.APR = percentOf((nReward * 720) * 365, cStaker.balance);
        }

        for (const cOwner of cToken.owners) {
            for (const cTxs of cOwner.activity) {
                arrTXs.push({
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

        // Nuke unnecessary heavy token data
        delete cToken.owners;
    }
    arrTXs.sort((a, b) => b.block - a.block);
    for (let i = arrTXs[0].block; i>arrTXs[0].block - 720; i--) {
        const cTX = arrTXs.find(a => a.block === i);
        if (cTX) {
            arrFrontendTXs.push(cTX);
            nDailyTXs++;
        }
    }
}

// Update cache routinely (~30 sec)
setInterval(updateGlobalCache, 30000);

router.get('/api/v1/gettokendata', async (req, res) => {
    // Send cached results!
    res.json({
        allUsers,
        arrTXs: arrFrontendTXs,
        nDailyTXs,
        arrTokens
    });
});

function percentOf(partial, full) {
    return (partial / full) * 100;
}

// Immediately update cache as soon as all code has been read
updateGlobalCache().then(() => console.log('Initial cache precompute finished!')).catch(console.error);

module.exports = router;