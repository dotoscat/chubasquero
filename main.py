import webbrowser
from wsgiref.simple_server import make_server
import flask

HOST = "127.0.0.1"
PORT = 8080

app = flask.Flask(__name__, static_url_path='')

@app.route("/")
def index():
    with open("static/index.html") as index:
        return index.read();

with make_server(HOST, PORT, app) as httpd:
    url = "http://{}:{}".format(HOST, PORT)
    print("open", url)
    webbrowser.open(url)
    httpd.serve_forever()
