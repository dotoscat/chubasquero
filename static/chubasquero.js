function managePosts () {
    console.log("gestionar posts");
}

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
        posts: ["Uno", "Dos"]
    },
    methods: {
        managePosts: managePosts,
        generateSite: generateSite,
        previewSite: previewSite,
    },
    watch: {
        posts: function (value) {
            this.posts = value;
        }
    }
});
