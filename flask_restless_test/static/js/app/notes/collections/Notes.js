define(function (require) {
    'use strict';
    var Backbone = require('backbone'),
        Note = require('app/notes/models/Note');
    return Backbone.Collection.extend({
        model: Note
    });
});
