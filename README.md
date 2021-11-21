# Why don't you tweet?

Send a tweet from a GitHub actions workflow!

## Installation

To allow GitHub Actions to send tweets programmatically, you'll need to:

- Create a new Twitter application from your [developer console](https://developer.twitter.com/apps).
- Configure the authentication keys and tokens for your Twitter app as secrets in your repository.
- Add the `Usage` section code to your workflow's.

## Secret Configuration

- `TWITTER_CONSUMER_API_KEY`
- `TWITTER_CONSUMER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_TOKEN_SECRET`

## Usage

Copy & Customize the following code into your workflow:

```yml
name: tweet-release

# More triggers
# https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#release
on:
  release:
    types: [published]

jobs:
  tweet:
    runs-on: ubuntu-latest
    steps:
      - uses: Eomm/why-don-t-you-tweet@v1
        if: ${{ !github.event.repository.private }}
        with:
          # GitHub event payload
          # https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#release
          tweet-message: "New ${{ github.event.repository.name }} release ${{ github.event.release.tag_name }}! Try it will it is HOT! ${{ github.event.release.html_url }} #nodejs #release"
        env:
          # Get your tokens from https://developer.twitter.com/apps
          TWITTER_CONSUMER_API_KEY: ${{ secrets.TWITTER_CONSUMER_API_KEY }}
          TWITTER_CONSUMER_API_SECRET: ${{ secrets.TWITTER_CONSUMER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
```

## Development this Action

Read the [developer documentation](https://github.com/actions/javascript-action#package-for-distribution).

## License

Copyright [Manuel Spigolon](https://github.com/Eomm), Licensed under [MIT](./LICENSE).
