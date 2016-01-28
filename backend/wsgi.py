import bottle

# Roma controllers
from roma_api import municipios, indicadores, objetivos, relaciones

@bottle.hook('after_request')
def enable_cors():
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'


# Run bottle internal test server when invoked directly ie: non-uxsgi mode
if __name__ == '__main__':
        bottle.run(host='0.0.0.0', port=7572)
# Run bottle in application mode. Required in order to get the application working with uWSGI!
else:
    app = application = bottle.default_app()
