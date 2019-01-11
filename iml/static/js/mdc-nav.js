const MDCDrawer = mdc.drawer.MDCDrawer;
const MDCTopAppBar = mdc.topAppBar.MDCTopAppBar;
const MDCTextField = mdc.textField.MDCTextField;
const MDCNotchedOutline = mdc.notchedOutline.MDCNotchedOutline;
const MDCSnackbar = mdc.snackbar.MDCSnackbar;

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));

const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(e) {
  return new MDCTextField(e);
});

//topbar and drawer
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});


$(".drawer-haschild").on("click",function(){
    if($(this).hasClass('toggled')){
        $(this).removeClass("toggled");
        $(this).find(".meuicon").html("keyboard_arrow_down");
    }
    else{
        $(this).addClass("toggled");
        $(this).find(".meuicon").html("keyboard_arrow_up");
    }

    $(this).next("nav.mdc-sub-list").toggle();
});



// snackbar for flashes
// VERY TEMPORARY SOLUTION, MUST BE REWORKED
const flashes = [].map.call(document.querySelectorAll('.mdc-snackbar'), function(e) {
    return new MDCSnackbar(e);
});

for (i in flashes) {
    flashes[i].open();
    flashes[i].timeoutMs = 5000+50*i;
}

// const notchedOutlines = [].map.call(document.querySelectorAll('.mdc-notched-outline'), function(e) {
//     return new MDCNotchedOutline(e);
// });
// topAppBar.listen('MDCTopAppBar:nav', () => {
//     drawer.open = !drawer.open;
// });
