var markov = require('markov');
var fs = require('fs')
var _ = require('lodash')

var dataFolder = 'script_data/'
var scriptFiles = [];
function main() {
  getScriptFiles();
}

var mg = markov(1);

function getScriptFiles() {
  fs.readdir(dataFolder, function(err, files) {
    // files.length = 20
    _.each(files,function(file) {
      var extensionIndex = file.lastIndexOf('.');
      var filename = file.substr(0, extensionIndex);
      var extension = file.substr(extensionIndex + 1);
      if(extension !== 'txt') {
        return
      }
      if(Math.random() > 0.1) {
        return;
      }
      console.log(file)
      var fullPath = dataFolder + file
      var script = fs.readFileSync(fullPath, {encoding: "utf-8"});
      var allLines = script.split('\n')
      var lines = [];
      _.each(allLines, function(line) {
        var speakingRegEx = /^[A-Z]+:/
        if(line.match(speakingRegEx)) {
          var quote = line.replace(speakingRegEx, '').trim()
          quote = quote.replace(/\([^\)]+\)/g, '')
          mg.seed(quote)
        }
      })
    })
    console.log('done')
    _.each(_.range(100), function(i) {
      var out = mg.forward(mg.pick(), 10)
      console.log(out)
    })

  })

};


main()