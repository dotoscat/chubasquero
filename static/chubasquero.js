'use strict';

window.addEventListener('beforeunload', (event) => {
  //const message = 'Use the close button from the webapp better';
  //event.returnValue = message;
  return '';
});

/**
 * This performs a fetch (with GET) to the server.
 * 
 * This functions depends of CHUBASQUERO_SERVER.
 * 
 * @param {string} route Route of the server
 * @returns {promise} A json promise 
 */
function requestGetToServer(route) {
  const request = fetch(CHUBASQUERO_SERVER + route);
  return request.then((response) => response.json());
}

/**
 * Makes a POST request to server with Fetch API.
 * 
 * The data passed is converted to JSON and sent to the server.
 * 
 * This functions depends of CHUBASQUERO_SERVER.
 * 
 * @param {string} route Route endpoint
 * @param {object} data Data with method POST (don't confuse with the post)
 * @returns {promise} A fetch promise
 */
function requestPostToServer(route, data) {
  const endpoint = CHUBASQUERO_SERVER + route;
  const sendObject = JSON.stringify(data);
  const fetchInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: sendObject
  };
  return fetch(endpoint, fetchInit);
}

const chubasquero = new Vue({
  delimiters: ["${", "}"],
  el: '#chubasquero',
  data: {
    post: new Post(),
    isNewPost: false,
    posts: [],
    loadingPosts: false,
    showPosts: false,
    showEditor: false,
    showGenerateSite: false,
    generatingSite: false,
    serverResponse: {returncode: -1, stdout: '', stderr: ''},
    postTextarea: null,
    notification: null,
    addTranslationCounter: 0,
  },
  mounted: function () {
    this.postTextarea = document.getElementById("post-textarea");
    this.notification = document.getElementById("notification");
  },
  methods: {
    addTranslation: function (event) {
      const value = this.$refs.translation.value;
      if (value.match(/[aA-zZ]{2}/) === null) return;
      // FIXME: Post has a method to add a translation. Use next line cause Vuejs
      this.$set(this.post.translations, value, new Translation()); 
      this.$refs.translation.value = '';
    },
    onChangePostContent: function (event) {
      this.post.content = event.target.value;
    },
    onChangeCategory: function (event) {
      this.post.meta.category = event.target.value;
    },
    onChangeTags: function (event) {
      const tags = event.target.value;
      this.post.tags = tags;
    },
    /**
     * Request close the server. The user still has to close manually the
     * window where the webapp runs.
     */
    close: function () {
      requestPostToServer('/close', {});// Don't expect response from a closed server...
      this.notification.MaterialSnackbar.showSnackbar(
        {message: 'Now you can close this window'}
      );
    },
    /**
     * Clean post editor view.
     */
    cleanPostEditor: function () {
      this.$refs.slug.value = '';
      this.$refs.postTextarea.value = '';
      this.$refs.tags.value = '';
      this.$refs.category.value = '';
    },
    /**
     * Request to the server the content of post, which is only metadata.
     * 
     * @param {object} post
     */
    editPost: function (post) {
      this.isNewPost = false;
      this.cleanView();
      this.showEditor = true;
      requestGetToServer('/post/' + post.slug).then((response) => {
        console.log('RequestGetPost', response);
        const post = new Post(response);
        this.postTextarea.value = response.content;
        this.$refs.slug.value = response.meta.slug;
        this.$refs.tags.value = post.tags;
        this.$refs.category.value = post.meta.category;
        componentHandler.upgradeElement(this.$refs.slug);
        componentHandler.upgradeElement(this.postTextarea);
        componentHandler.upgradeElement(this.$refs.tags);
        componentHandler.upgradeElement(this.$refs.category);
        this.$set(this, 'post', post);
      }, (error) => console.error("RequestGetPost " + post.slug, error));
      console.log("Edit post", post);
    },
    /**
     * Sends the content of the post as json to the server
     */
    savePost: function () {
      if (this.post.meta.slug.length === 0){
        this.notification.MaterialSnackbar.showSnackbar(
          {message: 'Slug is empty!'}
        );
        return;
      }
      this.post.content = this.postTextarea.value;
      if (!this.isNewPost) {
        this.post.modify();
      }
      requestPostToServer('/post', this.post).then((response) => {
          const message = '"' + this.post.meta.slug + '" is saved.';
          this.notification.MaterialSnackbar.showSnackbar({message: message});
      }, (error) => console.log("post post error"));
    },
    /**
     * @param {event} event On change event
     */
    onChangeSlug: function (event) {
      const slug = event.target.value.replace(/\s/g, '-');
      event.target.value = slug;
      console.log("onChangeSlug", slug);
      this.post.meta.slug = slug;
    },
    /**
     * Clean the current sections.
     * 
     * Actually what this does is set all the show group to false
     */
    cleanView: function (){
      this.showPosts = false;
      this.showEditor = false;
      this.showGenerateSite = false;
    },
    /**
     * Prepare content to edit a post
     */
    newPost: function () {
      this.isNewPost = true;
      this.cleanView();
      this.cleanPostEditor();
      this.showEditor = true;
      this.$set(this, "post", new Post());
      console.log("new post")
    },
    /**
     * Change content to manage posts
     */
    managePosts: function () {
      this.cleanView();
      this.showPosts = true;
      this.loadingPosts = true;
      this.posts = [];
      requestGetToServer("/posts")
      .then((posts) => {
        console.log("posts", posts);
        this.$set(this, "posts", posts);
        this.loadingPosts = false;
      }, (error) => {
        console.error("posts", error);
        this.loadingPosts = false;
      });
    },
    /**
     * Generate a site and wait for server response
     */
    generateSite: function () {
      this.cleanView();
      this.showGenerateSite = true;
      this.generatingSite = true;
      this.serverResponse.stdout = '';
      this.serverResponse.stderr = '';
      this.serverResponse.returncode = -1;
      requestGetToServer("/generate-site")
      .then((response) => {
        console.log("response", response);
        this.$set(this, "serverResponse", response);
        this.generatingSite = false;
      }, (error) => {
        this.generatingSite = false;
      });
    },
    previewSite: function () {
      requestPostToServer('/preview', {});
    },
  }
});
