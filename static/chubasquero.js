function generateSite () {
    console.log("generar sitio");
}

function previewSite () {
    console.log("previsualizar sitio");
}

function getPostList () {
    const request = fetch(CHUBASQUERO_SERVER + "/posts");
    return request.then((response) => response.json());
}

const contenido = document.getElementById("contenido");

const chubasquero = new Vue({
    delimiters: ["${", "}"],
    el: '#chubasquero',
    data: {
        posts: [],
        loadingPosts: false,
        showPosts: false,
        showEditor: false
    },
    methods: {
        cleanView: function (){
            this.showPosts = false,
            this.showEditor = false
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
            getPostList().then((posts) => {
                console.log("posts", posts);
                this.posts = posts;
                this.loadingPosts = false;
            }, (error) => {
                console.error("posts", error);
                this.loadingPosts = false;
            });
        },
        generateSite: generateSite,
        previewSite: previewSite,
    },
    watch: {
        posts: function (value) {
            console.log("watch posts");
            this.posts = value;
        }
    }
});
