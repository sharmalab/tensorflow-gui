
function init(){
    $("#project-name").val(globaljs.projectDetails.name);
    $("#project-description").val(globaljs.projectDetails.details);
    
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
        //         let projects_path = process.cwd() + "/testing/Projects/";
        //         if (!fs.existsSync(projects_path)) {
        //             fs.mkdirSync(projects_path);
        //         }

        //         if (!fs.existsSync(projects_path + dir)) {
        //             swal({
        //                 text: "Project Details",
        //                 title: "Update Project Details",
        //                 content: "input",
        //                 buttons: ["Cancel", "Update"],
        //             }).then(value => {
        //                 if (value == "") {
        //                     swal("Error", "Project Details can't be empty.");
        //                 } else if (value) {
        //                     fs.mkdirSync(projects_path + dir, err => {
        //                         if (err) {
        //                             print("Error creating folder", err);
        //                         }
        //                     });
        //                     fs.mkdirSync(projects_path + dir + "/logs");
        //                     let data = {
        //                         name: dir,
        //                         details: value,
        //                         creation_time: new Date(Date.now()).toString(),
        //                         code: "",
        //                         graph: ""
        //                     };
        //                     fs.writeFile(projects_path + dir + "/info.json", JSON.stringify(data), 'utf-8', err => {
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
}

module.exports = {
    init: init
}