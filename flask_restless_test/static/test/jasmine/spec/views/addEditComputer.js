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
            this.COMPUTER_DATA = {
                id: 1,
                owner_id: "4",
                name: "Macbook Pro",
                vendor: "Apple",
                purchase_time: "2014-01-11T23:50:06",
                owner: {
                    name: "Andrew",
                    id: 4,
                    birth_date: "1992-11-23"
                }
            };
            var computer = new this.Computer(this.COMPUTER_DATA);
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
            expect($form.find('[name=owner_id]')).toHaveValue("4");
            expect($form.find('[name=name]')).toHaveValue("Macbook Pro");
            expect($form.find('[name=vendor]')).toHaveValue("Apple");
            expect($form.find('[name=purchase_time]')).toHaveValue("2014-01-11 23:50:06");
        });

        describe("on submit", function () {
            beforeEach(function () {
                spyOn($, 'ajax').and.callFake(function (options) {
                    options.success();
                });
            });

            describe("with no changes", function () {
                beforeEach(function () {
                    this.editComputerView.$('form').submit();
                });

                it("sends data", function () {
                    expect($.ajax).toHaveBeenCalled();
                });

                it("sends the put request", function () {
                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.calls.mostRecent().args[0].type.toLowerCase()).toBe('put');
                });

                it("sends the correct data on submit", function () {
                    expect($.ajax.calls.mostRecent().args[0].data).toEqual(JSON.stringify(this.COMPUTER_DATA));
                });

                it("sends data to the correct url", function () {
                    expect($.ajax.calls.mostRecent().args[0].url).toBe('/api/computer/1');
                });

            });

            it("sends just owner name if add-new checked and only name entered", function () {
                var $form = this.editComputerView.$('form');
                $form.find('#add-owner').prop('checked', true).trigger('change');
                $form.find('[name="owner.name"]').val("Andrew-2");
                $form.submit();
                var ajaxArgs = $.ajax.calls.mostRecent().args[0];
                var data = JSON.parse(ajaxArgs.data);
                expect(data.owner_id).toBeUndefined();
                expect(data.owner).toEqual({
                    name: "Andrew-2",
                    birth_date: ''
                });
            });
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
