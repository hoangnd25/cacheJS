var ProviderManager = function() {

    var DEFAULT = 'localStorage';

    return {

        init: function(cache) {
            this.localStorageProvider = new LocalStorageProvider(cache);
            this.arrayProvider = new ArrayProvider(cache);
        },

        use: function(provider) {
            DEFAULT = provider;
        },

        getProvider: function (name) {

            var providerName = name || DEFAULT;

            switch (providerName) {
                case 'localStorage':
                    return this.localStorageProvider;
                case 'array':
                    return this.arrayProvider;
            }
        }
    };
};
