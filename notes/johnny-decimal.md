---
title: Johnny Decimal
published: Feb 14, 2019
---
# Johnny Decimal

Recently, I've gotten into using the [Johnny Decimal](https://johnnydecimal.com/) system for organizing my digital files.

It's similar, and seems to draw inspiration from, to the classic [Dewey Decimal Classification](https://en.wikipedia.org/wiki/Dewey_Decimal_Classification) used in libraries. The idea is to be able to classify any and all items down to a single indexable number, such as `20.21`.

![My Johnny Decimal Setup](https://static.bpev.me/blog/johnny-decimal/jd-files.png)

This seems like a lot of extra memorization because, for example, `20.21` is not semantically connected to "[blog-o-matic](https://github.com/ivebencrazy/blog-o-matic)". However, it's actually less memorization. I have learned to connect these numbers with meaning. `2x`'s are code, so I immediately know it's code. I mainly do web stuff, so I put all my web projects in `20`. So I know it's web code. And I reserve `20.2x` for tooling, so I know that it's a tool. Just by using context clues, I know it's 1 of 2 projects I'm working on. If I were to search for this project, I can start typing `20.2`, and it comes up as one of the two suggestions!

![I use spotlight a LOT for navigation](https://static.bpev.me/blog/johnny-decimal/jd-search.png)

Essentially, I'm typing `20.2`, but I'm thinking `code-web-tool`. This way of organization has helped me move around my computer much faster. I don't want to repeat much more of the work of explaining the benefits and usage of this system, so I'll direct you to [johnnydecimal.com](https://johnnydecimal.com/), which has a great introduction to how it all works!

There are a few things I have added to Johnny's system, that I find useful.

# My Additions

## Tags

I layer a level of tags on top of this system as an aid for current events. For instance, I tag something as `active` when it's a work-in-progress. This is essentially my "TODO" list. I am still playing around with how I want to use these, but the biggest helps for this are `active`, and `reference`. I tag something as `active`, when I'm currently building it, and tag as `reference`, if I'm referring back to it, but not adding to it. I also keep an `archive` tag, that tells me when I'm ready to move something off of my computer into deeper storage (aka external hard drives). Lastly, I have a `published` tag, which isn't so much for finding stuff, but more to warn me that if I'm making edits to a file, that I have already published it somewhere.

![TAGS](https://static.bpev.me/blog/johnny-decimal/jd-tags.png)

## Symlinks

I use symlinks to point directories that need to be elsewhere into my root JD directory. For example...

```sh
ln -s \
"/Users/ben/Library/Mobile Documents/N39PJFAFEV~com~metaclassy~byword/Documents/Blog Posts" \
"/Users/ben/Documents/10-19 Writing/10 Prose/10.10 Blog/posts"
```

This lets me keep my blog posts in an iCloud-synced directory, while still organizing them in my Johnny Decimal system.

## Navigation Script

I mainly use one bash script for changing directories in my terminal:

```sh
cjd() {
  # If not args, nav to Documents
  if [ $# -eq 0 ]; then
    cd ~/Documents; ls

  # If arg has ".", find decimal folder
  elif [ $1 =~ ['.'] ]; then
    cd ~/Documents/*/*/${1}*/

  # If arg has "-", find area folder
  elif [ $1 =~ ['-'] ]; then
    cd ~/Documents/${1}*/; ls

  # If arg is number, find category folder
  else
    cd ~/Documents/*/${1}*/; ls
  fi
}
```

I added this to basically go `cjd 20.21` to cd into Blog-o-Matic, and I can then run `code ./` to open it in VSCode. EASY NAVIGATION.

# Anyways...

I have enjoyed using the Johnny Decimal System, and recommend giving it a try! Johnny's site is very clean, and makes it really easy to learn, so I recommend checking it out. Stay organized, everybody!
