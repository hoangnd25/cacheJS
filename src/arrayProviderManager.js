var ProviderManager = function() {

    var DEFAULT = 'array';

    return {

        init: function(cache) {
            this.arrayProvider = new ArrayProvider(cache);
        },

        use: function(name) {
            if(name !== DEFAULT) {
                throw new Error('Provider '+name+' not available, only option is: '+DEFAULT);
            }
        },

        getProvider: function(name) {
            return this.arrayProvider;
        }
    };
};
