const global = require('../../lib/global');
const swal = require('sweetalert');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#goBack").click(() => {
    loadPage("user/user.html");
});
