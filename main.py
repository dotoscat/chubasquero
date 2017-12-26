import os.path
import subprocess
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

def save_post_locally(post):

    title = post["_title"]
    content = post["content"]
    
    post_body = ""
    post_body += title + '\n'
    post_body += '#'*len(title) + '\n\n'
    for key in post["meta"]:
        value = post["meta"][key]
        if value is None: continue
        if isinstance(value, str):
            post_body += ":{}: {}\n".format(key, value)
        elif isinstance(value, list):
            post_body += ":{}: ".format(key)
            for i, element in enumerate(value):
                if i == len(value):
                    post_body += element
                else:
                    post_body += element + ", "
            post_body += '\n'
    post_body += '\n\n'
    post_body += content + '\n'
    
    print("save post", post)
    print("post body", post_body)
    
    filename = post["meta"]["slug"] + ".rst"
    file_path = os.path.join(os.path.abspath(pelicanconf.PATH), filename)
    
    with open(file_path, "w") as post_file:
        post_file.write(post_body)
    

@app.route("/")
def index():
    return flask.render_template("index.html"
        , **{"server": URL, "defaultLang": pelicanconf.DEFAULT_LANG})

@app.route("/posts", methods=["GET"])
def get_posts():
    posts = json.dumps(["Uno", "Dos", "Y tres...", "..."])
    return posts

@app.route("/post", methods=["POST"])
def save_post():
    print("headers", flask.request.headers)
    print("is json", flask.request.is_json)
    post = flask.request.get_json(cache=False)
    save_post_locally(post)
    return json.dumps({"returncode": 0})
    
@app.route("/generate-site")
def generate_site():
    completed = subprocess.run("pelican", stdout=subprocess.PIPE
        , stderr=subprocess.PIPE)
    response = {"returncode": completed.returncode
        , "stdout": completed.stdout.decode()
        , "stderr": completed.stderr.decode()}
    return json.dumps(response)

with make_server(HOST, PORT, app) as httpd:
    print("open", URL)
    webbrowser.open(URL)
    httpd.serve_forever()
