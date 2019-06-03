// function for loading html pages by path
function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

// load initial page
$(document).ready(() => {
    loadPage("user/user.html");
});
