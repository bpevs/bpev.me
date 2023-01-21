---
title: Blog-o-Matic
published: 2019-01-12
---
# Blog-o-Matic

**NOTE: BLOG-O-MATIC IS NO LONGER USED OR MAINTAINED. I AM JUST KEEPING THIS HERE FOR INFORMATIONAL PURPOSES.**

[Blog-o-Matic](https://github.com/ivebencrazy/blog-o-matic) connects your markdown-editing software to your chosen method of blog distribution with as little friction as possible. I made this so that I can have this process:

1. Write a plain-text blog post on my computer or on my phone
2. Sync edits between my devices via [iCloud](https://www.icloud.com)
3. Have a 1-step publish process from my computer to [my blog](https://bpev.me)

![My Workflow](https://static.bpev.me/blog/blog-o-matic/blog-o-matic-workflow.png)

Blog-o-Matic fills the 3rd step of that process, and organizes the 2nd. It takes my blog posts as source, optimizes images into multiple sizes for speed and progressive loading, parses markdown into various formats, minifies and compresses where useful, and uploads the results to S3. I currently use Blog-o-Matic to power my blog, running on [bpev.me](https://bpev.me).

![After Building](https://static.bpev.me/blog/blog-o-matic/blog-o-matic-built.png)

# Using Blog-o-Matic

To describe how I built Blog-o-Matic, it's helpful to know how I'm using it! This section is a short explanation of how things work. I'm going to skip a lot of stuff, though, so if you're looking for an actual user guide, there are more detailed documents in the Github repo.

At it's core, Blog-o-Matic usage depends on 4 commands:

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `blog init`    | Generate a blog structure                        |
| `blog post`    | Generate Markdown for a blog post                |
| `blog preview` | Serve the blog locally, and open it as a website |
| `blog publish` | Publish the blog, using the selected publisher   |

![Running `blog init`](https://static.bpev.me/blog/blog-o-matic/blog-o-matic-init.png)

## Post

```html
<html>
  <head>
    <% if (frontmatter) { %>
      <title><%= frontmatter.title %></title>
    <% } %>
    <!-- stylesheets -->
  </head>
  <body>
    <div class="mt4 mb4 mx-auto fit-800 article">
      <%- blog %>
    </div>

    <!-- Highlight.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
  </body>
</html>
```
