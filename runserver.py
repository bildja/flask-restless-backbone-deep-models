from flask_restless_test import app
from flask_restless_test import settings

app.run(debug=True, host=settings.RUN_HOST, port=settings.RUN_PORT)