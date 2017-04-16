# MastodonTranslate

## A quick/dirty tampermonkey script to add a Translate Toot option to toots

### Install

To install this script head to: https://github.com/tomouchuu/mastodon-translate/raw/master/index.user.js

### Limitations

* Will only translate languages to english - #1
* Will only work on niu.moe instance - #2

### What it does

The script loops through the page every 60 seconds getting all the statuses and adds an option to the eplisips (...) to translate toot. Clicking this will open a new tab to google translate where it will attempt to auto detect the language of the toot and translate it into English.