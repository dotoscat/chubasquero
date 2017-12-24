function generateSite () {
    const request = fetch(CHUBASQUERO_SERVER + "/generate-site");
    return request.then((response) => response.json());
}

function previewSite () {
    console.log("previsualizar sitio");
}

function getPostList () {
    const request = fetch(CHUBASQUERO_SERVER + "/posts");
    return request.then((response) => response.json());
}

const chubasquero = new Vue({
    delimiters: ["${", "}"],
    el: '#chubasquero',
    data: {
        posts: [],
        loadingPosts: false,
        showPosts: false,
        showEditor: false,
        showGenerateSite: false,
        generatingSite: false,
        serverResponse: {code: 0, message: ""}
    },
    methods: {
        cleanView: function (){
            this.showPosts = false,
            this.showEditor = false,
            this.showGenerateSite = false
        },
        newPost: function () {
            this.cleanView();
            this.showEditor = true;
            console.log("new post")
        },
        managePosts: function () {
            this.cleanView();
            this.showPosts = true;
            this.loadingPosts = true;
            this.posts = [];
            getPostList().then((posts) => {
                console.log("posts", posts);
                this.posts = posts;
                this.loadingPosts = false;
            }, (error) => {
                console.error("posts", error);
                this.loadingPosts = false;
            });
        },
        generateSite: function () {
            this.cleanView();
            this.showGenerateSite = true;
            this.generatingSite = true;
            generateSite().then((response) => {
                console.log("response", response);
                this.$set(this, "serverResponse", response);
                this.generatingSite = false;
            }, (error) => {
                this.generatingSite = false;
            });
        },
        previewSite: previewSite,
    },
    watch: {
        posts: function (value) {
            console.log("watch posts");
            this.posts = value;
        }
    }
});
