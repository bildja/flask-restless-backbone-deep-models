//noinspection BadExpressionStatementJS
({
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
        locationUtil: 'app/base/locationUtil'
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
        }
    },
    deps: ['bootstrap']
})
