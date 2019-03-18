function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#backPage").click(function () {
    loadPage("draw/draw.html")
});
