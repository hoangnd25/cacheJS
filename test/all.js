//cacheJS.use('array');

test("the base function exists", function() {
  ok(cacheJS);
});

test("Insert test", function() {
    var html = '<h1>Test blog 1</h1>';
    cacheJS.set({
        blogId: 1,
        type: 'view'
    },html);

    ok(
        cacheJS.get({blogId: 1, type: 'view'}) == html
    );
});

test("Remove test", function() {
    cacheJS.removeByKey({
        blogId: 1,
        type: 'view'
    });

    ok(
        cacheJS.get({blogId: 1, type: 'view'}) == null
    );
});

test("Expired cache", function() {
    var html = '<h1>Test blog 2</h1>';
    cacheJS.set({
        blogId: 2,
        type: 'view'
    },html,1);

    stop()
    setTimeout(function(){
        ok(
            cacheJS.get({blogId: 2, type: 'view'}) === null
        );
        start();
    },1200);
});

test("Remove by context", function() {
    cacheJS.set({
        blogId: 3,
        type: 'view'
    },'test',null,{
        author: 'hoangnd'
    });

    cacheJS.set({
        blogId: 4,
        type: 'view'
    },'test',null,{
        author: 'hoangnd'
    });

    cacheJS.removeByContext({author: 'hoangnd'});
    ok(
        cacheJS.get({blogId: 3, type: 'view'}) === null &&
        cacheJS.get({blogId: 4, type: 'view'}) === null
    );
});

/**
 * Start event testing
 */

var listener = function(){
    ok(true);
    start();
};

test("Subscribe to cacheAdded", function() {
    cacheJS.on('cacheAdded', listener);
    stop();
    cacheJS.set({blogId: 4, type: 'view'},'blog 4');
});

test("Subscribe to cacheRemoved - Remove By Key", function() {
    cacheJS.on('cacheRemoved', listener);
    stop();
    cacheJS.removeByKey({blogId: 4, type: 'view'});
});

test("Unsubscribe to cacheAdded", function() {
    cacheJS.unsubscribe('cacheAdded', listener);
    // If unsubscribe process is failed. The following statement will cause qunit to fail because func start() run twice
    cacheJS.set({blogId: 5, type: 'view'},'blog 5', null, {author: 'hoangnd'});
    ok(true);
});

test("Subscribe to cacheRemoved - Remove By Context", function() {
    stop();
    cacheJS.removeByContext({author: 'hoangnd'});
});

test("Unsubscribe to cacheRemoved", function() {
    cacheJS.unsubscribe('cacheRemoved', listener);
    // If unsubscribe process is failed. The following statement will cause qunit to fail because func start() run twice
    cacheJS.removeByKey({});
    ok(true);
});
