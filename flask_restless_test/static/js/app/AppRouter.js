define(function (require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        ComputersView = require('app/computers/views/Computers'),
        ComputersCollection = require('app/computers/collections/Computers'),
        AddEditComputerView = require('app/computers/views/AddEditComputer'),
        AddEditPersonView = require('app/persons/views/AddEditPerson'),
        Computer = require('app/computers/models/Computer'),
        Person = require('app/persons/models/Person'),
        PersonsView = require('app/persons/views/Persons'),
        PersonsCollection = require('app/persons/collections/Persons'),
        NotesView = require('app/notes/views/NotesList'),
        PersonInfo = require('app/persons/views/PersonInfo');
    var computersCollection, personsCollection;
    return Backbone.Router.extend({
        routes: {
            "": 'redirectToComputers',
            "computer(/page/:page)": 'computers',
            "computer/edit/:id": 'editComputer',
            "computer/notes/:id": 'computerNotes',
            "computer/add": 'addComputer',
            "person": 'persons',
            "person/add": 'addPerson',
            "person/info/:id": 'personInfo'
        },
        listView: null,

        redirectToComputers: function () {
            this.navigate('/computer', {trigger: true});
        },

        showListView: function (params) {
            if (!(this.listView instanceof params.ViewClass)) {
                if (this.listView) {
                    this.listView.undelegateEvents();
                }
                this.listView = new params.ViewClass({
                    collection: params.collection
                });
            }
            this.listView.render();
        },

        computers: function (page) {
            if (!computersCollection){
                computersCollection = new ComputersCollection();
            }
            this.showListView({
                ViewClass: ComputersView,
                collection: computersCollection
            });
            computersCollection.setPage({
                page: page,
                fetch: true
            });
            return this;
        },

        getComputer: function (id, callback, context) {
            context = context || this;
            if (!computersCollection){
                computersCollection = new ComputersCollection();
                computersCollection.fetch({
                    success: _.bind(function () {
                        callback.call(context, id);
                    }, this)
                });
                return null;
            }
            var computer = computersCollection.get(id);
            if (!computer){
                computer = new Computer({
                    id: id
                });
                computer.fetch({
                    success: _.bind(function () {
                        computersCollection.add(computer);
                        callback.call(context, id);
                    }, this),
                    error: _.bind(this.showNoComputer, this)
                });
                return null;
            }
            return computer
        },

        editComputer: function (id) {
            var computer = this.getComputer(id, this.editComputer);
            if (!computer) {
                return this;
            }
            new AddEditComputerView({
                model: computer,
                backUrl: '/computer/page/' + (computersCollection.page || 1)
            }).render();
            return this;
        },

        computerNotes: function (id) {
            var computer = this.getComputer(id, this.computerNotes);
            if (!computer) {
                return this;
            }
            new NotesView({
                model: computer,
                backUrl: '/computer/page/' + (computersCollection.page || 1)
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
            this.showListView({
                ViewClass: PersonsView,
                collection: personsCollection
            });
            personsCollection.setPage({
                page: 1,
                fetch: true
            });
            return this;
        },

        personInfo: function (id) {
            var person = new Person({
                id: id
            });
            person.fetch({
                success: _.bind(this.showPersonInfo, this)
            });
            return this;
        },

        showPersonInfo: function (person) {
            new PersonInfo({
                model: person
            }).render();
            return this;
        },

        addComputer: function () {
            if (!computersCollection) {
                computersCollection = new ComputersCollection();
                computersCollection.fetch();
            }
            var addComputerView = new AddEditComputerView({
                model: new Computer(),
                backUrl: '/computer/page/' + (computersCollection.page || 1)
            }).render();
            addComputerView.on('model:saved', this.addModelToCollection(computersCollection));
            return this;
        },

        addModelToCollection: function (collection) {
            return function (options) {
                collection.add(options.model);
            };
        },

        addPerson: function () {
            var addPersonView = new AddEditPersonView({
                model: new Person()
            }).render();
            addPersonView.on('model:saved', this.addModelToCollection(personsCollection));
            return this;
        }
    });
});
