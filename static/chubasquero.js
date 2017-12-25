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
    post: null,
    posts: [],
    loadingPosts: false,
    showPosts: false,
    showEditor: false,
    showGenerateSite: false,
    generatingSite: false,
    serverResponse: {returncode: 0, stdout: "", stderr: ""}
  },
  methods: {
    /**
     * Clean the current sections.
     * 
     * Actually what this does is set all the show group to false
     */
    cleanView: function (){
      this.showPosts = false,
      this.showEditor = false,
      this.showGenerateSite = false
    },
    /**
     * Prepare content to edit a post
     */
    newPost: function () {
      this.cleanView();
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
