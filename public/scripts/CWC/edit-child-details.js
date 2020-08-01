var editIcon = document.getElementById("edit-child-details-edit-icon-1");
var editIconParent = document.getElementById(
  "edit-child-details-edit-icon-parent-1"
);
var editArea = document.getElementById(
  "edit-child-details-edit-icon-edit-area-1"
);

editIcon.onclick = function () {
  editIconParent.classList.remove("editDetails-show-flex");
  editIconParent.classList.add("editDetails-hide");
  editArea.classList.remove("editDetails-hide");
  editArea.classList.add("editDetails-show-flex");
};

// var editIcon = [];
// var editIconParent = [];
// var editArea = [];
// for (let i = 1; i < 12; i++) {
//   editIcon[i] = document.getElementById("edit-child-details-edit-icon-" + i);
// }
