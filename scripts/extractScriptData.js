var fs = require('fs');
var cheerio = require('cheerio');
var _ = require('lodash');

var dataDirectory = 'script_data/'
fs.readdir(dataDirectory, function(err, files) {
  _.each(files, function(file) {
    if(file[0] === '.') return;
    var extensionIndex = file.lastIndexOf('.');
    var filename = file.substr(0, extensionIndex);
    var extension = file.substr(extensionIndex + 1);
    if(extension !== 'htm' && extension != 'html') {
      return
    }

    fs.readFile(dataDirectory + file, function(err, data) {
      var $ = cheerio.load(data);
      var out = $('td.spacer2 p').text()
      out = out.replace(/\t/g, '')
      while(out != out.replace(/\n\n/g,'\n')) {
        out = out.replace(/\n\n/g,'\n')
      }
      fs.writeFileSync(dataDirectory + filename + '.txt', out);
    })
  })
})