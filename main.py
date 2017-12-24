import json
import webbrowser
from wsgiref.simple_server import make_server
import flask
try:
    import pelicanconf
except ImportError:
    print("pelicanconf not found.")
    exit(1)

HOST = "127.0.0.1"
PORT = 8080
URL = "http://{}:{}".format(HOST, PORT)

app = flask.Flask(__name__, static_url_path='')

@app.route("/")
def index():
    return flask.render_template("index.html", **{"server": URL})

@app.route("/posts", methods=["GET"])
def get_posts():
    posts = json.dumps(["Uno", "Dos", "Y tres...", "..."])
    return posts

@app.route("/generate-site")
def generate_site():
    response = {"code": "7", "message": "Wiiii!"}
    return json.dumps(response)

with make_server(HOST, PORT, app) as httpd:
    print("open", URL)
    webbrowser.open(URL)
    httpd.serve_forever()
