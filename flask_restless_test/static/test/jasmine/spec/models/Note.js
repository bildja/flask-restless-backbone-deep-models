describe("Model : Note", function () {
    beforeEach(function (done) {
        require(['app/notes/models/Note', 'moment'], function (Note, moment) {
            this.moment = moment;
            this.Note = Note;
            done();
        }.bind(this));
    });

    it("has default date value", function () {
        var note = new this.Note();
        expect(note.get('created_at')).toBeDefined();
    });

    it("has method created at formatted", function () {
        var note = new this.Note({
            created_at: new Date(2013, 11, 11, 12, 14)
        });
        expect(note.createdAtFormatted()).toBe("11 Dec 2013 12:14");
    });
});
