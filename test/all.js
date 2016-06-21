window.providers.forEach(function(provider) {

    test("the base function exists", function() {
        ok(cacheJS);
    });

    test("Insert test", function() {
        var html = '<h1>Test blog 1</h1>';
        cacheJS.use(provider).set({
            blogId: 1,
            type: 'view'
        }, html);

        ok(
            cacheJS.use(provider).get({blogId: 1, type: 'view'}) == html
        );
    });

    test("Remove test", function() {
        cacheJS.use(provider).removeByKey({
            blogId: 1,
            type: 'view'
        });

        ok(
            cacheJS.use(provider).get({blogId: 1, type: 'view'}) == null
        );
    });

    test("Expired cache", function() {
        var html = '<h1>Test blog 2</h1>';
        cacheJS.use(provider).set({
            blogId: 2,
            type: 'view'
        }, html, 1);

        stop()
        setTimeout(function() {
            ok(
                cacheJS.use(provider).get({blogId: 2, type: 'view'}) === null
            );
            start();
        }, 1200);
    });

    test("Local storage quota limit", function() {

        cacheJS.removeByContext({quota_test: 1});

        for (var i = 0; i < 1000; i++){

            // creating long strings to fill memory instead of many short strings to avoid crashing browser
            var longString = '';
            for (var j = 0; j < 1000; j++)
                longString += j;

            var result = cacheJS.set({
                quota_test: i,
                type: 'test'
            },longString, null, {
                quota_test: 1
            });

            if (result == null)
                break;
        }

        // remove all test items
        cacheJS.removeByContext({quota_test: 1});

        ok(true);
    });
    
    test("Remove by context", function() {
        cacheJS.use(provider).set({
            blogId: 3,
            type: 'view'
        }, 'test', null, {
            author: 'hoangnd'
        });

        cacheJS.use(provider).set({
            blogId: 4,
            type: 'view'
        }, 'test', null, {
            author: 'hoangnd'
        });

        cacheJS.use(provider).removeByContext({author: 'hoangnd'});
        ok(
            cacheJS.use(provider).get({blogId: 3, type: 'view'}) === null &&
            cacheJS.use(provider).get({blogId: 4, type: 'view'}) === null
        );
    });

    /**
     * Start event testing
     */

    var listener = function() {
        ok(true);
        start();
    };

    test("Subscribe to cacheAdded", function() {
        cacheJS.use(provider).on('cacheAdded', listener);
        stop();
        cacheJS.use(provider).set({blogId: 4, type: 'view'}, 'blog 4');
    });

    test("Subscribe to cacheRemoved - Remove By Key", function() {
        cacheJS.use(provider).on('cacheRemoved', listener);
        stop();
        cacheJS.use(provider).removeByKey({blogId: 4, type: 'view'});
    });

    test("Unsubscribe to cacheAdded", function() {
        cacheJS.use(provider).unsubscribe('cacheAdded', listener);
        // If unsubscribe process is failed. The following statement will cause qunit to fail because func start() run twice
        cacheJS.use(provider).set({blogId: 5, type: 'view'}, 'blog 5', null, {author: 'hoangnd'});
        ok(true);
    });

    test("Subscribe to cacheRemoved - Remove By Context", function() {
        stop();
        cacheJS.use(provider).removeByContext({author: 'hoangnd'});
    });

    test("Unsubscribe to cacheRemoved", function() {
        cacheJS.use(provider).unsubscribe('cacheRemoved', listener);
        // If unsubscribe process is failed. The following statement will cause qunit to fail because func start() run twice
        cacheJS.use(provider).removeByKey({});
        ok(true);
    });
});
