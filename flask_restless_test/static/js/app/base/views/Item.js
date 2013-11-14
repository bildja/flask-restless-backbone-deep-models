define(function (require) {
    'use strict';
    var Backbone = require('backbone');
    return Backbone.View.extend({
        tagName: 'tr',
        nameField: 'name',

        events: {
            'click .delete-item': 'deleteItem'
        },

        render: function () {
            this.$el.html(this.template({
                model: this.model
            }));
            return this;
        },

        deleteItem: function () {
            if (!confirm("You want to delete " + this.model.get(this.nameField) + "?")){
                return this;
            }
            this.model.destroy({
                success: function () {
                    this.$el.fadeOut();
                }.bind(this)
            });
            return this;
        }
    });
});
