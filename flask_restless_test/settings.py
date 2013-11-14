RUN_PORT = 5000
RUN_HOST = None

try:
    from settings_local import *
except ImportError:
    pass