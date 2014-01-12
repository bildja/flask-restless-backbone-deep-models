describe('Model : Person', function () {
    var mockPersonData = {
        id: 1,
        name: "Person name",
        birth_date: "1972-10-10",
        computers: [
            {
                id: 1,
                name: "MacBook Pro",
                vendor: "Apple",
                owner_id: 1,
                purchase_time: "2014-01-11T23:50:06"
            },
            {
                id: 2,
                name: "MacBook Air",
                vendor: "Apple",
                owner_id: 1,
                purchase_time: "2014-01-11T23:01:06"
            }
        ]
    };
    var PAGE_NUMBER = 2,
        TOTAL_PAGES = 5,
        COMPUTERS_COUNT = 3;
    var mockPersonsCollectionData = {
        objects: [
            {
                id: 1,
                name: "Person name",
                birth_date: "1972-10-10",
                computers_count: COMPUTERS_COUNT
            }
        ],
        page: PAGE_NUMBER,
        total_pages: TOTAL_PAGES
    };

    beforeEach(function (done) {
        require(['app/persons/models/Person', 'app/persons/collections/Persons'], function (Person, PersonsCollection) {
            this.person = new Person({
                id: 1
            });
            this.personsCollection = new PersonsCollection();
            done();
        }.bind(this));
    });

    describe('when fetched directly', function () {

        beforeEach(function () {
            spyOn($, 'ajax').and.callFake(function (options) {
                options.success(mockPersonData);
            });
            this.person.fetch();
        });

        it("has model data", function () {
            expect(this.person.get('id')).toEqual(1);
            expect(this.person.get('name')).toEqual("Person name");
            expect(this.person.get('birth_date')).toEqual("1972-10-10");
            expect(this.person.get('computers.0.id')).toEqual(1);
            expect(this.person.get('computers.0.name')).toEqual("MacBook Pro");
            expect(this.person.get('computers.0.vendor')).toEqual("Apple");
        });

        it("calculates computers count", function () {
            expect(this.person.getComputersCount()).toEqual(2);
        });

        it("has Birth Date formatted (no matter how it fetched)", function () {
            expect(this.person.getBirthDate()).toEqual("10 Oct 1972");
        });

    });

    describe("when fetched with collection", function () {

        beforeEach(function () {
            spyOn($, 'ajax').and.callFake(function (options) {
                options.success(mockPersonsCollectionData);
            });
        });

        describe("using the setPage method", function () {

            beforeEach(function () {
                spyOn(this.personsCollection, 'fetch').and.callThrough();
                spyOn(this.personsCollection, 'trigger').and.callThrough();
                this.personsCollection.setPage({
                    page: PAGE_NUMBER,
                    fetch: true
                });
            });

            it("the collection actually fetches the data", function () {
                expect(this.personsCollection.fetch).toHaveBeenCalled();

            });

            it("with the correct url and date", function () {
                var ajaxArgs = $.ajax.calls.mostRecent().args[0];
                expect(ajaxArgs.url).toEqual('/api/people');
                expect(ajaxArgs.data).toEqual({
                    page: PAGE_NUMBER
                });
            });

            it("the page:change event fired on the collection", function () {
                expect(this.personsCollection.trigger).toHaveBeenCalledWith('page:change', {
                    page: PAGE_NUMBER
                })
            });

        });

        describe("the collection has such attributes:", function () {

            beforeEach(function () {
                this.personsCollection.setPage({
                    page: PAGE_NUMBER,
                    fetch: true
                });
            });

            it('page', function () {
                expect(this.personsCollection.page).toEqual(PAGE_NUMBER);
            });

            it('totalPages', function () {
                expect(this.personsCollection.totalPages).toEqual(TOTAL_PAGES);
            });

            it("length", function () {
                expect(this.personsCollection.length).toEqual(1);
            });
        });

        describe('the model item', function () {

            beforeEach(function () {
                this.personsCollection.setPage({
                    page: PAGE_NUMBER,
                    fetch: true
                });
                this.person = this.personsCollection.get(1);
            });

            it("calculates computers count", function () {
                expect(this.person.getComputersCount()).toEqual(COMPUTERS_COUNT);
            });

            it("increases count", function () {
                this.person.increaseComputersCount();
                expect(this.person.getComputersCount()).toEqual(COMPUTERS_COUNT + 1);
            });

            it("decreases count", function () {
                this.person.decreaseComputersCount();
                expect(this.person.getComputersCount()).toEqual(COMPUTERS_COUNT - 1);
            });
        });

    });
});
