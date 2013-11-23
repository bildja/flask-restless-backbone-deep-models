define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        noteTemplate = require('text!/static/templates/notes/note.html');
    return Backbone.View.extend({
        template: _.template(noteTemplate),
        className: 'note',

        events: {
            'click .delete-note': 'deleteNote'
        },

        id: function () {
            return 'note-' + this.model.get('id');
        },

        render: function () {
            this.$el.html(this.template({
                note: this.model
            }));
            return this;
        },

        deleteNote: function () {
            var note = this.model;
            note.collection.remove(note);
            return this;
        }
    });
});
