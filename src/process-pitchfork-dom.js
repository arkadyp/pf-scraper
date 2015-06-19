var jsdom = require('jsdom').jsdom;

var count = 0;

function extractReviewLinks(htmlStr, url, cb) {
    console.log('Extract links from: ', url);
    var document = jsdom(htmlStr);
    var links = document.querySelectorAll('.object-grid a')
    var result = [];
    var link;
    var entry;
    var messedUpImgString;
    for (var i = 0; i < links.length; i++) {
        link = links[i];
        
        //--- refactor to use RegEx
        messedUpImgString = link.children[0].children[0].outerHTML; // <div class="lazy" data-content=" <img src=&quot;http://cdn3.pitchfork.com/albums/21558/list.b2bd8371.jpg&quot; /> "></div>
        messedUpImgString = messedUpImgString.slice(messedUpImgString.indexOf('src=&quot;') + 10, -18);
        // -------------------------

        entry = {
            url: link.href.replace('file://', 'http://www.pitchfork.com'),
            img: messedUpImgString,
            artist: link.children[1].children[0].textContent,
            album: link.children[1].children[1].textContent,
            reviewer: link.children[1].children[2].textContent.slice(3),
            date: link.children[1].children[3].textContent
        };
        
        result.push(entry);
    }
    cb(null, result);
}

module.exports = {
    extractReviewLinks: extractReviewLinks
}