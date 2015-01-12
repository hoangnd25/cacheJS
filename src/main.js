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

    var eventSubscribers  = {
        cacheAdded: [],
        cacheRemoved: []
    };

    /**
     * Group all functions that are shared across all providers
     */
    var _this = {

        getProvider: function (name) {
            switch (name) {
            case 'localStorage':
               return localStorageProvider;
            case 'array':
                return arrayProvider;
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
        generateContextKey: function(key,value){
            return DEFAULT.prefix + '_context_' + key + '_' + value;
        },
        /**
         * Get current time (compared to Epoch time) in seconds
         */
        getCurrentTime: function(){
            var timestamp = new Date().getTime();
            return Math.floor(timestamp/1000);
        },
        /**
         * Return default values
         */
        getDefault: function(){
            return DEFAULT;
        },
        /**
         * Return subscribers
         *
         * @returns {{cacheAdded: Array, cacheRemoved: Array}}
         */
        getEventSubscribers: function(){
            return eventSubscribers;
        },
        /**
         * Dispatch event to subscribers
         *
         * @param event Event name
         * @param object Object will be sent to subscriber
         */
        dispatchEvent: function(event, object){
            var callbacks = eventSubscribers[event];
            if(callbacks.length < 1){
                return;
            }
            for(var index = 0; index < callbacks.length; index++){
                if(typeof(callbacks[index]) !== 'undefined' && _this.isFunction(callbacks[index])){
                    callbacks[index](object);
                }
            }
        },
        /**
         * Check if x is a function
         *
         * @param x
         * @returns {boolean}
         */
        isFunction: function(x){
        return Object.prototype.toString.call(x) == '[object Function]';
        }
    };

    /**
     * Initiate providers as local variables
     */
    var localStorageProvider = new LocalStorageProvider(_this),
        arrayProvider = new ArrayProvider(_this);

    /**
     * Public functions
     */
    return {
        /**
         * @method Cache.use
         * @description Switch provider. available providers are: 'localStorage','array'
         *
         * @param provider
         */
        use: function(provider) {
            DEFAULT.provider = provider;
            return this;
        },
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
         * @param contexts - Contexts
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
        },
        /**
         * @method Cache.on
         * @description Subscribe to an event
         *
         * @param event
         * @param callback
         */
        on: function(event, callback){
            eventSubscribers[event].push(callback);
        },
        /**
         * @method Cache.unsubscribe
         * @description Unsubscribe to an event
         *
         * @param event
         * @param callback
         */
        unsubscribe: function(event, callback){
            var callbacks = eventSubscribers[event];
            for(var i = 0; i < callbacks.length; i++){
                if(callbacks[i] === callback){
                    delete callbacks[i];
                    break;
                }
            }
        }

    };
};





