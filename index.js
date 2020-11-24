// index.js
const Mustache = require('mustache');
const fs = require('fs');
const urllib = require('urllib');
const xmlreader = require('xmlreader');
const MUSTACHE_MAIN_DIR = './main.mustache';
const MAX = 10;

let DATA = {
    user: {
        'name': '彼岸鱼',
        'address': '大桧山大楼',
        'school': '未来道具研究所'
    },
    date: new Date().toUTCString()
};

urllib.request('https://blog.lsmg.xyz/atom.xml', {
    timeout: 30 * 1000
}, function (err, data, res) {
    if (err) {
        console.log(err);
        throw err;
    }

    xmlreader.read(data.toString(), function (errors, response) {
        if (errors) {
            console.log(errors);
            throw errors;
        }

        let arts = []
        for (var i = 0; i < MAX; i++) {
            var article = {}
            article.title = response.feed.entry.at(i).title.text();
            article.url = response.feed.entry.at(i).link.attributes().href;
            arts.push(article);
        }

        DATA.articles = arts

        generateReadMe(DATA)
    });
});


function generateReadMe(DATA) {
    console.log(DATA)
    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}
