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
                name: "MacBook Air",
                vendor: "Apple",
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
            done();
        }.bind(this));
        setFixtures(sandbox({style: 'display:none;'}))
    });

    it("renders", function () {
        this.personInfoView.render();
        expect($('#sandbox')).toContain('#person-info.modal');
    });
});