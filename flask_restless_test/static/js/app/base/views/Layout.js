define(function (require) {
    'use strict';
    var $ = require('jquery'),
        Backbone = require('backbone'),
        locationUtil = require('locationUtil');
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
            var pathname = locationUtil.getPathname();
            this.$('.nav li')
                .removeClass('active')
                    .find('a').filter(function () {
                        var href = $(this).attr('href');
                        return href === pathname || pathname.indexOf(href + '/') === 0;
                    })
                .closest('li')
                .addClass('active');
            return this;
        }
    });
});
