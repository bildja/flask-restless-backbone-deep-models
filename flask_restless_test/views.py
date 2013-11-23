from flask.templating import render_template
from flask_restless_test import app
from flask_restless_test import models


@app.route('/')
@app.route('/computer')
@app.route('/computer/page/<page>')
@app.route('/computer/add')
@app.route('/computer/edit/<computer_id>')
@app.route('/computer/notes/<computer_id>')
@app.route('/person')
@app.route('/person/add')
@app.route('/person/info/<person_id>')
def index(*args, **kwargs):
    return render_template('index.html')

