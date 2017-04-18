window.addEventListener('load', pageInit);

var container;
var camera, scene, renderer;

function pageInit() {

    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 4500);
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 200;
    window.controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new THREE.Scene();


    var size = 50;
    var hsize = size / 2;
    var positions = [
        [-hsize, -hsize, -hsize],
        [+hsize, -hsize, -hsize],
        [-hsize, +hsize, -hsize],
        [+hsize, +hsize, -hsize],


        [-hsize, -hsize, +hsize],
        [+hsize, -hsize, +hsize],
        [-hsize, +hsize, +hsize],
        [+hsize, +hsize, +hsize],
    ];


    for (var i = 0; i < positions.length; i++) {
        var geometry = new THREE.BoxGeometry(size, size, size);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) }));
        mesh.position.set(positions[i][0], positions[i][1], positions[i][2]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }



    // adding light as the last object of this scene
    var light = new THREE.PointLight(0xffffff, 2, 1000);
    light.position.set(100, 100, 100);
    light.castShadow = true;
    light.shadow.mapSize.width  = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    var ambient = new THREE.AmbientLight( 0x222222 ); // soft white light
    scene.add( ambient );

    scene.background = new THREE.Color( 0x222222 );

    var obj = {
        t: 0,
        extension: 1.3,
        rotation: 0.06
    };


    window.addEventListener('keydown', function (e) {
        if (e.key == "k") {
            anime.remove(obj);
            anime({
                targets: obj,
                t: 1,
                elasticity: 650,
                duration: 10500,
                update: function (anim) {
                    for(var i = 0, l = scene.children.length - 2; i < l; i++) {
                        var t = obj.t;
                        
                        var op = positions[i];
                        scene.children[i].position.set(op[0] + op[0] * t * obj.extension,
                                                       op[1] + op[1] * t * obj.extension,
                                                       op[2] + op[2] * t * obj.extension);

                        // scene.children[i].rotation.x = t * op[0] * obj.rotation;
                        // scene.children[i].rotation.y = t * op[1] * obj.rotation;
                        // scene.children[i].rotation.z = t * op[2] * obj.rotation;   
                                             
                        scene.children[i].setRotationFromAxisAngle(new THREE.Vector3(1,0,0), obj.t * 20 * obj.rotation);
                    }
                }
            });
        }

        if (e.key == "l") {
            anime.remove(obj);            
            anime({
                targets: obj,
                t: 0,
                easing: 'easeInOutCubic',
                duration: 400,
                update: function (anim) {
                    for(var i = 0, l = scene.children.length - 2; i < l; i++) {
                        var t = obj.t;
                        
                        var op = positions[i];
                        scene.children[i].position.set(op[0] + op[0] * t * obj.extension,
                                                       op[1] + op[1] * t * obj.extension,
                                                       op[2] + op[2] * t * obj.extension);

                        scene.children[i].rotation.x = t * op[0] * obj.rotation;
                        scene.children[i].rotation.y = t * op[1] * obj.rotation;
                        scene.children[i].rotation.z = t * op[2] * obj.rotation;
                    }
                }
            });
        }
    });


    animate(0);
}

function animate(now) {
    requestAnimationFrame(animate);

    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
}