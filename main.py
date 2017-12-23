from wsgiref.simple_server import make_server
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello world"

with make_server("127.0.0.1", 8080, app) as httpd:
    print(httpd.server_address)
    httpd.serve_forever()
