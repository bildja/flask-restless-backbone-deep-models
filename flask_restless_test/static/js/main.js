define(function (require) {
    "use strict";
    var $ = require('jquery'),
        Backbone = require('backbone'),
        Layout = require('app/base/views/Layout'),
        AppRouter = require('app/AppRouter'),
        router = new AppRouter();
    Backbone.history.start({
        pushState: true
    });
    var layoutView = new Layout();
    router.on('route', function () {
        layoutView.setActiveLink();
    });
});
