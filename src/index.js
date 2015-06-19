var _ = require('lodash');
var async = require('async');
var request = require('request');
var fs = require('fs');
var path = require('path');

var processPitchforkDOM = require('./process-pitchfork-dom');

var REVIEW_PAGE_URL_BASE = 'http://pitchfork.com/reviews/albums/';
var START_PAGE = 1;
var END_PAGE = 2;

function getLinksOnPage(url, cb) {
    console.log('Request: ', url);
    request(url, function(err, response, body) {
        if (err) throw err;
        else if (response.statusCode === 200) {
            processPitchforkDOM.extractReviewLinks(body, url, cb);
        }
    });
}

function fetchLinks(cb) {
    var url;
    var makePageRequest = [];
    for (var i = START_PAGE; i <= END_PAGE; i++) {
        url = REVIEW_PAGE_URL_BASE + i;

        makePageRequest.push(
            (function(url) {
                return function(cb) {
                    getLinksOnPage(url, cb);
                }
            })(url)
        );
    }

    async.series(makePageRequest, function(err, result) {
        result = _.flatten(result);
        cb(null, result);
    })
}


function saveLinksToJSON(links, cb) {
    var filePath = path.join(path.resolve(__dirname, '..', 'data'), 'links.json');
    fs.writeFile(filePath, JSON.stringify(links), function (err) {
        if (err) throw err;
        console.log('links.json written successfully');
    });

    cb(null, links);
}

/*-------------------------------------------------*/
async.waterfall([
    fetchLinks,
    saveLinksToJSON
], function(err, result) {
    console.log(result.length);
})
/*-------------------------------------------------*/

