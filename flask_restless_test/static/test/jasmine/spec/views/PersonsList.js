describe('PersonsList View', function () {
    var personsMockData = [
        {
            id: 7,
            name: "Ivan",
            birth_date: "1985-11-11",
            computers_count: 4
        },
        {
            id: 8,
            name: "Fedor",
            birth_date: "1985-11-11",
            computers_count: 14
        },
        {
            id: 9,
            name: "Nick",
            birth_date: "1985-11-11",
            computers_count: 2
        },
        {
            id: 17,
            name: "John",
            birth_date: "1985-11-11",
            computers_count: 5
        }
    ];

    beforeEach(function (done) {
        setFixtures(sandbox({
            id: 'content'
        }));
        require([
            'app/persons/views/Persons',
            'app/persons/collections/Persons',
            'app/persons/views/PersonItem'
        ], function (PersonsView, PersonsCollection, PersonItem) {
            this.personsCollection = new PersonsCollection();
            spyOn($, 'ajax').and.callFake(function (options) {
                options.success({
                    objects: personsMockData
                });
            });
            this.personsCollection.fetch();
            this.personsView = new PersonsView({
                collection: this.personsCollection
            });
            this.PersonItem = PersonItem;

            done();
        }.bind(this));
    });

    it("render returns this", function () {
        expect(this.personsView.render()).toBe(this.personsView);
    });

    it("has PersonItem as an item class", function () {
        expect(this.personsView.ItemView).toBe(this.PersonItem);
    });

    it("renders ItemView", function () {
        spyOn(this.PersonItem.prototype, 'render').and.callThrough();
        this.personsView.render();
        expect(this.PersonItem.prototype.render).toHaveBeenCalled();
        expect(this.PersonItem.prototype.render.calls.count()).toBe(4);
    });

    it("has baseUrl attribute", function () {
        expect(this.personsView.baseUrl).toBe('/person/');
    });

    describe("rendering", function () {

        beforeEach(function () {
            this.el = this.personsView.render().el;
        });

        it("renders a table", function () {
            var $table = $(this.el).find('table');
            expect($table).toExist();
            expect($table).toHaveClass('items-list');
            expect($table).toHaveClass('persons-list');
            expect($table).toContainElement('tbody#list-tbody');
        });

        it("shows correct number of rows", function () {
            expect($(this.el).find('#list-tbody').find('tr').length).toBe(4);
        });
    });

});
