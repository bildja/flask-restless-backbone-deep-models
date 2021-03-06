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
            this.on('destroy', this.fireDestroyMediatorEvent);
            this.on('change:owner_id', this.ownerChanged, this);
        },

        ownerChanged: function (computer, ownerId) {
            var previousOwnerId = computer.previousAttributes().owner_id;
            // Yes, we do need "==", but not "===", because it could change
            // from the string value "2" to the number value 2
            // which we don't care about.
            if (ownerId == previousOwnerId || !previousOwnerId) {
                return this;
            }
            Backbone.Mediator.pub('change:owner', {
                from: parseInt(previousOwnerId, 10),
                to: parseInt(ownerId, 10)
            });
            return this;
        },

        fireDestroyMediatorEvent: function () {
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
        },

        parse: function (data) {
            if (_.isObject(data)) {
                delete data.headers;
            }
            return data;
        }

    });
});
