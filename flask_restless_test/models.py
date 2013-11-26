import datetime
from dateutil.parser import parse as date_parse
import flask
import flask.ext.sqlalchemy
import flask.ext.restless
from flask_restless_test import app


db = flask.ext.sqlalchemy.SQLAlchemy(app)


# Create your Flask-SQLALchemy models as usual but with the following two
# (reasonable) restrictions:
#   1. They must have an id column of type Integer.
#   2. They must have an __init__ method which accepts keyword arguments for
#      all columns (the constructor in flask.ext.sqlalchemy.SQLAlchemy.Model
#      supplies such a method, so you don't need to declare a new one).
class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode, unique=True)
    birth_date = db.Column(db.Date)

    def computers_count(self):
        return self.computers.count()

    def __str__(self):
        return self.name


class Computer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode, unique=True)
    vendor = db.Column(db.Unicode)
    purchase_time = db.Column(db.DateTime)
    owner_id = db.Column(db.Integer, db.ForeignKey('person.id'))
    owner = db.relationship('Person', backref=db.backref('computers',
                                                         lazy='dynamic'))
    notes = db.relationship('Note', backref=db.backref('computer'))


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)
    computer_id = db.Column(db.Integer, db.ForeignKey('computer.id'))


# Create the database tables.
db.create_all()

# Create the Flask-Restless API manager.
manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)


def convert_notes_dates(instance_id=None, data=None, **kwargs):
    if data is None:
        return
    if not data.get('notes'):
        return
    for note in data['notes']:
        try:
            note['created_at'] = date_parse(note['created_at'])
        except KeyError:
            pass


# Create API endpoints, which will be available at /api/<table-name> by
# default. Allowed HTTP methods can be specified as well.

# The first one Person api would be used for collections
manager.create_api(Person, methods=['GET'],
                   include_methods=('computers_count',),
                   include_columns=('id', 'name', 'birth_date'),
                   collection_name='people')

# The second one is for items, will have nested computers fields
manager.create_api(Person, methods=['GET', 'POST', 'DELETE', 'PUT'])

manager.create_api(Computer,
                   methods=['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
                   preprocessors={
                       'PATCH_SINGLE': (convert_notes_dates,)
                   })
manager.create_api(Note, methods=['GET', 'POST', 'DELETE'])

