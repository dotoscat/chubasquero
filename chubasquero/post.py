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

import re
import os.path
import sys
from docutils.core import publish_doctree
from docutils import nodes

sys.path.append(os.getcwd())

try:
    import pelicanconf
except ImportError:
    print("pelicanconf not found.")
    exit(1)

CONTENT_PATH = os.path.abspath(pelicanconf.PATH)

def get_post_translations(slug):
    """Get the translations of a post based on its slug.
    
    Parameters:
        slug (string):
    
    Returns:
        dict with the translations
    """
    posts = [get_post_data(entry) for entry in os.scandir(CONTENT_PATH)
    if entry.name.split('.')[0] == slug and len(entry.name.split('.')) > 2]
    return {translation["meta"]["lang"] : translation for translation in posts}

def get_post_data(post_path):
    """Returns a dict of the content of the post."""
    with open(post_path) as post_file:
        post_text = post_file.read()
        post_doctree = publish_doctree(post_text)
        meta = get_metadata_from_doctree(post_doctree)
        post_content = re.sub(":\w+:.*?\n", '', post_text).lstrip()
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
    for child in post_tree:
        if not isinstance(child, nodes.docinfo):
            continue
        for elem in child:
            if isinstance(elem, nodes.date):
                metadata["date"] = elem.astext()
            else:
                key = elem[0].astext()
                if key in ("authors"):
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
    """Returns a post list stored on :obj:`pelicanconf.PATH`.
    
    Only returns the original posts, not translations
    """
    post_list = [do_with_file(post.path, get_metadata_from_file)
        for post in os.scandir(CONTENT_PATH)
        if len(post.path.split('.')) == 2 and post.name.endswith(".rst")]
    print("post list", post_list)
    return post_list

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
    post_body += '\n'
    post_body += post["content"] + '\n'
    
    print("save post", post)
    print("post body", post_body)
    
    slug = post["meta"]["slug"]
    filename = slug + ".rst"
    file_path = os.path.join(CONTENT_PATH, filename)
    
    with open(file_path, "w", encoding="utf8") as post_file:
        post_file.write(post_body)
    
    for lang in post["translations"]:
        translation_filename = "{}.{}.rst".format(post["meta"]["slug"], lang)
        translation_filepath =  os.path.join(CONTENT_PATH, translation_filename)
        translation = post["translations"][lang]
        body = ""
        body += ":slug: {}\n".format(slug)
        body += ":lang: {}\n".format(lang)
        body += ":translation: {}\n".format("true" if translation["translation"] else "false")
        body += ":date: {}\n".format(post["meta"]["date"])
        body += '\n'
        body += translation["content"]
        with open(translation_filepath, "w", encoding="utf8") as translation_file:
            translation_file.write(body)
