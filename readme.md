# MastodonTranslate

## A tampermonkey script to add a Translate Toot option to toots via GoogleTranslate

### Install // Setup

You'll first want Tampermonkey/Greasemonkey for your relevant browser then to install this script head to: https://github.com/tomouchuu/mastodon-translate/raw/master/index.user.js and tampermonkey should prompt you to install the script.

Next head to your instance and head to your preferences (/settings/preferences) and there should be an area for the Translation script. If you're happy for the translations to be done via Google then click the checkbox to agree to this and then set the language you want toots to be translated into. Once that's set, click save changes and then head back to your feeds, give the page another refresh to activate the script again (see limitation below).

### Limitations

* ~~Will only work on niu.moe instance~~ Kinda fixed - [#2](https://github.com/tomouchuu/mastodon-translate/issues/2)

### What it does

Upon clicking the ellipsis (...) you should see an option to translate toot, click this and it will translate the toot via GoogleTranslate proxy (https://github.com/uchuuio/translate-server || https://translate.uchuu.io) into english by default. To change this to your desired language, head to your mastodon preferences in settings and you should see an option for translate language. Select the language you'd like and then save changes, head back to the feed and refresh the page.

If you haven't yet agreed to using Google Translate it will take you to your preferences page where you can enable this option.

### Issues

If you're having issues with the script, please feel free to reach out to me by raising an issue here or messaging me on mastodon at https://niu.moe/@tomo or [@tomouchuu](https://www.twitter.com/tomouchuu) on twitter.