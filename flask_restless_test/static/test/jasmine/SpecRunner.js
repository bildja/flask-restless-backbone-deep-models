require.config({
    baseUrl: '/static/js',
    urlArgs: '_=' + new Date().getTime(),
    paths: {
        jquery: 'lib/jquery-2.0.3',
        bootstrap: 'lib/bootstrap',
        backbone: 'lib/backbone',
        underscore: 'lib/lodash',
        text: 'lib/text',
        datepicker: 'lib/bootstrap-datetimepicker',
        moment: 'lib/moment-with-langs',
        chosen: 'lib/chosen.jquery',
        'ajax-chosen': 'lib/ajax-chosen',
        'deep-model': 'lib/backbone-deep-model',
        'backbone-mediator': 'lib/backbone-mediator',
        jasmine: '../test/jasmine/lib/jasmine',
        'jasmine-html': '../test/jasmine/lib/jasmine-html',
        'jasmine-boot': '../test/jasmine/lib/boot',
        'jasmine-jquery': '../test/jasmine/lib/jasmine-jquery',

        spec: '../test/jasmine/spec/'
//        'main': 'main-build'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        datepicker: {
            deps: ['bootstrap', 'moment']
        },
        moment: {
            exports: 'moment'
        },
        chosen: {
            deps: ['jquery']
        },
        'ajax-chosen': {
            deps: ['chosen']
        },
        jasmine: {
            exports: 'jasmineRequire'
        },
        'jasmine-jquery': {
            deps: ['jquery'],
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmineRequire'
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html'],
            exports: 'jasmine'
        }
    },
    deps: ['bootstrap']
});


require(['jasmine-boot']);
