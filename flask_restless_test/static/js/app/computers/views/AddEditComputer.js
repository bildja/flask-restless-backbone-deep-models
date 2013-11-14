define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        ModalForm = require('app/base/views/ModalForm'),
        addEditComputerTemplate = require('text!/static/templates/computers/add-edit-computer.html');
    require('datepicker');
    return ModalForm.extend({
        template: _.template(addEditComputerTemplate),
        modalSelector: '#add-edit-computer',
        backUrl: '/computer',

        getFormData: function () {
            var $form = this.$('form');
            return _(['name', 'vendor', 'purchase_time', 'owner_id']).map(function (field) {
                return [field, $form.find('[name="' + field + '"]').val()]
            }).zipObject().value();
        },

        initFields: function () {
            var $addEditComputer = this.$el.find(this.modalSelector);
            if (!this.model.isNew()){
                _(['name', 'vendor', 'purchase_time']).each(function (name) {
                    $addEditComputer.find('[name=' + name + ']').val(this.model.get(name));
                }, this);
            }
            $addEditComputer.find('#purchase-time-picker')
                .datetimepicker({
                    todayHighlight: true,
                    todayBtn: true,
                    autoclose: true,
                    weekStart: 1
            }).datetimepicker('update', this.model.getPurchaseTime());
            return this;
        }
    });
});
