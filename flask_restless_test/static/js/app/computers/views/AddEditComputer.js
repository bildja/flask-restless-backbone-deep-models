define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        ModalForm = require('app/base/views/ModalForm'),
        addEditComputerTemplate = require('text!templates/computers/add-edit-computer.html');
    require('datepicker');
    return ModalForm.extend({
        template: _.template(addEditComputerTemplate),
        modalSelector: '#add-edit-computer',

        getFormData: function () {
            var $form = this.$('form');
            return _(['name', 'vendor', 'owner_id']).map(function (field) {
                return [field, $form.find('[name="' + field + '"]').val()]
            }).zipObject().value();
        },

        saveModel: function () {
            this.model.setPurchaseTime(this.$('[name=purchase_time]').val());
            return ModalForm.prototype.saveModel.apply(this, arguments);
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
