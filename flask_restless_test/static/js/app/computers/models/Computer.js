define(function (require) {
    'use strict';
    var Backbone = require('deep-model'),
        moment = require('moment'),
        NotesCollection = require('app/notes/collections/Notes');
    require('backbone-mediator');
    return Backbone.DeepModel.extend({
        urlRoot: '/api/computer',
        initialize: function () {
            this.on('sync', this.initNotesCollection, this);
            this.on('destroy', this.fireMediatorEvent)
        },

        fireMediatorEvent: function () {
            Backbone.Mediator.pub('destroy:computer', {
                computer: this
            });
            return this;
        },

        initNotesCollection: function () {
            this.notesCollection = new NotesCollection(this.get('notes'));
            return this;
        },

        setPurchaseTime: function (purchaseTime) {
            this.set('purchase_time', moment(purchaseTime).format('YYYY-MM-DDTHH:mm:ss'));
            return this;
        },

        getPurchaseTimeFormatted: function () {
            var purchaseTime = this.get('purchase_time');
            if (!purchaseTime) {
                return '-';
            }
            return moment(purchaseTime).format('DD MMM YYYY HH:mm');
        },

        getPurchaseTime: function () {
            return moment(this.get('purchase_time')).toDate();
        },

        getOwnerName: function () {
            var owner = this.get('owner');
            if (!owner) {
                return '-';
            }
            return owner.name;
        },

        getNotesCount: function () {
            var notes = this.get('notes');
            return notes ? notes.length : 0;
        },

        addNote: function (text) {
            return this;
        },

        getNotesCollection: function () {
            if (!this.notesCollection) {
                this.initNotesCollection();
            }
            return this.notesCollection;
        },

        updateNotes: function () {
            this.set('notes', this.getNotesCollection().toJSON());
            return this;
        },

        getOwnerId: function () {
            return this.get('owner').id;
        }

    });
});
