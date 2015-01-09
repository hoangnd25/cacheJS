# cacheJS

Small JS lib for caching:
* Use array as key for storing cache instead of string ( {blogId:1,type:'view'} )
* Clear cache using context (clear blog posts of an author)
* Support localStorage, array, cookies (WIP, only localStorage is available at the moment)

See the [project homepage](http://hoangnd25.github.io/cacheJS).

## Installation
Using Bower:

    bower install cache-js

Or grab the file [source](https://raw.githubusercontent.com/hoangnd25/cacheJS/master/dist/cacheJS.js) ([minified](https://raw.githubusercontent.com/hoangnd25/cacheJS/master/dist/cacheJS.min.js)).

## Usage

Save cache:

    cacheJS.set({blogId:1,type:'view},'<h1>Blog 1</h1>');
    cacheJS.set({blogId:2,type:'view},'<h1>Blog 2</h1>', null, {author:'hoangnd'});
    cacheJS.set({blogId:3,type:'view},'<h1>Blog 3</h1>', 3600, {author:'hoangnd',categoryId:2});
    
Retrieve cache:
    
    cacheJS.get({blogId: 1,type: 'view'});
    
Flush cache

    cacheJS.removeByKey({blogId: 1,type: 'view'});
    cacheJS.removeByKey({blogId: 2,type: 'view'});
    
    cacheJS.removeByContext({author:'hoangnd'});
    
For advanced usage, see the documentation.

## Documentation

Start with [`docs/INDEX.md`](https://github.com/hoangnd25/cacheJS/blob/master/docs/INDEX.md).

MIT. See `LICENSE.txt` in this directory.
