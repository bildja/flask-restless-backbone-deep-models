describe("AddEditPerson view", function () {
    beforeEach(function (done) {
        setFixtures(sandbox());
        require(['app/persons/views/AddEditPerson', 'app/persons/models/Person'], function (AddEditPerson, Person) {
            this.AddEditPerson = AddEditPerson;
            this.Person = Person;
            done();
        }.bind(this));
    });

    it("has modalSelector attribute", function () {
        expect(new this.AddEditPerson().modalSelector).toBe('#add-edit-person');
    });

    it("has backUrl attribute", function () {
        expect(new this.AddEditPerson().backUrl).toBe('/person');
    });

    it("render returns this", function () {
        var addEditPerson = new this.AddEditPerson({
            model: new this.Person(),
            el: '#sandbox'
        });
        expect(addEditPerson.render()).toBe(addEditPerson);
    });

    it("datetime picker plugin is used", function () {
        var addEditPerson = new this.AddEditPerson({
            model: new this.Person(),
            el: '#sandbox'
        });
        spyOn($.fn, 'datetimepicker');
        addEditPerson.render();
        expect($.fn.datetimepicker).toHaveBeenCalled();
    });

    describe("Add person", function () {
        beforeEach(function () {
            this.addPersonView = new this.AddEditPerson({
                model: new this.Person(),
                el: '#sandbox'
            });
            this.addPersonView.render();
        });

        it("renders modal window", function () {
            expect('#sandbox').toContainElement('.modal');
            var $modal = this.addPersonView.$el.find('.modal');
            expect($modal).toExist();
            expect($modal).toHaveId('add-edit-person');
        });

        it("name field is empty", function () {
            var $modal = this.addPersonView.$el.find('.modal'),
                $name = $modal.find('input[name=name]');
            expect($name).toExist();
            expect($name).toBeEmpty();
        });

        it("birth date is empty", function () {
            var $modal = this.addPersonView.$el.find('.modal'),
                $birthDate = $modal.find('input[name=birth_date]');
            expect($birthDate).toExist();
            expect($birthDate).toBeEmpty();
        });


        afterEach(function () {
            $('.modal-backdrop').remove();
        });
    });

});
