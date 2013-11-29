define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        ModalView = require('app/base/views/ModalView'),
        AjaxChosen = require('app/base/views/AjaxChosen');
    return ModalView.extend({

        events: _.extend({
            'shown.bs.modal .modal': 'initSelects',
            'submit .modal form': 'saveModel'
        }, ModalView.prototype.events),

        render: function () {
            ModalView.prototype.render.apply(this, arguments);
            return this.initFields();
        },

        initSelects: function () {
            this.$('select').each(function () {
                new AjaxChosen({
                    el: this
                }).render();
            });
            return this;
        },

        showErrors: function (model, xhr) {
            var validationErrors = xhr.responseJSON.validation_errors;
            _(validationErrors).each(function (error, field) {
                var $formGroup = this.$('[name="' + field + '"]').closest('.form-group');
                $formGroup.addClass('has-error');
                $formGroup.find('.help-block').text(error);
            }, this);
            return this;
        },

        saveModel: function (evt) {
            if (evt) {
                evt.preventDefault();
            }
            this.model.save(this.getFormData(), {
                success: _.bind(function (model) {
                    this.hideModal().trigger('model:saved', {
                        model: model
                    });
                }, this),
                error: _.bind(this.showErrors, this)
            });
            return this;
        }
    });
});
