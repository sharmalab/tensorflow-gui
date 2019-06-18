const {
    ipcRenderer
} = require('electron')
const swal = require('sweetalert');
const fs = require('fs');
const global = require('../../lib/global');
const print = console.log;
const childprocess = require('child_process');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#user-create-project-button").click(() => {
    swal({
        text: "Project Name",
        title: "Create New Project",
        content: "input",
        buttons: ["Cancel", "Next"],
    }).then((value) => {
        if (value == "") {
            swal("Error", "Projet Name can't be empty.", "error");
        } else if (value) {
            let dir = value.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            let basepath = process.cwd() + "/testing/Projects/";
            if (!fs.existsSync(basepath)) {
                fs.mkdirSync(basepath);
            }

            if (!fs.existsSync(basepath + dir)) {
                fs.mkdirSync(basepath + dir, err => {
                    if (err) {
                        print("Error creating folder", err);
                    }
                });
                fs.mkdirSync(basepath + dir + "/logs");
                swal({
                    text: "Project Details",
                    title: "Create New Project",
                    content: "input",
                    buttons: ["Cancel", "Create"],
                }).then(value => {
                    if (value == "") {
                        swal("Error", "Project Details can't be empty.");
                    } else if (value) {
                        let data = {
                            name: dir,
                            details: value,
                            creation_time: new Date(Date.now()).toString(),
                            code: "",
                            graph: ""
                        };
                        fs.writeFile(basepath + dir + "/info.json", JSON.stringify(data), 'utf-8', err => {
                            if (err) {
                                print("Error writing file", err);
                            } else {
                                loadProjects();
                                swal("Create New Project", "Project created successfully.", "success");
                            }
                        });
                    }
                });
            } else {
                swal("Error", "Project with this name already exists.", "error");
            }
        }
    });
});

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function loadProjects() {
    let basepath = process.cwd() + "/testing/Projects/";
    let dirlist = getDirectories(basepath)

    $("#user-projects-card-row").empty();
    for (let dir in dirlist) {
        fs.readFile(basepath + dirlist[dir] + "/info.json", (err, fileData) => {
            if (err) {
                return print("Error in reading all projects", err)
            }
            try {
                const object = JSON.parse(fileData);
                $("#user-projects-card-row").append(`
                <div class="col-sm-*">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${object.name}</h5>
                            <p class="card-text">${object.details}</p>
                            <button type="button" class="btn btn-primary m-1 openbuttons">
                                Open Project
                            </button>
                            <button type="button" class="btn btn-primary m-1 settingsbuttons">
                                Settings
                            </button>
                            </div>
                        </div>
                    </div>
                `);

                $(".settingsbuttons").click((value) => {
                    let pdosi = $(value.target).siblings();
                    global.projectDetails.name = pdosi[0].innerText;
                    global.projectDetails.details = pdosi[1].innerText;

                    loadPage("project/project.html");
                });

                

                $(".openbuttons").click((value) => {
                    let pdosi = $(value.target).siblings();
                    global.projectDetails.name = pdosi[0].innerText;
                    global.projectDetails.details = pdosi[1].innerText;

                    let killtensorboard = childprocess.spawn('killall', ["-9", "tensorboard"]);

                    var env = Object.create(process.env);
                    killtensorboard.on('close', (code) => {
                        let tensorbaord = childprocess.spawn('tensorboard', ["--logdir=testing/Projects/" + global.projectDetails.name + "/logs/", "--reload_interval", "4"], {
                            env: env
                        });

                        console.log(`child process exited with code ${code}`);
                    });

                    loadPage("draw/draw.html");
                });
            } catch (err) {
                return print("Error in reading all projects", err)
            }
        })
    }
}

$(document).ready(() => {
    loadProjects();
});