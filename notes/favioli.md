---
title: Favioli
published: Jul 6, 2018
---
# Favioli 👊

Favioli is a productivity extension that makes it easier to recognize tabs within your browser. Like this:

![Favioli Example](https://static.bpev.me/blog/favioli/comparison.png)

Favioli was originally inspired by two things. The first thing that spurred the idea was Eli Grey's [personal site](https://eligrey.com) and its use of javascript to make a rotating emoji favicon. The favicon of his site is a different emoji each time that persists within a session. It's pretty creative and fun! This was the creative inspiration for Favioli (fyi: Eli consolidated his emoji-to-favicon code into [Emoji Favicon Toolkit](https://github.com/eligrey/emoji-favicon-toolkit), if you want to use it in your own project)!

The practical inspiration for Favioli came from my day job. We have a lot of internal tools and sites, and they tend to either not have favicons, or have the standard Sony logo. For me this was a bit of a pain, because I love to pin my tabs. I couldn't tell these sites apart.

I could use a Chrome extension that lets me set custom favicons, but then I'd have to go through and specify each one. If I were to use emojis, I wouldn't have to deal with finding art for each individual site, and I could make something that could automatically make all of these pages recognizable at a glance.

## Building Favioli

Also, I probably could have used existing exmoji selectors instead of customizing an existing npm plugin. That being said, the project has been a fun exploration of javascript strings, chrome extensions, and browser/os string support.

As we look through everything, feel free to follow along by looking at Favioli's [source code](https://github.com/ivebencrazy/favioli)! All the Favioli code that is my own is licensed with the [Unlicense](https://unlicense.org/), so feel free to go crazy with it.

### Structure of a Browser Extension

There are essentially 4 pieces of any fully-local web extension that modifies a web page:

- Options: The internal website that extensions use for full-screen setting updates
- Popup: The mini-website that pops up when you click the extension icon
- Background: The background extension process that does stuff... in the background...
- ContentScript: The script that gets added to websites you visit in your web browser.

We use all of these except popup for Favioli. The general structure of our extension looks like this:

![Favioli's Structure](https://static.bpev.me/blog/favioli/structure-diagram.jpg)

There are essentially 4 pieces of any fully-local web extension that modifies a web page. Favioli currently takes advantage of 3 of these:

#### Settings: Options and Popup Pages

This is the simplest piece of Favioli, and for a good reason; it doesn't really do much. All we do here is run a basic website, "options.html", which saves data to a browser-provided storage mechanism. Similar to using localStorage, key differences being that it can sync between different browsers on multiple computers, and is available to other areas of our Chrome Extension that don't interact with a webpage. What this boils down to in Favioli is simply saving custom overrides and, in the future, things like icon packs and other settings.

![Options Page](https://static.bpev.me/blog/favioli/options-page.png)

The most complicated piece of the options page is the emoji selector, adapted from Dominic Valenicana's [Emoji Selector](https://github.com/Kiricon/emoji-selector). We use this to define a custom HTML element that we can use for the options page.

One thing we haven't implemented in Favioli is a popup page. In Chrome Extension land, the "popup" is the mini-site that shows up when you click the extenstion icon. We currently don't use this for Favioli, but it would be extremely useful for quick-pinning specific emojis to sites we are currently visiting. It would essentially follow the same formula as our Options page, though; featuring a user interface that simply feeds information to our background process.

#### Background: The Decision Engine

The Background process is Favioli's primary decision engine. It takes information from our content script and background process, and spits the correct emoji to each page. Our decision is a simple priority list: we just check each item and use the first rule to apply:

1. **User-set Overrides**: If a user has specified a favicon match via the options page, then the site will use that favicon.
2. **Site Default**: If the site has a favicon, then use that.
3. **Random Emoji**: If the site has not natural favicon, we generate a random one via a hashing algorithm.

The user-set overrides and site defaults are pretty straightforward; we can match pieces of a url, or match a regex. If it doesn't use those, then fall back to the site's default favicon. The more interesting case is if a site doesn't have a native Favicon.

##### Random Emoji Hash

The reasoning for using a non-cryptographic hash to determine emojis is based on one idea: there's no way in hell we're storing the settings of each site a person visits. THAT would be a pain in the ass. We use a hash of the website's host to map to an emoji with a custom set of char codes (we don't really want to randomly apply flag and symbol emojis to all the sites. It's just not as fun). This creates a function that creates a random emoji that is always the same for an individual website host, without storing any data.

#### Background: Applying the Favicon

Our decision process is run in 3 cases, which are in the background.js:

```javascript
// After we fetch our settings, start listening for url updates
init().then(function () {
  // If a tab updates, check to see whether we should set a favicon
  chrome.tabs.onUpdated.addListener(function (tabId, opts, tab) {
    tryToSetFavicon(tabId, tab);
  });
});

// Manually sent Chrome messages
chrome.runtime.onMessage.addListener(function (message, details) {
  // If we manually say a tab has been updated, try to set favicon
  // This happens when contentScript loads before settings are ready
  if (message === "updated:tab") tryToSetFavicon(details.tab.id, details.tab);

  // If our settings change, re-run init to fetch new settings
  if (message === "updated:settings") init();
});
```

`tryToSetFavicon` decides what emoji we want to use and sends it to our content script as an emoji message string, to render our emoji as a favicon. Our content script has a few additional checks for whether we should show our favicon, because there are some checks that can only be done on each individual site.

We can think of our bakground process as determining **WHEN** to set a favicon, and **WHAT** to set it as. The content script will determine **IF** a favicon truly gets set.

#### Content Script: Building Text Favicons

Our content script is the script that runs on each website we visit, appending or replacing the favicon when our background process tells it to. This scripts could be quite a bit simpler than we made it. The reason? Essentially, this boils down to one thing:

> Favicons are images. Emojis are not images.

Unfortunately, favicons still must be images, so we have to do a bit of hackery magic in order to show our native text emojis show up as favicons. This was the clever bit of code Eli wrote that I borrowed to make Favioli an image-less experience.

I should probably mention that there's definitely some over-engineering in Favioli. Practically, using the same clever method as Eli for creating legitimate emoji text favicons is not reeeeally necessary, and makes for some complications when it comes to multi-platform support. So this script coooould be "use a pre-rendered emoji image and add it as a favicon." That script would be easy, but WHAT FUN WOULD THAT BE?!?!

Let's jump into a condensed version of [the code we use](https://github.com/ivebencrazy/favioli/blob/master/source/utilities/faviconHelpers.js#L60) to create our favicons:

```javascript
// Initialize canvas and context to render emojis

const PIXEL_GRID = 16; // Standard favIcon size 16x16
const EMOJI_SIZE = 256; // 16 x 16

const canvas = document.createElement("canvas");
canvas.width = canvas.height = EMOJI_SIZE;

const context = canvas.getContext("2d");
context.font =
  `normal normal normal ${EMOJI_SIZE}px/${EMOJI_SIZE}px sans-serif`;
context.textAlign = "center";
context.textBaseline = "middle";

function createEmojiUrl(char) {
  const { width } = context.measureText(char);

  // Bottom and Left of the emoji (where we start drawing on canvas)
  // Since favicons are a square, we can use the same number for both
  const center = (EMOJI_SIZE + EMOJI_SIZE / PIXEL_GRID) / 2;
  const scale = Math.min(EMOJI_SIZE / width, 1); // Adjust canvas to fit
  const center_scaled = center / scale;

  // Scale and resize the canvas to adjust for width of emoji
  context.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
  context.save();
  context.scale(scale, scale);

  // context.fillText(char, bottom, left)
  context.fillText(char, center_scaled, center_scaled);
  context.restore();

  // We need it to be an image
  return canvas.toDataURL("image/png");
}
```

We make a canvas, draw a centered piece of favicon text, then convert that canvas drawing into a png [data url](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs). We can set favicons with data urls, so at this point, we just need to add our favicon to the site!

#### Content Script: Appending Favicons

The last step of Favioli is appending a favicon to the site we visit. Appending a favicon to an existing site can have a few complications, mainly stemming from the fact that different sites apply their favicons in different ways. We have a few different cases that affect how Favioli adds favicons:

##### 1. Custom Favicon Path

This is the easiest to deal with; when a site has a custom favicon path, we can be assured that it has a favicon, and we can either override it or leave it be, depending on our settings.

##### 2. Weird path changes

Sometimes a site changes path and expects the favicon to persist through the site. To maintain consistency, and to avoid unnecessary work, favioli memoizes the decision of whether a site has a custom favicon within the context of a session.

##### 3. No Favicon in the HTML

When there is no specified favicon, there are two things it could mean. It could mean that a website is either using the default `favicon.ico`, or it doesn't have a favicon. It could be confusing if we try to determine which of these is happening, though. So instead, Favioli simply appends a `favicon.ico` link after it appends our emoji favicon in cases where we shouldn't override the default emoji. This way, our emoji favicon gets overridden by the default one.

```javascript
const href = memoizedEmojiUrl(name);

if (existingFavicon) {
  existingFavicon.setAttribute("href", href);
} else {
  const link = createLink(href, EMOJI_SIZE, "image/png");
  existingFavicon = documentHead.appendChild(link);

  if (!shouldOverride) {
    const defaultLink = createLink("/favicon.ico");
    documentHead.appendChild(defaultLink);
  }
}
```

## BY JOVE WE HAVE DONE IT

At this point, we have appended a text emoji as a favicon, so we've successfully completed our mission to emoji-fy the universe! With Favioli, we no longer need to worry about the dreaded favicon-less existence that some people still somehow call life.

## Where do we go from here?

There are a myriad of ways we can extend Favioli in the future. To give you an idea, here are some ideas we have been thinking about:

#### Custom sets for Randomly Selected Emojis

This would be the easiest way to deal with cross-platform compatibility; just change the set that we randomly select from. This will let people better customize their experience.

#### Custom pngs as Favicons

This would create more utility for Favioli. I feel our default offering is better than most favicon replacement extensions. But not being able to set custom pngs is a real killer from being the best one out there. Also, though... gif favicons. Imagine how hilarious (and technically dumb) that could be. Using pngs as a fallback could also be used for browsers, os that are insufficient for life and don't have the new emojis.

#### Custom Application Overrides

It would be cool to be able to override some aspects of page load in a smarter and more fun way. Image 😭 emojis for 404/500 page responses, 👀 for non-https sites or something like that. These would be configured in settings, but could be a fun way to interact with the web.

#### Popup Page

This is a pretty obvious one; A useful UI update

#### Stats for nerds

Being able to apply Favioli to browser history would be fun. We'd have to play with permission settings so that Favioli is only enabled on this page, but could be interesting...

Anywhoooooo...

This is Favioli! Check it out! Send a PR if you want a feature, or just use it! [Favioli](https://favioli.com) [Source Code](https://github.com/ivebencrazy/favioli)

😘 ❤️🤯, Ben Pevsner

![Favioli](https://static.bpev.me/blog/favioli/favioli-favioli.png)
