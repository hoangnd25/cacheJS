#### API

##### cacheJS.set(key,value,ttl,context) 

`key`: an array(object).

`value`: only support string at the momment.

`ttl`: time to live (in seconds), default: 604800

`context`: array of contexts related to the cache


##### cacheJS.get(key) 

`key`: an array(object).


##### cacheJS.removeByKey(key) 

`key`: an array(object).


##### cacheJS.removeByContext(context) 

`key`: an array(object).


##### cacheJS.use(provider) 
Switch cache provider (localStorage is the default provider)

`provider`: provider name ('localStorage','array').
