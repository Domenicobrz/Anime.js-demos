window.addEventListener('load', pageInit);

function pageInit() {

    var box1 = document.querySelector('#box1');
    window.bottomrect = box1.getBoundingClientRect().bottom;
    window.distanceToBottom = window.innerHeight - bottomrect;
    window.boxheight = box1.clientHeight;






    // now we need state control, in particular:

    
    // going down    
    // down
    // going up
    // up











    window.addEventListener('keydown', function (e) {
        // if (e.key == 'm') {
        //     for (var i = 0; i < 5; i++) {
        //         boxHovered("#box" + (i + 1));
        //     }
        // }

        if (e.key == 'k') {
            shutBoxDown(0);
        }

        if (e.key == 'i') {
            shutBoxDown(1);
        }

        if (e.key == 'p') {
            shutBoxDown(2);
        }

        if (e.key == 'u') {
            shutBoxDown(4);
        }

        if (e.key == 'o') {
            shutBoxDown(3);
        }
    });



    // triggering box fall
    // setTimeout(
    //     function triggerBoxesOnStart() {
    //         for (var i = 0; i < 5; i++) {
    //             shutBoxDown(i);
    //         }
    //     },
    //     1000);


    // registering hover events
    var boxes = document.querySelectorAll('nav > div');
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener('mouseenter', boxHovered);
        boxes[i].addEventListener('mouseleave', boxUnhovered);
    }
}

function boxUnhovered(e) {
    for(var i = 0; i < 5; i++) {
        var id = 'box' + (i+1);
        if(e.currentTarget.id === id) {
            shutBoxDown(i);
        }
    }
}

function boxHovered(e) {

    anime.remove(e.currentTarget);
    anime({
        targets: e.currentTarget,
        translateY: 0,
        translateX: 0,
        scale: 1.2,
        transformOrigin: { value: '50% 50%' },
        rotate: -30,
        autoplay: true,
        duration: 2000
    });

    for(var i = 0; i < 5; i++) {
        var id = 'box' + (i+1);
        if(e.currentTarget.id !== id) {
            shutBoxDown(i);
        }
    }
}

function shutBoxDown(index) {
    if (index === 0) {
        anime.remove('#box1');
        // where's the end of the screen?

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
            duration: 2000
        });
    }

    if (index === 1) {
        anime.remove('#box2');
        // where's the end of the screen?

        anime({
            targets: ['#box2'],
            translateY: [
                { value: distanceToBottom, duration: 600, easing: 'easeInCubic' },
                { value: distanceToBottom, duration: 600, easing: 'easeInCubic' },
            ],
            transformOrigin: [
                '0% 100%', '0% 100%'
            ],
            rotate: [
                { value: 0, duration: 600, easing: 'easeOutCubic' },
                { value: -30, duration: 500, easing: 'easeOutCubic' },
                { value: 0, duration: 300, easing: 'easeInCubic' },
                { value: -10, duration: 150, easing: 'easeOutCubic' },
                { value: 0, duration: 150, easing: 'easeInCubic' },
            ],
            autoplay: true,
            duration: 2000
        });
    }

    if (index === 2) {
        anime.remove('#box3');
        // where's the end of the screen?

        anime({
            targets: ['#box3'],
            translateY: [
                { value: -boxheight * 0.5, duration: 300, easing: 'easeOutCubic' },
                { value: distanceToBottom, duration: 600, easing: 'easeInCubic' },
            ],
            rotate: [
                { value: -270, duration: 900, easing: 'easeOutCubic' }
            ],
            autoplay: true
        });
    }

    if (index === 3) {
        anime.remove('#box4');
        // where's the end of the screen?

        anime({
            targets: ['#box4'],
            translateY: [
                { value: distanceToBottom - boxheight, duration: 600, delay: 600, easing: 'easeInCubic' }
            ],
            transformOrigin: [
                { value: '0% 100%', duration: 0, easing: 'easeInCubic' },
                { value: '0% 100%', duration: 300, easing: 'easeOutCubic' }
            ],
            rotate: [
                { value: 90, duration: 2600, elasticity: 600 },
            ],
            autoplay: true,
            duration: 2000
        });
    }

    if (index === 4) {
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
                { value: '50% 50%', duration: 700, easing: 'easeInCubic' },
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
            duration: 700
        });
    }
}