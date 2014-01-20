describe("Person info view", function () {
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
                name: "VTS31",
                vendor: "Sony",
                owner_id: 1,
                purchase_time: "2014-01-11T23:01:06"
            }
        ]
    };

    beforeEach(function (done) {
        require(['app/persons/views/PersonInfo', 'app/persons/models/Person'], function (PersonInfo, Person) {
            var person = new Person(mockPersonData);

            this.personInfoView = new PersonInfo({
                model: person,
                el: '#sandbox'
            });
            this.personInfoView.render();
            done();
        }.bind(this));
        setFixtures(sandbox())
    });

    afterEach(function () {
        $('.modal-backdrop').remove();
    });

    it("renders", function () {
        expect($('#sandbox')).toContainElement('#person-info.modal');
    });

    it("returns this when renders", function () {
        expect(this.personInfoView.render()).toBe(this.personInfoView);
    });

    it("gets the correct backUrl", function () {
        expect(typeof this.personInfoView.backUrl).toBe('function');
        expect(this.personInfoView.backUrl()).toBe('/person');
    });

    it("has title", function () {
        var $sandbox = $('#sandbox');
        expect($sandbox).toContainElement('h4.modal-title');
        expect($sandbox.find('h4.modal-title')).toContainText("Person name info");
    });

    it("shows name of person", function () {
        var $sandbox = $('#sandbox');
        expect($sandbox).toContainHtml('<label>Name: </label>');
        expect($sandbox).toContainHtml('<span>Person name</span>');
    });

    it("shows birth date of person", function () {
        var $sandbox = $('#sandbox');
        expect($sandbox).toContainHtml('<label>Birth Date: </label>');
        expect($sandbox).toContainHtml('<span>10 Oct 1972</span>');
    });

    it("shows computers count", function () {
        expect($('#sandbox')).toContainText("Person name has purchased 2 computers");
    });

    it("shows computers list", function () {
        var $table = $('#sandbox').find('table');
        expect($table).toExist();
        var $tr = $table.find('tbody tr');
        expect($tr.length).toBe(2);
        expect($tr.eq(0)).toContainText('MacBook Pro');
        expect($tr.eq(0)).toContainText('Apple');
        expect($tr.eq(1)).toContainText('VTS31');
        expect($tr.eq(1)).toContainText('Sony');
    });
});