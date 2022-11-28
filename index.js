'use strict'

const core = require('@actions/core')
const { TwitterApi } = require('twitter-api-v2')

// most @actions toolkit packages have async methods
async function run () {
  try {
    const tweet = getInput('tweet-message', { mandatory: true })

    const tweetLength = getInput('length', { defaultValue: 280 })
    if (tweet.length > tweetLength) {
      throw new Error(`Tweet is too long. Max length is ${tweetLength}`)
    }

    const consumerKey = getEnv('TWITTER_CONSUMER_API_KEY', { mandatory: true })
    const consumerSecret = getEnv('TWITTER_CONSUMER_API_SECRET', { mandatory: true })
    const accessToken = getEnv('TWITTER_ACCESS_TOKEN', { mandatory: false })
    const accessTokenSecret = getEnv('TWITTER_ACCESS_TOKEN_SECRET', { mandatory: false })

    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: accessTokenSecret
    })

    const response = await client.v2.post('tweets', {
      text: tweet
    })
    console.log(response)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

function getInput (name, { mandatory, defaultValue } = {}) {
  const input = core.getInput(name) || defaultValue
  if (!input && mandatory === true) {
    throw new Error(`${name} is a required input`)
  }
  return input
}

function getEnv (name, { mandatory, defaultValue } = {}) {
  const env = process.env[name]
  if (!env && mandatory === true) {
    throw new Error(`${name} is a required environment variable`)
  }
  return env
}
