const MDCDrawer = mdc.drawer.MDCDrawer;
const MDCTopAppBar = mdc.topAppBar.MDCTopAppBar;
const MDCTextField = mdc.textField.MDCTextField;

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));

const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(e) {
  return new MDCTextField(e);


});
// topAppBar.listen('MDCTopAppBar:nav', () => {
//     drawer.open = !drawer.open;
// });
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


