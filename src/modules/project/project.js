const global = require('../../lib/global');
var rimraf = require("rimraf");
const swal = require('sweetalert');
const path = require('path');

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
    let basepath = path.join(process.cwd(), "/../testing/Projects/");
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
                rimraf.sync(path.join(basepath,global.projectDetails.name));
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
    // swal({
    //     text: "Project Name",
    //     title: "Update Project Details",
    //     content: "input",
    //     buttons: ["Cancel", "Next"],
    // }).then((value) => {
    //     if (value == "") {
    //         swal("Error", "Projet Name can't be empty.", "error");
    //     } else if (value) {
    //         let dir = value.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    //         let basepath = process.cwd() + "/testing/Projects/";
    //         if (!fs.existsSync(basepath)) {
    //             fs.mkdirSync(basepath);
    //         }

    //         if (!fs.existsSync(basepath + dir)) {
    //             swal({
    //                 text: "Project Details",
    //                 title: "Update Project Details",
    //                 content: "input",
    //                 buttons: ["Cancel", "Update"],
    //             }).then(value => {
    //                 if (value == "") {
    //                     swal("Error", "Project Details can't be empty.");
    //                 } else if (value) {
    //                     fs.mkdirSync(basepath + dir, err => {
    //                         if (err) {
    //                             print("Error creating folder", err);
    //                         }
    //                     });
    //                     fs.mkdirSync(basepath + dir + "/logs");
    //                     let data = {
    //                         name: dir,
    //                         details: value,
    //                         creation_time: new Date(Date.now()).toString(),
    //                         code: "",
    //                         graph: ""
    //                     };
    //                     fs.writeFile(basepath + dir + "/info.json", JSON.stringify(data), 'utf-8', err => {
    //                         if (err) {
    //                             print("Error writing file", err);
    //                         } else {
    //                             loadProjects();
    //                             swal("Create New Project", "Project created successfully.", "success");
    //                         }
    //                     });
    //                 }
    //             });
    //         } else {
    //             swal("Error", "Project with this name already exists.", "error");
    //         }
    //     }
    // });
    swal("Info","This feature is currently in development. Stay tune for updates.","info");
});