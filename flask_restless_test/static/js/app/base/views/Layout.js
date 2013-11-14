define(function (require) {
    'use strict';
    var $ = require('jquery'),
        Backbone = require('backbone');
    return Backbone.View.extend({
        el: 'body',
        events: {
            'click a, .go-to': 'pushState'
        },
        pushState: function (evt) {
            evt.preventDefault();
            var $target = $(evt.target),
                path = $target.is('a') ? $target.attr('href') : $target.data('href');
            if (path) {
                Backbone.history.navigate(path, {
                    trigger: true
                });
            }
            return this;
        },

        setActiveLink: function () {
            this.$('.nav li')
                .removeClass('active')
                    .find('a[href="' + location.pathname + '"]')
                .closest('li')
                .addClass('active');
            return this;
        }
    });
});
