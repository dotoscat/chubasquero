import os.path
import subprocess
import json
import webbrowser
from wsgiref.simple_server import make_server
import flask
import chubasquero

HOST = "127.0.0.1"
PORT = 8080
URL = "http://{}:{}".format(HOST, PORT)

app = flask.Flask(__name__, static_url_path='')

@app.route("/")
def index():
    """Returns to the user the Chubasquero frontend.
    
    The index shall be a jinja2 template. You pass to that template the
    URL of the server with its ip and port; and the default lang from
    pelicanconf defined from the user.
    """
    return flask.render_template("index.html"
        , **{"server": URL, "defaultLang": chubasquero.pelicanconf.DEFAULT_LANG})

@app.route("/posts", methods=["GET"])
def get_posts():
    posts = json.dumps(chubasquero.get_post_list())
    return posts

@app.route("/post", methods=["POST"])
def save_post():
    """Transforms the request send from the frontend to an object."""
    print("headers", flask.request.headers)
    print("is json", flask.request.is_json)
    post = flask.request.get_json(cache=False)
    chubasquero.save_post_locally(post)
    return json.dumps({"returncode": 0})

@app.route("/post/<slug>", methods=["GET"])
def get_post(slug):
    """Returns a JSON object of the post to be used by javascript Post class."""
    filename = slug + ".rst";
    filepath = os.path.join(chubasquero.CONTENT_PATH, filename)
    return json.dumps(chubasquero.get_post_data(filepath))

@app.route("/generate-site")
def generate_site():
    """Generate the site."""
    completed = subprocess.run("pelican", stdout=subprocess.PIPE
        , stderr=subprocess.PIPE)
    response = {"returncode": completed.returncode
        , "stdout": completed.stdout.decode()
        , "stderr": completed.stderr.decode()}
    return json.dumps(response)

if __name__ == "__main__":
    with make_server(HOST, PORT, app) as httpd:
        print("open", URL)
        webbrowser.open(URL)
        httpd.serve_forever()
