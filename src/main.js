/**
 * @namespace
 */
var Cache = function () {
    /**
     * Default values
     */
    var DEFAULT = {
        prefix: '_cache',
        ttl: 604800,
        provider: 'localStorage'
    };

    /**
     * Group all functions that are shared across all providers
     */
    var _this = {

        getProvider: function (name) {
            switch (name) {
            case 'localStorage':
                return localStorageProvider;
            //case 'array':
            //    return arrayProvider;
            }
        },
        /**
         * Accept keys as array e.g: {blogId:"2",action:"view"} and convert it to unique string
         */
        generateKey: function (object) {
            var generatedKey = DEFAULT.prefix + '_',
                keyArray = [];

            for (var key in object){
                if(object.hasOwnProperty(key))
                {
                    keyArray.push(key);
                }
            }

            keyArray.sort();
            for(var i=0; i<keyArray.length; i++){
                generatedKey += keyArray[i] + '_' + object[keyArray[i]];
                if(i !== (keyArray.length - 1)){
                    generatedKey += '__';
                }
            }
            return generatedKey;
        },
        /**
         * Get current time (compared to Epoch time) in seconds
         */
        getCurrentTime: function(){
            var timestamp = new Date().getTime();
            return Math.floor(timestamp/1000);
        }
    };

    var localStorageProvider = {
        get: function(key){
            var generatedKey = _this.generateKey(key);
            var object = localStorage.getItem(generatedKey);

            if(object !== null){
                object = JSON.parse(object);
                // Check if the cache is expired
                if((_this.getCurrentTime() - object.createdAt) >= object.ttl){
                    localStorage.removeItem(generatedKey);
                    return null;
                }
                return object.data;
            }
            return null;
        },
        set: function(key, value, ttl, contexts){
            ttl = ttl || DEFAULT.ttl;
            var cacheKey = _this.generateKey(key);
            localStorage.setItem(cacheKey,
                JSON.stringify({
                    data: value,
                    ttl: ttl,
                    createdAt: _this.getCurrentTime()
                })
            );

            for(var context in contexts){
                if(!contexts.hasOwnProperty(context)){
                    continue;
                }
                // Generate context key
                var contextKey = this.getContextKey(context,contexts[context]);
                var storedContext = localStorage.getItem(contextKey);
                if(storedContext !== null){
                    storedContext = JSON.parse(storedContext);
                    var alreadyExist = false;
                    // Check if cache id already exist in saved context
                    // Use this loop as Array.indexOf not available IE8 end below
                    for(var i = 0; i < storedContext.length; i++){
                        if(storedContext[i] == cacheKey){
                            alreadyExist = true;
                            break;
                        }
                    }
                    if(!alreadyExist){
                        storedContext.push(cacheKey);
                    }
                }else{
                    storedContext = [cacheKey];
                }
                localStorage.setItem(contextKey,JSON.stringify(storedContext));
            }
        },
        getContextKey: function(key,value){
            return DEFAULT.prefix + '_context_' + key + '_' + value;
        },
        removeByKey: function(key){
            var cache = localStorage.getItem(_this.generateKey(key));
            if(cache !== null){
                localStorage.removeItem(_this.generateKey(key));
            }
        },
        removeByContext: function(context){
            for(var key in context){
                if(context.hasOwnProperty(key)){
                    var contextKey = this.getContextKey(key, context[key]);
                    var storedContext = localStorage.getItem(contextKey);
                    if(storedContext === null){
                        return;
                    }
                    var cacheIds = JSON.parse(storedContext);
                    for(var i = 0; i < cacheIds.length; i++){
                        localStorage.removeItem(cacheIds[i]);
                    }
                    localStorage.removeItem(contextKey);
                }
            }
        }
    };

    //var arrayProvider = {
    //    get: function(key){
    //    },
    //    set: function(key, value, ttl){
    //    },
    //    removeByKey: function(key){
    //    },
    //    removeByContext: function(context){
    //    }
    //};

    /**
     * Public functions
     */
    return {
        /**
         * @method Cache.get
         * @description Get cache by array key
         *
         * @param key - Array key
         * @returns {string}
         * @example
         * Cache.get({blogId:"2",action:"view"});
         */
        get: function(key){
            return _this.getProvider(DEFAULT.provider).get(key);
        },
        /**
         * @method Cache.set
         * @description Save data for key
         *
         * @param key - Array key
         * @param value - value must be a string
         * @param ttl - Time to live in seconds
         * @returns {Cache}
         */
        set: function(key, value, ttl, contexts){
            _this.getProvider(DEFAULT.provider).set(key, value, ttl, contexts);
            return this;
        },
        /**
         * @method Cache.setPrefix
         * @description Set prefix for cache key (default: _cache)
         *
         * @param prefix
         * @returns {Cache}
         */
        setPrefix: function(prefix){
            DEFAULT.prefix = prefix;
            return this;
        },
        /**
         * @method Cache.getPrefix
         * @description Get prefix for cache key
         *
         * @returns {string}
         */
        getPrefix: function(){
            return DEFAULT.prefix;
        },
        /**
         * @method Cache.removeByKey
         *
         * @param key
         * @returns {Cache}
         */
        removeByKey: function(key){
            _this.getProvider(DEFAULT.provider).removeByKey(key);
            return this;
        },
        /**
         * @method Cache.removeByContext
         *
         * @param context
         * @returns {Cache}
         */
        removeByContext: function(context){
            _this.getProvider(DEFAULT.provider).removeByContext(context);
            return this;
        }

    };
};

// Version.
Cache.VERSION = '1.0.0';

// Export to the root, which is probably `window`.
root.cacheJS = new Cache();




