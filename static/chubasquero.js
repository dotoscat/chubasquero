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

function previewSite () {
  console.log("previsualizar sitio");
}

const chubasquero = new Vue({
  delimiters: ["${", "}"],
  el: '#chubasquero',
  data: {
    post: new Post(),
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
      const endpoint = CHUBASQUERO_SERVER + '/post';
      this.post.content = this.postTextarea.value;
      const sendObject = JSON.stringify(this.post);
      const fetchInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: sendObject
      };
      const sendPostNotification = document.getElementB
      fetch(endpoint, fetchInit).then((response) => {
          // TODO: Display on screen discretly the result of the operation
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
