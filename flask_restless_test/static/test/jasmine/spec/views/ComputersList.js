describe("View : ComputersList", function () {
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
        setFixtures(sandbox({
            id: 'content'
        }));
        require([
            'app/computers/views/Computers',
            'app/computers/views/ComputerItem',
            'app/computers/collections/Computers'
        ], function (ComputersListView, ComputerItemView, ComputersCollection) {
            this.ComputerItemView = ComputerItemView;
            this.ComputersCollection = ComputersCollection;
            this.ComputersListView = ComputersListView;
            var computersCollection = new ComputersCollection();
            spyOn($, 'ajax').and.callFake(function (options) {
                options.success(mockComputersCollection);
            });
            computersCollection.fetch();
            this.computersListView = new ComputersListView({
                collection: computersCollection
            });
            done();
        }.bind(this));
    });

    it("render returns this", function () {
        expect(this.computersListView.render()).toBe(this.computersListView);
    });

    it("has ItemView attribute", function () {
        expect(this.computersListView.ItemView).toBe(this.ComputerItemView);
    });

    it("renders ComputerItem views", function () {
        spyOn(this.ComputerItemView.prototype, 'render').and.callThrough();
        this.computersListView.render();
        expect(this.ComputerItemView.prototype.render).toHaveBeenCalled();
        expect(this.ComputerItemView.prototype.render.calls.count()).toBe(2);
    });

    it("has baseUrl attribute", function () {
        expect(this.computersListView.baseUrl).toBe('/computer/');
    });

    describe("Rendering", function () {
        beforeEach(function () {
            this.computersListView.render();
        });

        it("renders a table", function () {
            expect(this.computersListView.el).toContainElement('table');
            var $table = this.computersListView.$('table');
            expect($table).toHaveClass('computers-list');
            expect($table).toHaveClass('items-list');
            expect($table).toContainElement('tbody#list-tbody');
        });

        it("renders correct number of rows", function () {
            expect(this.computersListView.$('#list-tbody tr').length).toBe(2);
        });

        it("`No items` message is not shown, when there are items", function () {
            var $content = $('#content');
            $content.show();
            expect(this.computersListView.$('.no-items')).toBeHidden();
            $content.hide();
        });
    });

    describe("if no items", function () {
        beforeEach(function () {
            this.noItemsComputersView = new this.ComputersListView({
                collection: new this.ComputersCollection()
            });
            this.noItemsComputersView.render();
        });

        it("shows `no computers` message if the collection is empty", function () {
            expect(this.noItemsComputersView.el).toContainElement('.no-items');
            var $noItemsElement = this.noItemsComputersView.$('.no-items');
            expect($noItemsElement).toBeVisible();
            expect($noItemsElement).toHaveText("No computers yet.");
            expect(this.noItemsComputersView.$('.computers-list')).toBeHidden();
        });

        it("after adding an item hides a `no computers` message", function () {
            this.noItemsComputersView.collection.add({
                id: 6,
                name: "VTS31",
                vendor: "Sony",
                purchase_time: "2013-02-22T11:11:11"
            });
            expect(this.noItemsComputersView.$('.no-items')).toBeHidden();
            expect(this.noItemsComputersView.$('.computers-list')).toBeVisible();
        });
    });

});
