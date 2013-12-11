define(function (require) {
    'use strict';
    var _ = require('underscore'),
        ModalView = require('app/base/views/ModalView'),
        notesListTemplate = require('text!templates/notes/notes-modal.html'),
        NoteView = require('app/notes/views/Note'),
        Note = require('app/notes/models/Note');
    return ModalView.extend({
        template: _.template(notesListTemplate),
        modalSelector: '#computer-notes',

        events: _.extend({
            'submit #add-note-form': 'addNote',
            'click .save-notes': 'saveNotes'
        }, ModalView.prototype.events),

        initialize: function () {
            ModalView.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model.getNotesCollection(), 'add remove change', this.renderNotesList);
            return this;
        },

        renderNotesList: function () {
            this._notesView = [];
            var $notesList = this.$('.notes-list').empty();
            this.model.getNotesCollection().each(function (note) {
                var noteView = new NoteView({
                    model: note
                }).render();
                this._notesView.push(noteView);
                $notesList.append(noteView.el);
            }, this);
            return this;
        },

        render: function () {
            ModalView.prototype.render.apply(this, arguments);
            return this.renderNotesList();
        },

        addNote: function (evt) {
            if (evt) {
                evt.preventDefault();
            }
            var $text = this.$('[name=text]');
            this.model.getNotesCollection().add(new Note({
                text: $text.val().trim(),
                computer_id: this.model.get('id')
            }));
            $text.val('');
            return this;
        },

        onModalHide: function () {
            ModalView.prototype.onModalHide.apply(this, arguments);
            this.model.initNotesCollection();
            return this;
        },

        saveNotes: function () {
            this.model.updateNotes().save();
            return this.hideModal();
        }

    });
});
