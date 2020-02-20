const rimraf = require("rimraf");
const userjs = require('./user/user');
const settingsjs = require('./settings/settings');
const projectjs = require('./project/project');
const codeeditorjs = require('./codeeditor/codeeditor');
const nodeeditorjs = require('./nodeeditor/nodeeditor');
const trainingjs = require('./training/training');

function settingsBackButton(){
    $("#settings-back-button").click(() => {
        init();
    });
}

function userSettingsButton(){
    $("#user-settings-button").click(() => {
        loadPage("settings/settings.html", ()=>{
            settingsBackButton();
        });
    });
}

function projectBackButton(){
    $("#project-details-back-button").click(() => {
        init();
    });
}

function projectDeleteButtons(){
    $(".deletebuttons").click((value) => {
        swal({
            title: "Are you sure?",
            text: `You are going to delete project named '${globaljs.projectDetails.name}'.Once deleted, you will not be able to recover this project!`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                try {
                    rimraf.sync(path.join(projects_path,globaljs.projectDetails.name));
                    swal(`Your project '${globaljs.projectDetails.name}' has been deleted!`, {
                        icon: "success",
                    });
                } catch (err) {
                    swal(`Failed to delete project.`, {
                        icon: "error",
                    });
                }
                init();
            }
        });
    });
}

function userProjectButtons(){
    $(".settingsbuttons").click((value) => {
        userjs.setProject(value);
        loadPage("project/project.html", ()=>{
            projectjs.init();
            projectDeleteButtons();
            projectBackButton();
        });
    });
    
    $(".opencodeeditor").click((value) => {
        userjs.setProject(value);
        userjs.startTensorboard(globaljs.projectDetails.name);
        loadPage("codeeditor/codeeditor.html", ()=>{
            codeeditorjs.init();
            codeeditorTrainButton();
            codeeditorBackButton();
            codeeditorSaveButton();
        });
    });
    
    $(".opennodeeditor").click((value) => {
        userjs.setProject(value);
        loadPage("nodeeditor/nodeeditor.html", ()=>{
            nodeeditorjs.init();
            nodeeditorGenerateCodeButton();
        });
    });
}


function nodeeditorGenerateCodeButton(){
    $("#nodeeditor-train-button").click(()=> {
        nodeeditorjs.generateCode();
        loadPage("codeeditor/codeeditor.html", ()=>{
            codeeditorjs.init();
            codeeditorTrainButton();
            codeeditorBackButton();
            codeeditorSaveButton();
        });
    });
}

function trainingBackButton(){
    $("#training-back-button").click(()=> {
        if (trainingjs.pythonclosed) {
            swal("Info", "Model training is in progress. Stop the training or let it finish to go back!", "info");
        } else {
            loadPage("codeeditor/codeeditor.html", ()=>{
                codeeditorjs.init();
                codeeditorTrainButton();
                codeeditorBackButton();
                codeeditorSaveButton();
            });
        }
    });
}

function codeeditorTrainButton(){
    $("#codeeditor-train-button").click(() =>{
        codeeditorjs.saveProject(false);
        loadPage("training/training.html", ()=>{
            trainingjs.init();
            trainingBackButton();
        });
    });
}

function codeeditorSaveButton(){
    $("#codeeditor-save-project-button").click(()=> {
        codeeditorjs.saveProject(true);
    });
}

function codeeditorBackButton(){
    $("#codeeditor-back-button").click(()=> {
        init();
    });
}

function init(){
    userjs.killTensorboard();
    loadPage("user/user.html", ()=>{
        userjs.init();
        userjs.loadProjects();
        userSettingsButton();
        userProjectButtons();
    });
}

$(document).ready(() => {
    init();
});
