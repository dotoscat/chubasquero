import signal
import os.path
# Chubasquero, a CMS built on top of Pelican
# Copyright (C) 2018 Oscar (dotoscat) Triano

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import subprocess
import json
import webbrowser
from wsgiref.simple_server import make_server
import flask
import chubasquero

signal.signal(signal.SIGINT, signal.SIG_DFL)

HOST = "127.0.0.1"
PORT = 8080
URL = "http://{}:{}".format(HOST, PORT)

PREVIEW_PORT = 8000
PREVIEW_URL = "http://{}:{}".format(HOST, PREVIEW_PORT)

preview_server = subprocess.Popen(['python', '-m', 'http.server', str(PREVIEW_PORT)]
    , cwd="output")
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

@app.route("/preview", methods=["POST"])
def preview():
    webbrowser.open(PREVIEW_URL)
    return ""

@app.route("/close", methods=["POST"])
def close():
    """Close the server.
    
    Todo:
        Close the server programmatically. This doesn't works.
    """
    global httpd
    # httpd.server_close()
    httpd.shutdown()
    print("Press Ctrl + C")
    return json.dumps({serverResponse: 0})

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
    return json.dumps(
        dict(**chubasquero.get_post_data(filepath)
            , translations=chubasquero.get_post_translations(slug)))

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
