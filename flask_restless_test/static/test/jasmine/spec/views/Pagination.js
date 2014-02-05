describe("View : Pagination", function () {
    function generateCollectionData (count) {
        var collectionData = [];
        for (var i = 0; i < count; i++) {
            collectionData.push({
                id: i,
                field1: "field-1-" + i,
                field2: "field-2-" + i
            });
        }
        return collectionData;
    }

    function spyCollection (count, page) {
        return spyOn($, 'ajax').and.callFake(function (options) {
            options.success({
                total_pages: Math.ceil(count / 10),
                objects: generateCollectionData(count),
                page: page || 1
            });
        });
    }

    beforeEach(function (done) {
        setFixtures(sandbox({
            "class": 'pagination'
        }));
        require(['app/base/views/Pagination', 'app/base/collections/BaseCollection'], function (PaginationView, BaseCollection) {
            var Collection = BaseCollection.extend({
                url: '/test'
            }),
                collection = new Collection();
            this.PaginationView = PaginationView;
            this.paginationView = new PaginationView({
                collection: collection,
                baseUrl: '/test',
                el: '.pagination'
            });
            done();
        }.bind(this));
    });

    it("raises an Error if the collection is not passed to the constructor", function () {
        expect(function () {
            new this.PaginationView({
                baseUrl: '/test'
            });
        }.bind(this)).toThrowError("the `collection` param is required");
    });

    it("raises an Error if baseUrl is not passed", function () {
        expect(function () {
            new this.PaginationView({
                collection: this.paginationView.collection
            });
        }.bind(this)).toThrowError("baseUrl is required");
    });

    it("has a baseUrl attribute", function () {
        expect(this.paginationView.baseUrl).toBe('/test/');
    });

    it("render returns `this`", function () {
        expect(this.paginationView.render()).toBe(this.paginationView);
    });

    it("empty if the collection is empty", function () {
        spyCollection(0);
        this.paginationView.collection.fetch();
        this.paginationView.render();
        expect(this.paginationView.el).toBeEmpty();
    });

    it("empty if the collection has less than 10 items", function () {
        spyCollection(8);
        this.paginationView.collection.fetch();
        this.paginationView.render();
        expect(this.paginationView.el).toBeEmpty();
    });

    describe("rendering when there are more than 10 items: the first page", function () {
        beforeEach(function () {
            spyCollection(11, 1);
            this.paginationView.collection.fetch();
            this.paginationView.render();
        });

        it("has an `ul` element with li elements inside", function () {
            expect(this.paginationView.el).toContainElement('ul.pagination');
            expect(this.paginationView.$('ul.pagination')).toContainElement('li');
        });

        it("has a disabled `li` prev element", function () {
            var $li = this.paginationView.$('li:first');
            expect($li).toHaveClass('disabled');
            expect($li).toContainHtml("<span>&laquo;</span>");
        });

        it("has an enabled `li` next element", function () {
            expect(this.paginationView.$('li:last')).not.toHaveClass('disabled');
        });

        it("a next `li` element has a link to the next page", function () {
            var $li = this.paginationView.$('li:last');
            expect($li).toContainElement('a');
            var $a = $li.find('a');
            expect($a).toHaveAttr('href', "/test/page/2");
        });
    });

});
