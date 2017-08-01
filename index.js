var Twitter = require('twitter')
var fs = require('fs')
var crypto = require('crypto')
require('dotenv').config()

var client = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
})

var read = fs.createReadStream('./pass.txt')
var result
list = []
read.on('data', (chunk) => {
  list.push(chunk.toString().split('\n').filter((x) => {
    if(!parseInt(x)) {
      return true
    }
  }))
  list = [].concat.apply([], list)

  result = list.find((x) => {
    var hashed = hash(x)
    return hashed.toString('base64')[0] === '0'
  })
})
read.on('end', ()=> {
  console.log(result)
  postTweet(result)
})


function hash(input) {
  var sha = crypto.createHash('sha1')
      sha.update((input + Math.random()).toString())
      return sha.digest()
}


function postTweet(result) {
  client.post('statuses/update', {
    status: result,
    screen_name: 'Shit'
  }, function(error, tweet, response) {
    if(response) {
      console.log(response)
    }
    if (error) {
      console.log(error)
    };
    console.log(tweet);
  })
}
