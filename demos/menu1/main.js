window.addEventListener('load', pageInit);

function pageInit() {
    createBoxes();

    window.addEventListener('keypress', function(e) {
        if(e.key == 'k') {
            animateFirstBox();    
        }
    });
}

function createBoxes() {

    window.container = document.querySelector('#menuContainer');

    for(var i = 0; i < 10; i++) {
        var box = document.createElement('div');
        box.className = "box";
        box.style.opacity = 0;
        box.style.transform = 'translateY(-130em)';
        container.appendChild(box);
    }
}

function animateFirstBox() {
    var firstBox = window.container.firstElementChild;

    anime({
        targets: firstBox,
        translateY: '-130em',
        duration: 500,
        easing: 'easeInOutCubic',
        complete: function() {
            
        }
    });




    // translate, THEN, rotate.
    // transform origin has nothing to do with that




}