'use strict';

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

function previewSite () {
  console.log("previsualizar sitio");
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
    serverResponse: {returncode: 0, stdout: "", stderr: ""},
    autosaveInterval: null,
    postTextarea: null,
    savePostNotification: null
  },
  mounted: function () {
    this.postTextarea = document.getElementById("post-textarea");
    this.savePostNotification = document.getElementById("savepost-notification");
  },
  methods: {
    editPost: function (post) {
      this.isNewPost = false;
      this.cleanView();
      this.showEditor = true;
      // TODO: ask the server for the content based on post.slug and create a Post with it
      requestGetToServer('/post/' + post.slug).then((response) => {
        console.log('RequestGetPost', response);
      }, (error) => console.error("RequestGetPost " + post.slug, error));
      //this.$set(this, 'post', new Post());
      this.startAutosave();
      console.log("Edit post", post);
    },
    /**
     * Sends the content of the post as json to the server
     */
    savePost: function () {
      if (this.post.title.length === 0){
        this.savePostNotification.MaterialSnackbar.showSnackbar(
          {message: 'Title is empty!'}
        );
        return;
      }
      this.post.content = this.postTextarea.value;
      requestPostToServer('/post', this.post).then((response) => {
          const message = '"' + this.post.title + '" is saved.';
          this.savePostNotification.MaterialSnackbar.showSnackbar({message: message});
      }, (error) => console.log("post post error"));
    },
    /**
     * Each a few seconds the contents of the textarea is saved
     * in the post model 
     */
    startAutosave: function () {
      this.autosaveInterval = setInterval(() => {
        this.post.content = this.postTextarea.value;
      }, 5000);
    },
    /**
     * Stop autosaving the post textarea
     */
    stopAutosave: function () {
      clearInterval(this.autosaveInterval);
      this.autosaveInterval = null;
    },
    /**
     * @param {event} event On change event
     */
    onChangeTitle: function (event) {
      const title = event.target.value;
      console.log("onTitleChange", title);
      this.post.title = title;
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
      this.stopAutosave();
    },
    /**
     * Prepare content to edit a post
     */
    newPost: function () {
      this.isNewPost = true;
      this.cleanView();
      this.showEditor = true;
      this.$set(this, "post", new Post());
      this.startAutosave();
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
      requestGetToServer("/generate-site")
      .then((response) => {
        console.log("response", response);
        this.$set(this, "serverResponse", response);
        this.generatingSite = false;
      }, (error) => {
        this.generatingSite = false;
      });
    },
    previewSite: previewSite,
  }
});
