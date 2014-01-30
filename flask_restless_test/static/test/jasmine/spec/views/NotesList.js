describe("View : Notes list", function () {

    beforeEach(function (done) {
        setFixtures(sandbox());
        require([
            'app/notes/views/NotesList',
            'app/notes/views/Note',
            'app/notes/collections/Notes',
            'app/computers/models/Computer'
        ], function (NotesListView, NoteView, NotesCollection, Computer) {
            this.NoteView = NoteView;
            var computer = new Computer({
                id: 3,
                name: "Computer with notes",
                vendor: "Vendor",
                notes: [
                    {
                        created_at: new Date(2013, 11, 11, 12, 13),
                        text: "note 1",
                        computer_id: 3
                    },
                    {
                        created_at: new Date(2013, 12, 1, 4, 2),
                        text: "note 2",
                        computer_id: 3
                    },
                    {
                        created_at: new Date(2011, 4, 2, 4, 5),
                        text: "note 3",
                        computer_id: 3
                    }
                ]
            });
            this.notesListView = new NotesListView({
                model: computer,
                el: '#sandbox'
            });
            done();
        }.bind(this));
    });

    it("render returns this", function () {
        expect(this.notesListView.render()).toBe(this.notesListView);
    });

    describe("Rendering", function () {
        beforeEach(function () {
            spyOn(this.NoteView.prototype, 'render').and.callThrough();
            this.notesListView.render();
        });

        it("renders modal window", function () {
            expect('#sandbox').toContainElement('#computer-notes');
            expect('#computer-notes').toHaveClass('modal');
        });

        it("creates a NoteView for each item of collection and renders it", function () {
            expect(this.NoteView.prototype.render).toHaveBeenCalled();
            expect(this.NoteView.prototype.render.calls.count()).toBe(3);
        });

        it("renders notes", function () {
            var $sandbox = $('#sandbox');
            expect($sandbox.find('.note-text').length).toBe(3);
            expect($sandbox.find('.note-date').length).toBe(3);
        });

        it("renders add note form", function () {
            var $addNoteForm = this.notesListView.$('#add-note-form');
            expect($addNoteForm).toExist();
            expect($addNoteForm).toEqual('form');
            expect($addNoteForm).toContainElement('textarea[name=text]');
            expect($addNoteForm).toContainElement(':submit');
            expect($addNoteForm.find(':submit')).toHaveValue("Add note");
        });

        it("adds note on submit form", function () {
            var $addNoteForm = this.notesListView.$('#add-note-form'),
                spySubmitEvent = spyOnEvent($addNoteForm, 'submit');
            $addNoteForm.find('textarea[name=text]').val("Test add note");
            $addNoteForm.submit();
            expect(spySubmitEvent).toHaveBeenPrevented();
            expect(this.notesListView.model.getNotesCollection().length).toBe(4);
            expect(this.notesListView.$('.note-text').length).toBe(4);
            expect(this.notesListView.$('.note-date').length).toBe(4);
        });

        it("has cancel button, which closes the modal window", function () {
            var $cancelBtn = this.notesListView.$('button.cancel');
            expect($cancelBtn).toExist();
            expect($cancelBtn).toHaveText("Cancel");
            expect($cancelBtn).toHaveData('dismiss', 'modal');
        });

        it("has submit button", function () {
            var $submit = this.notesListView.$(':submit');
            expect($submit).toExist();
            expect($submit).toHaveText("Save notes");
        });

        it("the collection is being reset to default on close window", function () {
            this.notesListView.model.getNotesCollection().add({
                text: "test add",
                created_at: new Date()
            });
            expect(this.notesListView.model.getNotesCollection().length).toBe(4);
            this.notesListView.$('.cancel').click();
            expect(this.notesListView.model.getNotesCollection().length).toBe(3);
        });

        describe("saving the notes", function () {
            beforeEach(function () {
                spyOn($, 'ajax').and.callFake(function (options) {
                    options.success();
                });
            });

            it("sends put request for computer", function () {
                this.notesListView.$('.save-notes').click();
                expect($.ajax).toHaveBeenCalled();
                var ajaxArgs = $.ajax.calls.mostRecent().args[0];
                expect(ajaxArgs.url).toBe('/api/computer/3');
                expect(ajaxArgs.type.toLowerCase()).toBe('put');
            });

            it("hides modal", function () {
                var spyHideEvent = spyOnEvent('#computer-notes', 'hide.bs.modal');
                this.notesListView.$('.save-notes').click();
                expect(spyHideEvent).toHaveBeenTriggered();
            });
        });
    });

    afterEach(function () {
        this.notesListView.removeElement();
        $('.modal-backdrop').remove();
    });
});
