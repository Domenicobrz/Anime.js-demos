window.addEventListener('load', pageInit);

function pageInit() {
    "use strict";
    var box1 = document.querySelector('#box1');
    window.bottomrect = box1.getBoundingClientRect().bottom;
    window.distanceToBottom = window.innerHeight - bottomrect;
    window.boxheight = box1.clientHeight;

    
    window.boxes = [
        new Box('#box1'),
        new Box('#box2'),
        new Box('#box3'),
        new Box('#box4'),
        new Box('#box5')
    ];


    // used for debugging
    // window.addEventListener('keydown', function keydown(e) {
    //     if (e.key == 'k') {
    //         shutBoxDown(boxes[0]);
    //     }

    //     if (e.key == 'i') {
    //         shutBoxDown(boxes[1]);
    //     }

    //     if (e.key == 'p') {
    //         shutBoxDown(boxes[2]);
    //     }

    //     if (e.key == 'u') {
    //         shutBoxDown(boxes[4]);
    //     }

    //     if (e.key == 'o') {
    //         shutBoxDown(boxes[3]);
    //     }
    // });


    // registering hover events
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].dom.addEventListener('mouseenter', boxHovered);
        boxes[i].dom.addEventListener('mouseleave', boxUnhovered);
    }
}

/**
 *  @param Number state         - possible values: idle goingdown down goingup up
 */
function Box(id) {
    this.id = id;
    this.dom = document.querySelector(id);
    this.state = 'idle';
}

// the boxes that are "up" shold go down
function boxUnhovered(e) {
    "use strict";

    for (var i = 0; i < 5; i++) {
        var id = 'box' + (i + 1);
        if (e.currentTarget.id === id) {
            if (boxes[i].state == 'goingdown') continue;
            if (boxes[i].state == 'down') continue;
            if (boxes[i].state == 'goingup') continue;
            shutBoxDown(boxes[i], e.currentTarget);
            boxes[i].state = 'goingdown';
        }
    }
}

function boxHovered(e) {
    "use strict";

    for (var i = 0; i < 5; i++) {
        var id = 'box' + (i + 1);
        if (e.currentTarget.id !== id) {
            if (boxes[i].state == 'goingdown') continue;
            if (boxes[i].state == 'down') continue;
            shutBoxDown(boxes[i]);
            boxes[i].state = 'goingdown';
        }
        if (e.currentTarget.id === id) {
            //if(boxes[i].state == 'goingdown') continue;
            if (boxes[i].state == 'goingup') continue;
            if (boxes[i].state == 'up') continue;

            boxes[i].state = 'goingup';

            anime.remove(e.currentTarget);

            var element_reference = e.currentTarget;

            if (e.currentTarget.id === "box1" || e.currentTarget.id === "box3") {
                anime({
                    targets: e.currentTarget,
                    translateY: 0,
                    translateX: 0,
                    scale: 1.1,
                    rotate: -30,
                    autoplay: true,
                    duration: 2000,
                    begin: function () {
                        riseUpAssignClasses(element_reference);
                    },
                    complete: function (index) {
                        return function () {
                            boxes[index].state = 'up';
                        };
                    }(i)
                });
            } else {
                anime({
                    targets: e.currentTarget,
                    translateY: 0,
                    translateX: 0,
                    scale: 1.1,
                    transformOrigin: { value: '50% 50%', easing: 'easeInOutCubic', duration: 500 },
                    rotate: -30,
                    autoplay: true,
                    duration: 2000,
                    begin: function () {
                        riseUpAssignClasses(element_reference);
                    },
                    complete: function (index) {
                        return function () {
                            boxes[index].state = 'up';
                            document.querySelector(boxes[index].id).style.transformOrigin = '50% 50%';
                        };
                    }(i)
                });
            }
        }
    }
}

