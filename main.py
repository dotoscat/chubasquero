import webbrowser
from wsgiref.simple_server import make_server
import flask

HOST = "127.0.0.1"
PORT = 8080
URL = "http://{}:{}".format(HOST, PORT)

app = flask.Flask(__name__, static_url_path='')

@app.route("/")
def index():
    return flask.render_template("index.html", **{"server": URL})

with make_server(HOST, PORT, app) as httpd:
    print("open", URL)
    webbrowser.open(URL)
    httpd.serve_forever()
