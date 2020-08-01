//var editIcon = document.getElementById("edit-child-details-edit-icon-1");
//var editIconParent = document.getElementById(
  //"edit-child-details-edit-icon-parent-1"
//);
//var editArea = document.getElementById(
 // "edit-child-details-edit-icon-edit-area-1"
//);

//editIcon.onclick = function () {
  //editIconParent.classList.remove("editDetails-show-flex");
  //editIconParent.classList.add("editDetails-hide");
  //editArea.classList.remove("editDetails-hide");
  //editArea.classList.add("editDetails-show-flex");
//};

 var editIcon = [];
 var editIconParent = [];
 var editArea = [];
 for (let i = 1; i < 15; i++) {
   editIcon[i] = document.getElementById("edit-child-details-edit-icon-" + i);
   editIconParent[i] = document.getElementById(
    "edit-child-details-edit-icon-parent-" + i
  );
  editArea[i] = document.getElementById(
    "edit-child-details-edit-icon-edit-area-" + i
  );
  editIcon[i].onclick = function () {
    editIconParent[i].classList.remove("editDetails-show-flex");
    editIconParent[i].classList.add("editDetails-hide");
    editArea[i].classList.remove("editDetails-hide");
    editArea[i].classList.add("editDetails-show-flex");
  };
 }