function shutBoxDown(box) {
    "use strict";

    if (box.id === '#box1') {
        anime.remove('#box1');
        
        anime({
            targets: ['#box1'],
            translateY: [
                { value: distanceToBottom, duration: 400, easing: 'easeInCubic' },
                { value: distanceToBottom - boxheight * 0.25, duration: 200, easing: 'easeOutCubic' },
                { value: distanceToBottom, duration: 100, delay: 450, easing: 'easeInCubic' }
            ],
            rotate: [
                { value: 180, duration: 600, delay: 500, easing: 'easeInOutCubic' }
            ],
            autoplay: true,
            begin: function () {
                shutDownAssignClasses('#box1');
            },
            complete: function () {
                box.state = 'down';
            }
        });
    }

    if (box.id === '#box2') {
        anime.remove('#box2');

        anime({
            targets: ['#box2'],
            translateY: [
                { value: distanceToBottom, duration: 600, easing: 'easeInCubic' },
                { value: distanceToBottom, duration: 600, easing: 'easeInCubic' },
            ],
            transformOrigin: [
                { value: ['0% 100%', '0% 100%'], easing: 'easeInCubic' }
            ],
            rotate: [
                { value: 0, duration: 600, easing: 'easeOutCubic' },
                { value: -30, duration: 500, easing: 'easeOutCubic' },
                { value: 0, duration: 300, easing: 'easeInCubic' },
                { value: -10, duration: 150, easing: 'easeOutCubic' },
                { value: 0, duration: 150, easing: 'easeInCubic' },
            ],
            autoplay: true,
            duration: 2000,
            begin: function () {
                shutDownAssignClasses('#box2');
            },
            complete: function () {
                box.state = 'down';
                document.querySelector(box.id).style.transformOrigin = '0% 100%';
            }

        });
    }

    if (box.id === '#box3') {
        anime.remove('#box3');

        anime({
            targets: ['#box3'],
            translateY: [
                { value: -boxheight * 0.5, duration: 300, easing: 'easeOutCubic' },
                { value: distanceToBottom, duration: 600, easing: 'easeInCubic' },
            ],
            rotate: [
                { value: -270, duration: 900, easing: 'easeOutCubic' }
            ],
            autoplay: true,
            begin: function () {
                shutDownAssignClasses('#box3');
            },
            complete: function () {
                box.state = 'down';
                document.querySelector(box.id).style.transformOrigin = '50% 50%';
            }

        });
    }

    if (box.id === '#box4') {
        anime.remove('#box4');

        anime({
            targets: ['#box4'],
            translateY: [
                { value: distanceToBottom - boxheight, duration: 600, delay: 600, easing: 'easeInCubic' }
            ],
            transformOrigin: [
                { value: '0% 100%', duration: 0, easing: 'easeInCubic' },
                { value: '0% 100%', duration: 300, easing: 'easeOutCubic' }
            ],
            scaleX: [1.01],
            rotate: [
                { value: 90, duration: 2600, elasticity: 600 },
            ],
            autoplay: true,
            duration: 2000,
            begin: function () {
                shutDownAssignClasses('#box4');
            },
            complete: function () {
                box.state = 'down';
                document.querySelector(box.id).style.transformOrigin = '0% 100%';
            }

        });
    }

    if (box.id === '#box5') {
        anime.remove('#box5');
        // where's the end of the screen?

        anime({
            targets: ['#box5'],
            translateY: [
                { value: distanceToBottom, duration: 700, easing: 'easeInCubic' },
                { value: [distanceToBottom + boxheight, distanceToBottom + boxheight], duration: 300, easing: 'easeInCubic' },
                { value: [distanceToBottom + boxheight, distanceToBottom + boxheight], duration: 200, easing: 'easeInCubic' },
                { value: [distanceToBottom, distanceToBottom], duration: 300, easing: 'easeInCubic' },
            ],
            translateX: [
                { value: 0, duration: 1200 },
                { value: [boxheight, boxheight], duration: 300 },
            ],
            transformOrigin: [
                { value: ['50% 50%', '50% 50%'], duration: 700, easing: 'easeInCubic' },
                { value: ['0% 0%', '0% 0%'], duration: 300, easing: 'easeInCubic' },
                { value: ['0% 0%', '0% 0%'], duration: 200, easing: 'easeInCubic' },
                { value: ['0% 100%', '0% 100%'], duration: 300, easing: 'easeInCubic' },
            ],
            rotate: [
                { value: -90, duration: 700, easing: 'easeInCubic' },
                { value: [-90, -120], duration: 300, easing: 'easeOutCubic' },
                { value: [-120, -90], duration: 200, easing: 'easeInCubic' },
                { value: [-90, -80], duration: 200, easing: 'easeOutCubic' },
                { value: [-80, -90], duration: 200, easing: 'easeInCubic' },
            ],
            autoplay: true,
            begin: function () {
                shutDownAssignClasses('#box5');
            },
            complete: function () {
                box.state = 'down';
                document.querySelector(box.id).style.transformOrigin = '0% 100%';
            }

        });
    }
}

function shutDownAssignClasses(id) {
    document.querySelector(id + ' div').className = "overlay unactive";
    document.querySelector(id).children[1].className = "h2hov active";
    document.querySelector(id).children[2].className = "h2wow";
}

function riseUpAssignClasses(element_reference) {
    element_reference.children[0].className = "overlay";
    element_reference.children[1].className = "h2hov";
    element_reference.children[2].className = "h2wow active";
}