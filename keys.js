var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var twitter = new Twitter ({
  consumer_key: 'B1Oa2huOvkIGN9jj2htAPJRC6',
  consumer_secret: 'MRhD6RATBmaFtApDvBs7HXgfS80gNNJfenfnLbYB5tWTg0LbWl',
  access_token_key: '909820561324249088-51gZQAWuJQ8GigIJJUbT9ZLpT1TMJFM',
  access_token_secret: 'Yi2UJ1HKgDdwgyPIYux0TsCT28xrSrBaJ70qzFKJ45t1C',
})

var spotify = new Spotify ({
  id: '80e62b314dac472bae3b72015e724401',
  secret: '0593ecf4af704e128bb957b03551e386',
});

module.exports = {
  twitter,
  spotify,
};