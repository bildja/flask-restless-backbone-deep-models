import flask
import flask.ext.sqlalchemy


app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

db = flask.ext.sqlalchemy.SQLAlchemy(app)
# Create the Flask application and the Flask-SQLAlchemy object.

import flask_restless_test.views
