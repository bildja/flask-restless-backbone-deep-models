define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        ModalForm = require('app/base/views/ModalForm'),
        addEditPersonTemplate = require('text!/static/templates/persons/add-edit-person.html');
    require('datepicker');
    return ModalForm.extend({
        template: _.template(addEditPersonTemplate),
        modalSelector: '#add-edit-person',
        backUrl: '/person',

        getFormData: function () {
            var $form = this.$('form');
            return {
                name: $form.find('[name=name]').val(),
                birth_date: $form.find('[name=birth_date]').val()
            }
        },

        initFields: function () {
            var $addEditPerson = this.$el.find(this.modalSelector);
            if (!this.model.isNew()){
                _(['name', 'birth_date']).each(function (name) {
                    $addEditPerson.find('[name=' + name + ']').val(this.model.get(name));
                }, this);
            }
            $addEditPerson.find('#birth-date-picker').datetimepicker({
                pickTime: false
            });
            return this;
        }
    });
});
