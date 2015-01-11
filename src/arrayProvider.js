var ArrayProvider = function(cacheJS){
    var cacheArray = {},
        cacheContexts = {};

    return{
        get: function(key){
            var generatedKey = cacheJS.generateKey(key);
            if(cacheArray.hasOwnProperty(generatedKey)){
                var object = cacheArray[generatedKey];
                // Check if the cache is expired
                if((cacheJS.getCurrentTime() - object.createdAt) >= object.ttl){
                    delete cacheArray[generatedKey];
                    return null;
                }
                return object.data;
            }else{
                return null;
            }
        },
        set: function(key, value, ttl, contexts){
            var generatedKey = cacheJS.generateKey(key);
            ttl = ttl === null ? cacheJS.getDefault().ttl : ttl;
            cacheArray[generatedKey] = {
                data: value,
                ttl: ttl,
                createdAt: cacheJS.getCurrentTime()
            };

            for(var context in contexts){
                if(!contexts.hasOwnProperty(context)){
                    continue;
                }
                // Generate context key
                var contextKey = cacheJS.generateContextKey(context,contexts[context]);
                var storedContext = cacheContexts.hasOwnProperty(contextKey) ? cacheContexts[contextKey] : null;
                if(storedContext !== null){
                    var alreadyExist = false;
                    // Check if cache id already exist in saved context
                    // Use this loop as Array.indexOf not available IE8 end below
                    for(var i = 0; i < storedContext.length; i++){
                        if(storedContext[i] == generatedKey){
                            alreadyExist = true;
                            break;
                        }
                    }
                    if(!alreadyExist){
                        storedContext.push(generatedKey);
                    }
                }else{
                    storedContext = [generatedKey];
                }
                cacheContexts[contextKey] = storedContext;
            }
        },
        removeByKey: function(key){
            var generatedKey = cacheJS.generateKey(key);
            if(cacheArray.hasOwnProperty(generatedKey)){
                delete cacheArray[generatedKey];
            }
        },
        removeByContext: function(context){
            for(var key in context){
                if(context.hasOwnProperty(key)){
                    var contextKey = cacheJS.generateContextKey(key, context[key]);
                    var storedContext = cacheContexts.hasOwnProperty(contextKey) ? cacheContexts[contextKey] : null;
                    if(storedContext === null){
                        return;
                    }
                    for(var i = 0; i < storedContext.length; i++){
                        delete cacheArray[storedContext[i]];
                    }
                    delete cacheContexts[contextKey];
                }
            }
        }
    };
};
