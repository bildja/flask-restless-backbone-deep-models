describe("View : AddEditComputer", function () {

    beforeEach(function (done) {
        require([
            'app/computers/views/AddEditComputer',
            'app/computers/models/Computer'
        ], function (AddEditComputer, Computer) {
            this.AddEditComputer = AddEditComputer;
            this.Computer = Computer;
            done();
        }.bind(this));
    });

    it("has modalSelector attribute", function () {
        var addEditComputer = new this.AddEditComputer();
        expect(addEditComputer.modalSelector).toBe('#add-edit-computer');
        addEditComputer.removeElement();
    });

    it("render returns this", function () {
        var addEditComputer = new this.AddEditComputer({
            model: new this.Computer(),
        });
        expect(addEditComputer.render()).toBe(addEditComputer);
        addEditComputer.removeElement();
    });

    describe("editing", function () {
        beforeEach(function () {
            var computer = new this.Computer({
                id: 1,
                owner_id: 4,
                name: "Macbook Pro",
                vendor: "Apple",
                purchase_time: "2014-01-11T23:50:06",
                owner: {
                    name: "Andrew",
                    id: 3,
                    birth_date: "1992-11-23"
                }
            });
            this.editComputerView = new this.AddEditComputer({
                model: computer
            }).render();
        });

        it("renders modal", function () {
            expect(this.editComputerView.el).toContainElement('.modal');
            var $modal = this.editComputerView.findModal();
            expect($modal).toHaveId('add-edit-computer');
        });

        it("renders form", function () {
            expect(this.editComputerView.el).toContainElement('form');
        });

        it("renders filled form", function () {
            var $form = this.editComputerView.$('form');
            expect($form.find('[name=owner_id]')).toHaveValue("3");
            expect($form.find('[name=name]')).toHaveValue("Macbook Pro");
            expect($form.find('[name=vendor]')).toHaveValue("Apple");
            expect($form.find('[name=purchase_time]')).toHaveValue("2014-01-11 23:50:06");
        });

        afterEach(function () {
            this.editComputerView.removeElement();
        });
    });

    describe("adding", function () {
        // We assume it renders modal and a form in the same way
        // as for editing, so we don't test it again.

        beforeEach(function () {
            var computer = new this.Computer();
            this.addComputerView = new this.AddEditComputer({
                model: computer
            }).render();
        });

        it("renders empty form", function () {
            var $form = this.addComputerView.$('form');
            expect($form.find('[name=owner_id]')).toHaveValue("");
            expect($form.find('[name=name]')).toHaveValue("");
            expect($form.find('[name=vendor]')).toHaveValue("");
        });

        it("has `add person` checkbox", function () {
            var $addPersonCheckbox = this.addComputerView.$('[name="add-owner"]');
            expect($addPersonCheckbox).toExist();
            expect($addPersonCheckbox).toEqual(':checkbox');
            expect($addPersonCheckbox).not.toBeChecked();
        });

        it("the person select is visible by default", function () {
            expect(this.addComputerView.$('.choose-owner')).toBeVisible();
        });

        describe("when `add person` checkbox", function () {
            beforeEach(function () {
                this.addComputerView.$('#add-owner').prop('checked', true).trigger('change');
            });

            it("the person select should be hidden", function () {
                expect(this.addComputerView.$('.choose-owner')).toBeHidden();
            });

            it("the `add new person` form should be visible", function () {
                expect(this.addComputerView.$('.owner-subform')).toBeVisible();
            });
        });

        afterEach(function () {
            this.addComputerView.removeElement();
        });
    });

    afterEach(function () {
        $('.modal-backdrop, .datetimepicker').remove();
    })
});
