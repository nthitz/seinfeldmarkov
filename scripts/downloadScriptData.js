var request = require('request');
var cheerio = require('cheerio');
var TimeQueue = require('timequeue');
var fs = require('fs');

var outputFolder = 'script_data/'

var host = 'http://www.seinology.com/'
var index = host + 'scripts-english.shtml';

var q = new TimeQueue(requestEpisodeScript, { concurrency: 1, every: 1000 });

request(index, function(err, response, body) {
  var $index = cheerio.load(body);
  $index('table[width=642]').find('td[width=156] a').each(function(i, element) {
    var $link = $index(this);
    var title = $link.text()
    var path = $link.attr('href').trim()
    var url = host + path;
    q.push(title + '.html' ,url)

  })
})
function requestEpisodeScript(path, url, callback) {
  console.log(arguments)
  request(url, function(err, response, body) {
    var outputFilename = outputFolder + path;
    fs.writeFileSync(outputFilename, body)
    console.log(outputFilename + " written")
    callback()
  })
}