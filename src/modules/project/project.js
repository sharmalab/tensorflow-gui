const global = require('../../lib/global');
var rimraf = require("rimraf");
const swal = require('sweetalert');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#goBack").click(() => {
    global.projectDetails.name = "";
    global.projectDetails.details = "";
    loadPage("user/user.html");
});

$("#project-name").val(global.projectDetails.name);
$("#project-description").val(global.projectDetails.details);

$(".deletebuttons").click((value) => {
    let basepath = process.cwd() + "/testing/Projects/";
    let pdosi = $(value.target).siblings();
    swal({
        title: "Are you sure?",
        text: `You are going to delete project named '${global.projectDetails.name}'.Once deleted, you will not be able to recover this project!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            try {
                rimraf.sync(basepath + "/" + global.projectDetails.name);
                swal(`Your project '${global.projectDetails.name}' has been deleted!`, {
                    icon: "success",
                });
            } catch (err) {
                swal(`Failed to delete project.`, {
                    icon: "error",
                });
            }
            loadPage("user/user.html");
        }
    });
});

$(".updatebuttons").click((value) => {
    swal("Info","This feature is currently in development. Stay tune for updates.","info");
});