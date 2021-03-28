
function init(){
    $("#project-name").val(globaljs.projectDetails.name);
    $("#project-description").val(globaljs.projectDetails.details);
    $(".savebuttons").hide();
    $(".cancelbuttons").hide();
    
    $(".updatebuttons").click((value) => {
        $("#project-name").removeClass("form-control-plaintext").addClass("form-control").attr("readonly", false);
        $("#project-description").removeClass("form-control-plaintext").addClass("form-control").attr("readonly", false);
        $(".updatebuttons").hide();
        $(".savebuttons").show();
        $(".cancelbuttons").show();
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

    $(".savebuttons").click((value) => {
        let project_name = $("#project-name").val();
        let project_description = $("#project-description").val();
        if(project_name == "") {
            swal("Error", "Project name can't be empty.", "error");
            return;
        }
        if(project_description == "") {
            swal("Error", "Project description can't be empty.", "error");
            return;
        }
        if(project_name === globaljs.projectDetails.name && project_description === globaljs.projectDetails.details) {
            swal("Error", "You have made no changes.", "error");
            return;
        }
        let dir = project_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        let old_dir = globaljs.projectDetails.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();;
        let projects_path = path.join(process.cwd(), "/../testing/Projects/");
        if(fs.existsSync(projects_path + dir)) {
            swal("Error", "A Project with this name already exists.", "error");
            return;
        }
        
        swal({
            title: "Save?",
            text: "Are you sure you want to save your changes?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((willSave) => {
            if(willSave) {
                try {
                    let data = JSON.parse(fs.readFileSync(projects_path + old_dir + "/info.json", "utf-8"));
                    data.name = dir;
                    data.details = project_description;

                    fs.writeFileSync(projects_path + old_dir + "/info.json", JSON.stringify(data), "utf-8");
                    
                    fs.renameSync(projects_path + old_dir, projects_path + dir);
                    swal("Success", "Project details have been successfully updated.", "success").then(value => {
                        globaljs.projectDetails.name = project_name;
                        globaljs.projectDetails.details = project_description;
    
                        $("#project-name").val(globaljs.projectDetails.name).removeClass("form-control")
                                    .addClass("form-control-plaintext").attr("readonly", true);
                        $("#project-description").val(globaljs.projectDetails.details).removeClass("form-control")
                                    .addClass("form-control-plaintext").attr("readonly", true);
                        $(".updatebuttons").show();
                        $(".savebuttons").hide();
                        $(".cancelbuttons").hide();
                    });
                }
                catch(err) {
                    swal("Error", "Error writing to files", "error");
                    print(err);
                    return;
                }
            }
        });            
    });

    $(".cancelbuttons").click((value) => {
        swal({
            title: "Discard changes?",
            text: "Are you sure you want to discard changes?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((willCancel) => {
            if(willCancel) {
                $("#project-name").val(globaljs.projectDetails.name).removeClass("form-control")
                            .addClass("form-control-plaintext").attr("readonly", true);
                $("#project-description").val(globaljs.projectDetails.details).removeClass("form-control")
                            .addClass("form-control-plaintext").attr("readonly", true);
                $(".updatebuttons").show();
                $(".savebuttons").hide();
                $(".cancelbuttons").hide();
            }
        });
    });
}

module.exports = {
    init: init
}