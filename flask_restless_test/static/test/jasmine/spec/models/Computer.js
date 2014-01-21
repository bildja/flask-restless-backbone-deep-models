describe("Model : Computer", function () {
    var mockComputerData = {
        id: 3,
        name: "Macbook Pro",
        vendor: "Apple",
        owner_id: 4,
        owner: {
            id: 4,
            name: "Ivan",
            birth_date: "1972-11-11"
        },
        purchase_time: "2014-01-11T23:50:06",
        notes: [
            {
                id: 3,
                text: "Note 1",
                created_at: "2014-01-10T23:08:22",
                computer_id: 3
            },
            {
                id: 5,
                text: "Note 2",
                created_at: "2013-02-12T13:03:12",
                computer_id: 3
            }
        ]
    };
    var mockComputersCollection = {
        objects: [
            {
                id: 4,
                name: "Macbook Air",
                vendor: "Apple",
                purchase_time: "2014-01-11T23:50:06",
                owner_id: 5,
                owner: {
                    id: 5,
                    name: "George",
                    birth_date: "1988-05-05"
                }
            },
            {
                id: 6,
                name: "VTS31",
                vendor: "Sony",
                purchase_time: "2013-02-22T11:11:11"
            }
        ]
    };

    beforeEach(function (done) {
        require([
            'backbone-mediator',
            'app/computers/models/Computer',
            'app/computers/collections/Computers',
            'app/notes/models/Note',
            'app/notes/collections/Notes'
        ], function (Backbone, Computer, Computers, Note, NotesCollection) {
            this.computer = new Computer({
                id: 3
            });
            this.Backbone = Backbone;
            this.Note = Note;
            this.NotesCollection = NotesCollection;
            this.computersCollection = new Computers();
            done()
        }.bind(this));
    });

    describe("fetched directly", function () {
        beforeEach(function () {
            spyOn($, 'ajax').and.callFake(function (options) {
                options.success(mockComputerData);
            });
            this.computer.fetch();
        });

         it("from url", function () {
             expect($.ajax.calls.mostRecent().args[0].url).toBe('/api/computer/3');
         });

        it("has model data", function () {
            expect(this.computer.get('id')).toBe(3);
            expect(this.computer.get('name')).toBe("Macbook Pro");
            expect(this.computer.get('vendor')).toBe("Apple");
            expect(this.computer.get('owner_id')).toBe(4);
            expect(this.computer.get('owner.id')).toBe(4);
            expect(this.computer.get('owner.name')).toBe("Ivan");
            expect(this.computer.get('owner.birth_date')).toBe("1972-11-11");
            expect(this.computer.get('notes').length).toEqual(2);
            expect(this.computer.get('notes.0.id')).toEqual(3);
            expect(this.computer.get('notes.0.text')).toEqual("Note 1");
            expect(this.computer.get('notes.0.created_at')).toEqual("2014-01-10T23:08:22");
        });

        it("has purchase time formatted", function () {
            expect(this.computer.getPurchaseTimeFormatted()).toBe("11 Jan 2014 23:50");
        });

        it("has a dash for the empty purchase time formatted", function () {
            this.computer.unset('purchase_time');
            expect(this.computer.getPurchaseTimeFormatted()).toBe("-");
            this.computer.set('purchase_time', "2014-01-11T23:50:06")
        });

        it("should be able to convert the purchase_time attribute to the Date object", function () {
            var purchaseTime = this.computer.getPurchaseTime();
            expect(purchaseTime instanceof Date).toBeTruthy();
            expect(purchaseTime.getFullYear()).toBe(2014);
            expect(purchaseTime.getMonth()).toBe(0);
            expect(purchaseTime.getDate()).toBe(11);
            expect(purchaseTime.getHours()).toBe(23);
            expect(purchaseTime.getMinutes()).toBe(50);
        });

        it("returns owner name", function () {
            expect(this.computer.getOwnerName()).toBe("Ivan");
        });

        it("returns a dash if no owner", function () {
            this.computer.unset('owner');
            expect(this.computer.getOwnerName()).toBe('-');
            this.computer.set('owner', mockComputerData.owner);
        });

        it("returns owner id", function () {
            expect(this.computer.getOwnerId()).toBe(4);
        });

        it("returns notes count", function () {
            expect(this.computer.getNotesCount()).toBe(2);
        });

        it("returns notes collection", function () {
            var notesCollection = this.computer.getNotesCollection();
            expect(notesCollection instanceof this.NotesCollection).toBeTruthy();
            expect(notesCollection.length).toBe(2);
        });

        describe("fires mediator events", function () {
            beforeEach(function () {
                spyOn(Backbone.Mediator, 'pub');
            });

            it("on owner changed", function () {
                this.computer.set('owner_id', 8);
                expect(Backbone.Mediator.pub).toHaveBeenCalledWith('change:owner', {
                    from: 4,
                    to: 8
                });
            });

            it("destroy event", function () {
                this.computer.destroy();
                expect(Backbone.Mediator.pub).toHaveBeenCalledWith('destroy:computer', {
                    computer: this.computer
                });
            })
        });

    });

    describe("fetched collection", function () {
        beforeEach(function () {
            spyOn($, 'ajax').and.callFake(function (options) {
                options.success(mockComputersCollection);
            });
        });

        it("using the setPage method", function () {
            spyOn(this.computersCollection, 'fetch').and.callThrough();
            this.computersCollection.setPage({
                fetch: true
            });
            expect(this.computersCollection.fetch).toHaveBeenCalled();
            expect($.ajax).toHaveBeenCalled();
            var ajaxArgs = $.ajax.calls.mostRecent().args[0];
            expect(ajaxArgs.data).toEqual({
                    page: 1
            });
            expect(ajaxArgs.url).toBe('/api/computer');
        });
    });
});
