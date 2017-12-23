function managePosts () {
    console.log("gestionar posts");
}

function generateSite () {
    console.log("generar sitio");
}

function previewSite () {
    console.log("previsualizar sitio");
}

const chubasquero = new Vue({
    el: '#chubasquero',
    methods: {
        managePosts: managePosts,
        generateSite: generateSite,
        previewSite: previewSite,
    }
});
