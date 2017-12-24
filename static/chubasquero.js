function generateSite () {
    console.log("generar sitio");
}

function previewSite () {
    console.log("previsualizar sitio");
}

function getPostList () {
    return new Promise((success, fail) => {
        setTimeout(() => {
            success([
                "Uno",
                "Dos",
                "Tres",
            ]);
        }, 2000);
    });
}

const contenido = document.getElementById("contenido");

const chubasquero = new Vue({
    delimiters: ["${", "}"],
    el: '#chubasquero',
    data: {
        posts: [],
        loadingPosts: false,
    },
    methods: {
        managePosts: function () {
            this.loadingPosts = true;
            getPostList().then((posts) => {
                this.loadingPosts = false;
                this.posts = posts;
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
