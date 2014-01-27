describe("View : Note", function () {
    beforeEach(function (done) {
        setFixtures(sandbox());
        require([
            'app/notes/views/Note',
            'app/notes/models/Note',
            'app/notes/collections/Notes'
        ], function (NoteView, NoteModel, NotesCollection) {
            this.notesCollection = new NotesCollection();
            this.note = new NoteModel({
                created_at: new Date(2013, 11, 11, 12, 13),
                text: "test note",
                id: 4
            });
            this.notesCollection.add(this.note);
            this.noteView = new NoteView({
                model: this.note
            });
            done();
        }.bind(this));
    });

    it("render returns this", function () {
        expect(this.noteView.render()).toBe(this.noteView);
    });

    it("has an element id method", function () {
        expect(this.noteView.id()).toBe('note-4');
    });

    describe("Rendering", function () {
        beforeEach(function () {
            this.noteView.setElement('#sandbox');
            this.noteView.render();
        });

        it("shows note text", function () {
            var $noteText = this.noteView.$('.note-text');
            expect($noteText).toExist();
            expect($noteText).toContainText("test note");
        });

        it("shows note created at time", function () {
            var $noteCreatedAt = this.noteView.$('.note-date');
            expect($noteCreatedAt).toExist();
            expect($noteCreatedAt).toContainText("11 Dec 2013 12:13");
        });

        it("removes item from model's collection on click on cross", function () {
            var $deleteButton = this.noteView.$('.delete-note');
            expect($deleteButton).toExist();
            spyOn(this.notesCollection, 'remove').and.callThrough();
            $deleteButton.click();
            expect(this.notesCollection.remove).toHaveBeenCalledWith(this.note);
            expect(this.notesCollection.length).toBe(0);
        });

        afterEach(function () {
            $('#sandbox').empty();
        })
    });
});
