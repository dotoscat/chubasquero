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
 *
 * @todo Title is inside content. Is better use the slug.
 */
class Post {
  constructor(jsonObject) {
    const thereisJsonObject = typeof jsonObject === 'object';
    this.meta = {
      slug: thereisJsonObject ? jsonObject.meta.slug : '',
      date: thereisJsonObject ? jsonObject.meta.date : Post._get_now(),
      //modified: null,
      tags: thereisJsonObject ? jsonObject.meta.tags : '',
      category: thereisJsonObject ? jsonObject.meta.category : '',
      authors: [],
      //summary: '',
    };
    this.content = thereisJsonObject ? jsonObject.content : '';
    this.translations = new Map();
  }
  
  get tags () {
    return this.meta.tags.replace(/, /g, ' ');
  }
  
  /**
   * @param {string} tags_string List of tags as a string
   */
  set tags (tags_string) {
    this.meta.tags = tags_string.replace(/ /g, ', ');
  }
  
  static _get_now () {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
  }
}
