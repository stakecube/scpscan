/* Required Libraries */
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const compression = require('compression');

const localPort = process.env.PORT || 80;
const certbotDir = '/etc/letsencrypt/live/scpscan.net/';

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cors());
const router = require('./routes');
try {
    // Proprietary SC module support
    const scRouter = require('./sc/sc-routes');
    app.use(scRouter);
    console.log('SC Module: Proprietary module loaded, welcome JS! (or Oleg!)');
} catch (e) {
    console.warn('SC Module: Failed to load proprietary SC module!\nThis is fine if you\'re running an open-source explorer.');
    console.warn(e);
}
app.use(router);

// Handle 404
app.use(function(req, res) {
    res.status(404).send('404: Page not Found');
    console.error("- IP: " + req.ip);
});
  
// Handle 500
app.use(function(error, req, res) {
    res.status(500).send('500: Internal Server Error');
    console.error("- IP: " + req.ip + "\nERROR: " + error);
});

let environment;

// Certificate
let credentials;
try {
    credentials = {
        key:  fs.readFileSync(certbotDir + 'privkey.pem', 'utf8'),
        cert: fs.readFileSync(certbotDir + 'cert.pem', 'utf8'),
        ca:   fs.readFileSync(certbotDir + 'chain.pem', 'utf8')
    };
    environment = 'public';
} catch (e) {
    console.error("ERROR: Certificate could not be loaded, running as 'local' mode...");
    environment = "local";
}


if (environment === 'local') {
    // HTTP
    app.listen(localPort, () => {
        console.log(`SCPscan running in local environment on port ` + localPort);
    });
} else {
    // HTTPS
    require('https').createServer(credentials, app).listen(443, '0.0.0.0', () => {
        console.log("Serving SCPscan with SSL!");
    });
}
