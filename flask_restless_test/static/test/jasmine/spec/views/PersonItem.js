describe('PersonItem View', function () {
    var mockPersonData = {
        id: 7,
        name: "Ivan",
        birth_date: "1985-11-11",
        computers_count: 4
    };

    beforeEach(function (done) {
        setFixtures('<table id="persons-list"></table>');
        require(['app/persons/views/PersonItem', 'app/persons/models/Person'], function (PersonItemView, Person) {
            this.person = new Person(mockPersonData);
            this.personItemView = new PersonItemView({
                model: this.person
            });
            done();
        }.bind(this));
    });

    it("returns this on render", function () {
        expect(this.personItemView.render()).toBe(this.personItemView);
    });

    describe('rendering', function () {

        beforeEach(function () {
            this.el = this.personItemView.render().el;
            $('#persons-list').append(this.el);
        });

        it("renders <tr>", function () {
            expect(this.el).toEqual('tr');
        });

        it("shows name", function () {
            expect($(this.el).find('td:eq(0)')).toContainText("Ivan");
        });

        it("shows birth date", function () {
            expect($(this.el).find('td:eq(1)')).toContainText("11 Nov 1985");
        });

        it("shows computers count", function () {
            expect($(this.el).find('td:eq(2)')).toContainText("4");
        });

        it("renders edit button", function () {
            var $td = $(this.el).find('td:eq(3)'),
                $editBtn = $td.find('button:eq(0)');
            expect($editBtn).toExist();
            expect($editBtn).toHaveClass('edit-item');
            expect($editBtn).toHaveClass('go-to');
            expect($editBtn).toHaveData('href', '/person/info/7');
            expect($editBtn).toHaveText("Info");
        });

        it("renders delete button", function () {
            var $td = $(this.el).find('td:eq(3)'),
                $deleteBtn = $td.find('button:eq(1)');
            expect($deleteBtn).toExist();
            expect($deleteBtn).toHaveClass('delete-item');
            expect($deleteBtn).toHaveText("Delete");
        });
    });

});
