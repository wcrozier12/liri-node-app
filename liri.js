let keys = require('./keys.js');
let fs = require('fs');
let request = require('request');
let omdbKey = '40e9cece';
let twitter = keys.twitter;
let spotify = keys.spotify;
let userName = {screen_name: 'croziercode'};
let output = '';


let action = process.argv[2];
let query = process.argv[3];

//Calls twitter API to get the last 20 tweets of whatever screen name is defined at the userName variable
let getTweets = function() {
  twitter.get('statuses/user_timeline', userName, function(error, tweets, response) {
    if (error) {
      console.log('Error occured ' + error);
    }
    console.log('---------------HERE ARE YOUR ' + tweets.length + ' MOST RECENT TWEETS-------------')
    for (let i = 0; i < tweets.length; i++) {
      output += '@' + userName.screen_name + ': ' + tweets[i].text + ' Posted on ' + tweets[i].created_at + '\n';
    }
    console.log(output);
    console.log('----------------------------------------------------------------------------------')
    logCommand();
  });
}

//Calls spotify API to get users song request
let getSongs = function() {
  // If user does not input a query, returns data for "The Sign".
  if (query === undefined) {
    query = 'The Sign';
    spotify.search({ type:'track', query: query}, function(err, data) {
      if (err) {
        console.log('Error occured: ' + err);
      }
    console.log('----------------COULDNT FIND YOUR SONG. HERES A GOOD ONE THO----------------------')
    output = 'Artist: ' + data.tracks.items[0].artists[0].name + '\nTrack: ' + data.tracks.items[0].name + '\nAlbum: ' + data.tracks.items[0].album.name + '\nAlbum: ' + data.tracks.items[0].album.name + '\nPreview here: ' + data.tracks.items[0].preview_url;
    console.log(output);
    console.log('----------------------------------------------------------------------------------')
    logCommand();
  });
    return;
  } 
  spotify.search({ type:'track', query: query}, function(err, data) {
    if (err) {
      console.log('Error occured: ' + err);
    }
    console.log('-------------------------HERE IS THE SONG I FOUND---------------------------------')
    output = 'Artist: ' + data.tracks.items[0].artists[0].name + '\nTrack: ' + data.tracks.items[0].name + '\nAlbum: ' + data.tracks.items[0].album.name + '\nAlbum: ' + data.tracks.items[0].album.name + '\nPreview here: ' + data.tracks.items[0].preview_url;
    console.log(output);
    console.log('----------------------------------------------------------------------------------')
    logCommand();
  });
  
}

//Calls OMDB API to get users movie input
let getMovie = function() {
//If user does not input a query, returns data for "Mr. Nobody".
    if (query === undefined) {
      query = 'Mr. Nobody';
      request('http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + query.split(' ').join('+'), function (error, response, body) {
        body = JSON.parse(body);
        console.log('----------------COULDNT FIND YOUR MOVIE. HERES A GOOD ONE THO------------------')
        output = 'Title: ' + body.Title + '\nRelease Year: ' + body.Year + '\nIMDB Rating: ' + body.imdbRating + '\nRotten Tomatoes Rating: ' + body.Ratings[1].Value + '\nProduced in: ' + body.Country + '\nLanguage: ' + body.Language + '\nPlot: ' + body.Plot + '\nActors: ' + body.Actors 
        console.log(output);
        console.log('-------------------------------------------------------------------------------')
        logCommand();
      });
      return;
    }
  request('http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + query.split(' ').join('+'), function (error, response, body) {

    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      console.log('---------------------------AHHH! WHAT A CLASSIC!---------------------------------')
      output = 'Title: ' + body.Title + '\nRelease Year: ' + body.Year + '\nIMDB Rating: ' + body.imdbRating + '\nRotten Tomatoes Rating: ' + body.Ratings[1].Value + '\nProduced in: ' + body.Country + '\nLanguage: ' + body.Language + '\nPlot: ' + body.Plot + '\nActors: ' + body.Actors 
      console.log(output);
      console.log('---------------------------------------------------------------------------------')
      logCommand()
    }
  }); 
}
//Reads random.txt, splits the array at commas, creates a random number and then associates that random number with the appropriate action/query combo
let random = function() {
  fs.readFile('random.txt', 'utf8', function(error,data) {
    if (error) {
      console.log('Error occured: ' + error);
    }
    let dataArr = data.split(',');
    let randomItem = Math.floor(Math.random() * dataArr.length);
    // if random number is at index 1 or an odd index then it is a query in the data array from random.txt and the action is at an index of query-1.
    if (randomItem === 1 || randomItem % 2 !== 0 ) {
      query = dataArr[randomItem]
      action = dataArr[randomItem - 1]
    }
    else {
      action = dataArr[randomItem]
      query = dataArr[randomItem + 1];
    }
    run();
  })
}

//Takes output variable that is defined at each API call and logs it to log.txt
let logCommand = function() {
  fs.appendFile('log.txt', '\n---------------------------------------------------------------------------------\n' +  output + '\n---------------------------------------------------------------------------------' + '\n'  , function(err) {
    if (err){
      console.log('Error Occured: ' + err);
    }
    console.log('Data added!')
  })
}

// Evaluates the user command and runs the appropriate function.
let run = function() {
  switch(action) {
    case 'do-what-it-says':
      random();
      break;
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      getSongs();
      break;
    case 'movie-this':
      getMovie();
      break;
  }
}
run();
