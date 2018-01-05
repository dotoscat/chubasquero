// Chubasquero, a CMS built on top of Pelican
// Copyright (C) 2018 Oscar (dotoscat) Triano

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

'use strict';

/**
 * A particular translation for a post.
 * @class
 */
class Translation {
  constructor(jsonObject) {
    const thereisJsonObject = typeof jsonObject === 'object';
    this.translation = thereisJsonObject
      ? jsonObject.meta.translation 
      : true;
    this.content = thereisJsonObject ? jsonObject.content : '';
  }
}

/**
 * This is a post.
 * @class
 *
 * This uses the global constant DEFAULT_LANG
 * 
 * @todo Title is inside content. Is better use the slug.
 */
class Post {
  constructor(jsonObject) {
    const thereisJsonObject = typeof jsonObject === 'object';
    this.meta = {
      slug: thereisJsonObject ? jsonObject.meta.slug : '',
      date: thereisJsonObject ? jsonObject.meta.date : Post._get_now(),
      modified: thereisJsonObject ? jsonObject.meta.modified : null,
      tags: thereisJsonObject ? jsonObject.meta.tags : '',
      category: thereisJsonObject ? jsonObject.meta.category : '',
      lang: thereisJsonObject ? jsonObject.meta.lang : DEFAULT_LANG,
      authors: [],
      //summary: '',
    };
    this.content = thereisJsonObject ? jsonObject.content : '';
    // FIXME: replace Map by object because vuejs
    this.translations = {};
    if (thereisJsonObject) {
      for (const lang in jsonObject.translations) {
        this.translations[lang] = new Translation(jsonObject.translations[lang]);
      }
    }
  }

  /**
   * @param {string} translation Identifier of the translations
   */
  getContentByTranslation (translation) {
    return this.translations[translation];
  }
  
  /**
   * Add a new translation to this post.
   * 
   * @param {string} translation Identifier for this translation
   */
  addTranslation (translation) {
    this.translations.set(translation, new Translation());
  }
  
  /**
   * Mark this modified.
   */
  modify(){
    this.meta.modified = Post._get_now();
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
