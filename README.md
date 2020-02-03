# What is Smarf?

Smarf is a simple static blog generator written to replace my Wordpress installation.

Smarf was written as an exercise to learn more about TypeScript and file I/O in Node. As such, it only supports the creation of posts, archives and an RSS feed. It is not very configurable and was written to suit my particular use case. Use at your own risk!

## Building the project

1. install Node and Typescript
2. in the repo directory, type `npm run build`
3. HTML and RSS output will be placed in a `html` directory

## Writing a post

1. in the repo directory, run `node ./build/create-post.js -t 'My post title'`
2. this will create a Markdown file in the `posts` directory
3. edit this file to add the body of the post
4. (optional) add tags to the metadata
5. when you're done editing, run `npm run build` to generate the HTML page for this post

## Publishing

Upload the contents of `html` to your hosting provider.