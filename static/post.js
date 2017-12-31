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
  constructor(jsonObject) {
    const thereisJsonObject = typeof jsonObject === 'object';
    this._title = thereisJsonObject
        ? jsonObject.meta.slug.replace('-', ' ')
        : '';
    this.meta = {
      slug: thereisJsonObject ? jsonObject.meta.slug : '',
      date: thereisJsonObject ? jsonObject.meta.date : Post._get_now(),
      modified: null,
      tags: [],
      category: [],
      authors: [],
      summary: '',
    };
    this.content = thereisJsonObject ? jsonObject.content : '';
    this.translations = new Map();
  }
  
  static _get_now () {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
  }
  
  get title () {
    return this._title;
  }
  
  set title (title) {
    this._title = title;
    this.meta.slug = title.split(' ').join('-')
  }
  
}
