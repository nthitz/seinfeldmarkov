var markov = require('markov');
var fs = require('fs')
var _ = require('lodash')

var dataFolder = 'script_data/'
var scriptFiles = [];
function main() {
  getScriptFiles();
}
//season episode lists
var seasonBounds = [
  [1,5],
  [6, 17],
  [18, 40],
  [41, 64],
  [65, 86],
  [87, 110],
  [111, 134],
  [135, 156],
  [157, 180]
]
//no one likes clip shows anyway
var episodesToSkip = [100, 101, 177, 178]

//what seasons do we want to sample. these are 1-indexed into seasonBreakdowns
var seasonsToSample = [2];


var mg = markov(2);

function getScriptFiles() {
  //
  var episodeBounds = _.map(seasonsToSample, function(d) { return seasonBounds[d - 1] })
  fs.readdir(dataFolder, function(err, files) {
    // files.length = 20
    _.each(files,function(file) {
      var extensionIndex = file.lastIndexOf('.');
      var filename = file.substr(0, extensionIndex);
      var extension = file.substr(extensionIndex + 1);
      //examine only text files
      if(extension !== 'txt') {
        return
      }
      //find the episode number in the filename
      var episodeNum = file.match(/^([0-9]+)-/)
      if(episodeNum === null) {
        return
      }
      episodeNum = +episodeNum[1]
      //determine if this is an episode we want to sample
      var sampleEpisode = false;
      _.each(episodeBounds, function(seasonBoundsToCheck) {
        if(sampleEpisode) return;
        if(episodeNum >= seasonBoundsToCheck[0] && episodeNum <= seasonBoundsToCheck[1]) {
          sampleEpisode = true
        }
      })
      //skip some specific episodes
      if(episodesToSkip.indexOf(episodeNum) !== -1) {
        return;
      }

      //continue on if we are not sampling this episode
      if(! sampleEpisode) {
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

      console.log(out.join(' '))
    })

  })

};


main()