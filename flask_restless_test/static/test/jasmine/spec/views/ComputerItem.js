describe("View : ComputerItem", function () {
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
    beforeEach(function (done) {
        setFixtures('<table id="computers-list"></table>');
        require([
            'app/computers/views/ComputerItem',
            'app/computers/models/Computer'
        ], function (ComputerItem, Computer) {
            var computer = new Computer(mockComputerData);
            this.computerItemView = new ComputerItem({
                model: computer
            });
            done();
        }.bind(this))
    });

    it("returns this on render", function () {
        expect(this.computerItemView.render()).toBe(this.computerItemView);
    });

    describe("Rendering", function () {

        beforeEach(function () {
            this.el = this.computerItemView.render().el;
            $('#computers-list').append(this.el);
        });

        it("renders <tr>", function () {
            expect(this.el).toEqual('tr');
        });

        it("shows name", function () {
            expect($(this.el).find('td:eq(0)')).toHaveText("Macbook Pro");
        });

        it("shows vendor", function () {
            expect($(this.el).find('td:eq(1)')).toHaveText("Apple");
        });

        it("shows purchase time", function () {
            expect($(this.el).find('td:eq(2)')).toHaveText("11 Jan 2014 23:50");
        });

        it("shows owner name as a link", function () {
            var $td = $(this.el).find('td:eq(3)'),
                $ownerLink = $td.find('a');
            expect($ownerLink).toExist();
            expect($ownerLink).toHaveText("Ivan");
            expect($ownerLink.attr('href')).toMatch(new RegExp('^/person/info'));
        });

        it("shows edit button", function () {
            var $td = $(this.el).find('td:eq(4)'),
                $editButton = $td.find('.edit-item');
            expect($editButton).toExist();
            expect($editButton).toHaveClass('go-to');
            expect($editButton).toHaveData('href', '/computer/edit/3');
            expect($editButton).toHaveText("Edit");
        });

        it("shows delete button", function () {
            var $td = $(this.el).find('td:eq(4)'),
                $deleteButton = $td.find('.delete-item');
            expect($deleteButton).toExist();
            expect($deleteButton).toHaveText("Delete");
        });

        it("shows notes button", function () {
            var $td = $(this.el).find('td:eq(4)'),
                $notesButton = $td.find('.notes-item');
            expect($notesButton).toExist();
            expect($notesButton).toHaveClass('go-to');
            expect($notesButton).toHaveData('href', '/computer/notes/3');
            expect($notesButton).toHaveText("Notes");
            expect($notesButton).toHaveAttr('title', "2 notes");
        });
    });
});
