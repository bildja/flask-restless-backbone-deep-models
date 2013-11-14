import flask

app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
# Create the Flask application and the Flask-SQLAlchemy object.

db = flask.ext.sqlalchemy.SQLAlchemy(app)

import flask_restless.views