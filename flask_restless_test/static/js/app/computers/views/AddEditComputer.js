define(function (require) {
    'use strict';
    var _ = require('underscore'),
        ModalForm = require('app/base/views/ModalForm'),
        addEditComputerTemplate = require('text!templates/computers/add-edit-computer.html');
    require('datepicker');
    return ModalForm.extend({
        template: _.template(addEditComputerTemplate),
        modalSelector: '#add-edit-computer',

        events: _.extend({
            'change #add-owner': 'showAddOwnerForm'
        }, ModalForm.prototype.events),

        showAddOwnerForm: function (evt) {
            var addOwner = evt.target.checked;
            this.$('.owner-subform').toggle(addOwner);
            this.$('.choose-owner').toggle(!addOwner);
            return this;
        },

        isAddOwner: function () {
            return this.$('#add-owner').is(':checked');
        },

        getFormData: function () {
            var $form = this.$('form'),
                fields = ['name', 'vendor'];
            if (this.isAddOwner()) {
                fields = fields.concat('owner.name', 'owner.birth_date');
            } else {
                fields.push('owner_id');
            }
            return _(fields).map(function (field) {
                return [field, $form.find('[name="' + field + '"]').val()]
            }).zipObject().value();
        },

        saveModel: function () {
            this.model.setPurchaseTime(this.$('[name=purchase_time]').val());
            if (this.isAddOwner()) {
                this.model.unset('owner_id');
                this.model.unset('owner');
            }
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
            $addEditComputer.find('#birth-date-picker').datetimepicker({
                pickTime: false
            });
            return this;
        }
    });
});
