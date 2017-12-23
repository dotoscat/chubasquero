function managePosts () {
    console.log("gestionar posts");
}

function generateSite () {
    console.log("generar sitio");
}

function previewSite () {
    console.log("previsualizar sitio");
}

const contenido = document.getElementById("contenido");

const chubasquero = new Vue({
    el: '#chubasquero',
    data: {
        posts: []
    },
    methods: {
        managePosts: managePosts,
        generateSite: generateSite,
        previewSite: previewSite,
    }
});
