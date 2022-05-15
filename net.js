'use strict';

const http = require('http');
const https = require('https');

async function request(endpoint, method, body) {
    const url = new URL(endpoint);
    const opts = {
        'auth': url.username + ':' + url.password,
        'host': url.host,
        'hostname': url.hostname,
        'port': url.port,
        'href': url.href,
        'protocol': url.protocol,
        'path': url.pathname + url.search,
        'method': method
    };
    const server = opts.protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
        const req = server.request(opts, (res) => {
            let strData = '';
            res.setEncoding('utf8');

            res.on('data', d => {
                // Concatenate response chunks into one string
                strData += d;
            });

            res.on('end', () => {
                // Return the full string
                if (res.statusCode === 200) {
                    resolve(strData);
                } else {
                    reject(Error('Status Code: ' + res.statusCode + ' (' +
                           res.statusMessage + ')\nResult: ' + strData));
                }
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.setHeader('User-Agent', 'SCPscan');
        if (body) {
            req.write(body);
        }
        req.end();
    });
}

async function get(endpoint) {
    return await request(endpoint, 'GET');
}

async function post(endpoint, body) {
    return await request(endpoint, 'POST', body);
}

exports.get = get;
exports.post = post;
