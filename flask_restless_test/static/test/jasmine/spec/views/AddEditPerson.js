describe("View : AddEditPerson", function () {
    beforeEach(function (done) {
        setFixtures(sandbox());
        require(['app/persons/views/AddEditPerson', 'app/persons/models/Person'], function (AddEditPerson, Person) {
            this.Person = Person;
            this.addPersonView = new AddEditPerson({
                model: new this.Person(),
                el: '#sandbox'
            });
            done();
        }.bind(this));
    });

    it("has modalSelector attribute", function () {
        expect(this.addPersonView.modalSelector).toBe('#add-edit-person');
    });

    it("has backUrl attribute", function () {
        expect(this.addPersonView.backUrl).toBe('/person');
    });

    it("render returns this", function () {
        expect(this.addPersonView.render()).toBe(this.addPersonView);
    });

    it("datetime picker plugin is used", function () {
        spyOn($.fn, 'datetimepicker').and.callThrough();
        this.addPersonView.render();
        expect($.fn.datetimepicker).toHaveBeenCalled();
    });

    describe("Add person", function () {
        beforeEach(function () {
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

        describe("form data", function () {
            beforeEach(function () {
                this.addPersonView.$('[name=birth_date]').val("1991-10-10");
                this.addPersonView.$('[name=name]').val("George");
                spyOn($, 'ajax').and.callFake(function (options) {
                    var isSuccess = !!JSON.parse(options.data).name;
                    if (isSuccess) {
                        options.success({
                            id: 7,
                            name: "George",
                            birth_date: "1991-10-10",
                            computers: []
                        });
                        return;
                    }
                    options.error({
                        responseJSON: {
                            validation_errors: {
                                name: "Please enter a value"
                            }
                        }
                    });
                }.bind(this));
            });

            it("returns from getFormData method", function () {
                expect(this.addPersonView.getFormData()).toEqual({
                    name: "George",
                    birth_date: "1991-10-10"
                });
            });

            it("prevents submit event", function () {
                var $form = this.addPersonView.$('form'),
                    submitSpyEvent = spyOnEvent($form, 'submit');
                $form.submit();
                expect(submitSpyEvent).toHaveBeenPrevented();
            });

            it("saves on submit click", function () {
                spyOn(this.addPersonView.model, 'save').and.callThrough();
                this.addPersonView.$('form').submit();
                expect(this.addPersonView.model.save).toHaveBeenCalled();
                var saveArgs = this.addPersonView.model.save.calls.mostRecent().args[0];
                expect(saveArgs).toEqual({
                    name: "George",
                    birth_date: "1991-10-10"
                });
            });

            it("shows the validation error if name is empty", function () {
                this.addPersonView.$('[name=name]').val('');
                spyOn(this.addPersonView, 'showErrors').and.callThrough();
                this.addPersonView.$('form').submit();
                expect(this.addPersonView.showErrors).toHaveBeenCalled();
                expect(this.addPersonView.$('.form-group:has([name=name])')).toHaveClass('has-error');
                expect(this.addPersonView.$('.form-group:has([name=name]) .help-block')).toHaveText("Please enter a value");
            });

            it("closes on click Close button", function () {
                var $closeBtn = this.addPersonView.$('.modal-footer button:contains("Close")');
                expect($closeBtn).toExist();
                expect($closeBtn).toHaveText('Close');
                expect($closeBtn).toHaveData('dismiss', 'modal');
                var modalHideEvent = spyOnEvent(this.addPersonView.$el.find('.modal'), 'hide.bs.modal');
                $closeBtn.click();
                expect(modalHideEvent).toHaveBeenTriggered();
            });
        });


        afterEach(function () {
            this.addPersonView.remove();
            $('.modal-backdrop, .datetimepicker').remove();
        });
    });

});
