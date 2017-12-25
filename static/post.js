'use strict';

class Translation {
  constructor() {
    this.translation = true;
    this.content = '';
  }
}

class Post {
  constructor() {
    this._title = '';
    this.meta = {
      slug: '',
      date: '',// TODO: set current date
      modified: null,
      tags: [],
      category: [],
      authors: [],
      summary: '',
    };
    this.content = '';
    this.translations = new Map();
  }
  
  get title () {
    return this._title;
  }
  
  set title (title) {
    this._title = title;
    this.meta.slug = title.split(' ').join('-')
  }
  
}
