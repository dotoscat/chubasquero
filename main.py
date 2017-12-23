import webbrowser
from wsgiref.simple_server import make_server
from flask import Flask

HOST = "127.0.0.1"
PORT = 8080

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello world"

with make_server(HOST, PORT, app) as httpd:
    print(httpd.server_address)
    webbrowser.open("http://{}:{}".format(HOST, PORT))
    httpd.serve_forever()
