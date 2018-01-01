import re
import os.path
from docutils.core import publish_doctree
from docutils import nodes

try:
    import pelicanconf
except ImportError:
    print("pelicanconf not found.")
    exit(1)

CONTENT_PATH = os.path.abspath(pelicanconf.PATH)

def get_post_data(post_path):
    """Returns a dict of the content of the post."""
    with open(post_path) as post_file:
        post_text = post_file.read()
        post_doctree = publish_doctree(post_text)
        meta = get_metadata_from_doctree(post_doctree)
        post_content = re.sub(":\w+:.*?\n", '', post_text)
        post = {"meta": meta, "content": post_content}
        return post

def get_metadata_from_file(post_file):
    """Get just the metadata from the post file."""
    post_doctree = publish_doctree(post_file.read())
    return get_metadata_from_doctree(post_doctree)

def get_metadata_from_doctree(post_tree):
    """Returns metadata post as a dict.
    
    Parameters:
        post_tree (:obj:`docutils.nodes.document`): Post tree
    
    Returns:
        (dict|None): meta info from the post. None if metadata is not found.
        
    Todo:
        This function assumes that the docinfo tag is the first child of the
        doctree. Extract tags from docinfo anywere of the doctree.
    """
    metadata = {}
    docinfo = post_tree[0]
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

def do_with_file(path, action):
    """Do some *action* with an file opened with path.
    
    Parameters:
        path (str): Path of the file
        action (callable): A callable with a file descriptor as first argument.
    
    Returns:
        The return value of *action*
    """
    with open(path, encoding="utf8") as this_file:
        return action(this_file)

def get_post_list():
    """Returns a post list stored on :obj:`pelicanconf.PATH`."""
    return [do_with_file(post.path, get_metadata_from_file)
        for post in os.scandir(CONTENT_PATH)]

def save_post_locally(post):
    """Saves the post object to disk.
    
    Parameters:
        post (dict): Post to save to disk.
    """
    post_body = ""
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
    post_body += post["content"] + '\n'
    
    print("save post", post)
    print("post body", post_body)
    
    filename = post["meta"]["slug"] + ".rst"
    file_path = os.path.join(CONTENT_PATH, filename)
    
    with open(file_path, "w", encoding="utf8") as post_file:
        post_file.write(post_body)
