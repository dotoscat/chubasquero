'use strict';

/**
 * A particular translation for a post.
 * @class
 */
class Translation {
  constructor() {
    this.translation = true;
    this.content = '';
  }
}

/**
 * This is a post.
 * @class
 */
class Post {
  constructor() {
    const now = new Date();
    this._title = '';
    this.meta = {
      slug: '',
      date: Post._get_now(),
      modified: null,
      tags: [],
      category: [],
      authors: [],
      summary: '',
    };
    this.content = '';
    this.translations = new Map();
  }
  
  static _get_now () {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate() + 1} ${now.getHours()}:${now.getMinutes()}`;
  }
  
  get title () {
    return this._title;
  }
  
  set title (title) {
    this._title = title;
    this.meta.slug = title.split(' ').join('-')
  }
  
}
