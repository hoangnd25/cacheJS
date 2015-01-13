var LocalStorageProvider = function (cacheJS) {
    return{
        get: function(key){
            var generatedKey = cacheJS.generateKey(key);
            var object = localStorage.getItem(generatedKey);

            if(object !== null){
                object = JSON.parse(object);
                // Check if the cache is expired
                if((cacheJS.getCurrentTime() - object.createdAt) >= object.ttl){
                    localStorage.removeItem(generatedKey);
                    return null;
                }
                return object.data;
            }
            return null;
        },
        set: function(key, value, ttl, contexts){
            ttl = ttl || cacheJS.getDefault().ttl;
            var cacheKey = cacheJS.generateKey(key);
            localStorage.setItem(cacheKey,
                JSON.stringify({
                    data: value,
                    ttl: ttl,
                    createdAt: cacheJS.getCurrentTime()
                })
            );

            for(var context in contexts){
                if(!contexts.hasOwnProperty(context)){
                    continue;
                }
                // Generate context key
                var contextKey = cacheJS.generateContextKey(context,contexts[context]);
                var storedContext = localStorage.getItem(contextKey);
                if(storedContext !== null){
                    storedContext = JSON.parse(storedContext);
                    var alreadyExist = false;
                    // Check if cache id already exist in saved context
                    // Use native function if the browser is supported
                    if(Array.prototype.indexOf){
                        alreadyExist = (storedContext.indexOf(cacheKey) >= 0);
                    }else{
                        for(var i = 0; i < storedContext.length; i++){
                            if(storedContext[i] == cacheKey){
                                alreadyExist = true;
                                break;
                            }
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

            cacheJS.dispatchEvent('cacheAdded',
                {
                    key: key,
                    value: value,
                    ttl: ttl,
                    contexts: contexts || null
                }
            );
        },
        removeByKey: function(key){
            var generatedKey = cacheJS.generateKey(key);
            var cache = localStorage.getItem(generatedKey);
            if(cache !== null){
                cache = JSON.parse(cache);
                localStorage.removeItem(generatedKey);
                cacheJS.dispatchEvent('cacheRemoved',
                    {
                        generatedKey: generatedKey,
                        value: cache.data,
                        ttl: cache.ttl
                    }
                );
            }
        },
        removeByContext: function(context){
            for(var key in context){
                if(context.hasOwnProperty(key)){
                    var contextKey = cacheJS.generateContextKey(key, context[key]);
                    var storedContext = localStorage.getItem(contextKey);
                    if(storedContext === null){
                        return;
                    }
                    var cacheIds = JSON.parse(storedContext);
                    for(var i = 0; i < cacheIds.length; i++){
                        var cache = JSON.parse(localStorage.getItem(cacheIds[i]));
                        localStorage.removeItem(cacheIds[i]);
                        cacheJS.dispatchEvent('cacheRemoved',
                            {
                                generatedKey: cacheIds[i],
                                value: cache.data,
                                ttl: cache.ttl
                            }
                        );
                    }
                    localStorage.removeItem(contextKey);
                }
            }
        }
    };
};
