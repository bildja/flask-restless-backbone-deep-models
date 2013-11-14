define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        ComputersView = require('app/computers/views/Computers'),
        ComputersCollection = require('app/computers/collections/Computers'),
        AddEditComputerView = require('app/computers/views/AddEditComputer'),
        AddEditPersonView = require('app/persons/views/AddEditPerson'),
        Computer = require('app/computers/models/Computer'),
        Person = require('app/persons/models/Person'),
        PersonsView = require('app/persons/views/Persons'),
        PersonsCollection = require('app/persons/collections/Persons');
    var computersCollection, personsCollection;
    return Backbone.Router.extend({
        routes: {
            "": 'redirectToComputers',
            "computer(/page/:page)": 'computers',
            "computer/edit/:id": 'editComputer',
            "computer/add": 'addComputer',
            "person": 'persons',
            "person/add": 'addPerson',
            "person/edit/:id": 'editPerson'
        },

        redirectToComputers: function () {
            this.navigate('/computer', {trigger: true});
        },

        computers: function (page) {
            console.log('computers', page);
            if (!computersCollection){
                computersCollection = new ComputersCollection();
            }
            new ComputersView({
                collection: computersCollection
            }).render();
            computersCollection.setPage(page, true);
            return this;
        },

        editComputer: function (id) {
            if (!computersCollection){
                computersCollection = new ComputersCollection();
                computersCollection.fetch({
                    success: _.bind(function () {
                        this.editComputer(id);
                    }, this)
                });
                return this;
            }
            var computer = computersCollection.get(id);
            if (!computer){
                return this.showNoComputer();
            }
            new AddEditComputerView({
                model: computer
            }).render();
            return this;
        },

        showNoComputer: function () {
            alert('No such computer');
            this.redirectToComputers();
            return this;
        },

        persons: function () {
            console.log('persons');
            if (!personsCollection){
                personsCollection = new PersonsCollection();
            }
            new PersonsView({
                collection: personsCollection
            }).render();
            personsCollection.fetch();
            return this;
        },

        editPerson: function (id) {
            console.log('show person', id);
            return this;
        },

        addComputer: function () {
            var addComputerView = new AddEditComputerView({
                model: new Computer()
            }).render();
            addComputerView.on('model:saved', function (computer) {
                computersCollection.add(computer);
            });
            return this;
        },

        addPerson: function () {
            var addPersonView = new AddEditPersonView({
                model: new Person()
            }).render();
            addPersonView.on('model:saved', function (computer) {
                personsCollection.add(computer);
            });
            return this;
        }
    });
});
