from flask_restless import app


@app.route('/')
def index():
    return "Flask restless application with the backbone deep model"