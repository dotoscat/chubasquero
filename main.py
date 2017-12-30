import os.path
import subprocess
import json
import webbrowser
from wsgiref.simple_server import make_server
import flask
from docutils.core import publish_doctree
from docutils import nodes

try:
    import pelicanconf
except ImportError:
    print("pelicanconf not found.")
    exit(1)

HOST = "127.0.0.1"
PORT = 8080
URL = "http://{}:{}".format(HOST, PORT)
CONTENT_PATH = os.path.abspath(pelicanconf.PATH)

app = flask.Flask(__name__, static_url_path='')

def get_metadata_from(post_path):
    """Returns metadata post as a dict.
    
    Parameters:
        post_path (string): Post path
    
    Returns:
        (dict|None): meta info from the post. None if metadata is not found.
    """
    metadata = {}
    with open(post_path) as post_file:
        post_tree = publish_doctree(post_file.read())
        docinfo = post_tree[1]
        if not isinstance(docinfo, nodes.docinfo):
            return None
        for elem in docinfo:
            if isinstance(elem, nodes.date):
                metadata["date"] = elem.astext()
            else:
                key = elem[0].astext()
                if key in ("authors", "tags", "category"):
                    value = [v.strip() for v in elem[1].astext().split(',')]
                else:
                    value = elem[1].astext()
                metadata[key] = value
    return metadata
    
def get_post_list():
    """Returns a post list stored on :obj:`pelicanconf.PATH`."""
    posts = [get_metadata_from(post.path) for post in os.scandir(CONTENT_PATH)]
    return posts

def save_post_locally(post):
    """Saves the post object to disk.
    
    Parameters:
        post (dict): Post to save to disk.
    """
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
            if not value: continue
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
    file_path = os.path.join(CONTENT_PATH, filename)
    
    with open(file_path, "w") as post_file:
        post_file.write(post_body)

@app.route("/")
def index():
    """Returns to the user the Chubasquero frontend.
    
    The index shall be a jinja2 template. You pass to that template the
    URL of the server with its ip and port; and the default lang from
    pelicanconf defined from the user.
    """
    return flask.render_template("index.html"
        , **{"server": URL, "defaultLang": pelicanconf.DEFAULT_LANG})

@app.route("/posts", methods=["GET"])
def get_posts():
    posts = json.dumps(get_post_list())
    return posts

@app.route("/post", methods=["POST"])
def save_post():
    """Transforms the request send from the frontend to an object."""
    print("headers", flask.request.headers)
    print("is json", flask.request.is_json)
    post = flask.request.get_json(cache=False)
    save_post_locally(post)
    return json.dumps({"returncode": 0})
    
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
