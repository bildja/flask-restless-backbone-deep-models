define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone');
    require('ajax-chosen');
    return Backbone.View.extend({
        initialize: function (options) {
            this.textField = options.textField;
            this.valueField = options.valueField;
            this.url = options.url;
            this.type = options.type;
            this.searchField = options.searchField;
        },

        render: function () {
            var $el = this.$el,
                textField = this.textField || $el.data('textField'),
                valueField = this.valueField || $el.data('valueField'),
                searchField = this.searchField || $el.data('searchField');
            $el.ajaxChosen({
                type: this.type || 'GET',
                url: this.url || $el.data('url'),
                dataType: 'json',
                jsonTermKey: 'q',
                dataCallback: function (lookup) {
                    lookup.q = JSON.stringify({
                        filters: [{
                            name: searchField,
                            val: "%" + lookup.q + "%",
                            op: "like"
                        }]
                    });
                    return lookup;
                }
            }, function (data) {
                return _.map(data.objects, function (resultData) {
                    return {
                        text: resultData[textField],
                        value: resultData[valueField]
                    }
                });
            });
        }
    });
});
