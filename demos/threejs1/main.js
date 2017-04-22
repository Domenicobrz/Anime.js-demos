window.addEventListener('load', pageInit);

var container;
var camera, scene, renderer;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var boxes = [];
var currentlySelectedObject;
var triggerRaycastUpdate = false;


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
    var cameraVec = (new THREE.Vector3(1, 1, 1)).normalize();
    // camera.position.x = cameraVec.x * 350;
    // camera.position.y = cameraVec.y * 350;
    // camera.position.z = cameraVec.z * 350;
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.position.z = 350;
    window.controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene = new THREE.Scene();


    var size = 50;
    var hsize = size / 1.8;
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
        var r = Math.random();
        var gb = Math.random() * 0.3;
        r = r < gb ? gb : r;

        var geometry = new THREE.BoxGeometry(size, size, size);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: new THREE.Color(r, gb, gb), transparent: true, opacity: 1 }));
        mesh.position.set(positions[i][0], positions[i][1], positions[i][2]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        boxes.push({ mesh: mesh, position: positions[i], sceneIndex: scene.children.length - 1, color: new THREE.Color(r, gb, gb) });
    }




    // adding light as the last object of this scene
    var light = new THREE.PointLight(0xffffff, 2, 1000);
    light.position.set(100, 100, 100);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x222222); // soft white light
    scene.add(ambient);

    scene.background = new THREE.Color(0x222222);

    var obj = {
        t: 0,
        extension: 1.1,
        rotation: 2
    };

    window.addEventListener('keydown', function (e) {
        if (e.key == "k") {
            anime.remove(obj);
            anime({
                targets: obj,
                t: 1,
                elasticity: 650,
                duration: 2500,
                update: function (anim) {
                    for (var i = 0, l = scene.children.length - 2; i < l; i++) {
                        var t = obj.t;

                        var op = positions[i];
                        scene.children[i].position.set(op[0] + op[0] * t * obj.extension,
                            op[1] + op[1] * t * obj.extension,
                            op[2] + op[2] * t * obj.extension);

                        var axis = new THREE.Vector3(op[0], op[1], op[2]).normalize();
                        scene.children[i].setRotationFromAxisAngle(axis, obj.t * obj.rotation);
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
                    for (var i = 0, l = scene.children.length - 2; i < l; i++) {
                        var t = obj.t;

                        var op = positions[i];
                        scene.children[i].position.set(op[0] + op[0] * t * obj.extension,
                            op[1] + op[1] * t * obj.extension,
                            op[2] + op[2] * t * obj.extension);

                        var axis = new THREE.Vector3(op[0], op[1], op[2]).normalize();
                        scene.children[i].setRotationFromAxisAngle(axis, obj.t * obj.rotation);
                    }
                }
            });
        }
    });



    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick);

    animate(0);
}


function animate(now) {
    requestAnimationFrame(animate);



    if (triggerRaycastUpdate) {
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children);

        for (var i = 0; i < boxes.length; i++) {
            boxes[i].mesh.material.color.set(boxes[i].color);
        }

        currentlySelectedObject = undefined;
        for (var i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xffffff);
            currentlySelectedObject = intersects[i].object;
            break;
        }

        triggerRaycastUpdate = false;
    }




    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
}


















function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    triggerRaycastUpdate = true;
}

function onClick(event) {

    if (currentlySelectedObject !== undefined) {

        var objPosNorm = new THREE.Vector3();
        objPosNorm.copy(currentlySelectedObject.position);
        objPosNorm.normalize();

        var cameraPosNorm = new THREE.Vector3();
        cameraPosNorm.copy(camera.position);
        cameraPosNorm.normalize();


        var cross = new THREE.Vector3();
        cross.copy(objPosNorm);
        cross.cross(cameraPosNorm);
        cross.normalize();

        var radians = Math.acos(objPosNorm.dot(cameraPosNorm));

        
        // var quat1 = new THREE.Quaternion();
        // quat1.set( objPosNorm.x, objPosNorm.y, objPosNorm.z, 0 );
        // var quat2 = new THREE.Quaternion();
        // quat2.set( cameraPosNorm.x, cameraPosNorm.y, cameraPosNorm.z, 0 );

        var dummyquat = new THREE.Quaternion();
        var dummyvec  = new THREE.Vector3();
        var dummyvec2  = new THREE.Vector3();
        var oldCameraPosition = new THREE.Vector3();
        oldCameraPosition.copy(camera.position);
        var oldCameraUp = new THREE.Vector3();
        oldCameraUp.copy(camera.up);

        var obj = { t: 0 };
        anime({
            targets: obj,
            t: 1,
            easing: 'easeInOutCubic',
            duration: 800,
            update: function (anim) {
                // dummyquat.copy(quat1);
                // dummyquat.slerp(quat2, obj.t);
                dummyquat.setFromAxisAngle(cross, -obj.t * radians);

                dummyvec.copy(oldCameraPosition);
                dummyvec.normalize();
                dummyvec.applyQuaternion(dummyquat);
                dummyvec.normalize();

                dummyvec2.copy(oldCameraUp);
                dummyvec2.normalize();
                dummyvec2.applyQuaternion(dummyquat);
                dummyvec2.normalize();
                

                // var vec1 = new THREE.Vector3(-dummyvec.x, -dummyvec.y, -dummyvec.z);
                // var vec2 = new THREE.Vector3(1, 0, 0);
                // vec2.cross(vec1);
                // vec2.normalize();
                // camera.up.copy(vec2);

                camera.position.x = dummyvec.x * 350;
                camera.position.y = dummyvec.y * 350;
                camera.position.z = dummyvec.z * 350;
                camera.up.copy(dummyvec2);

                // camera.position.x = dummyquat.x * 350;
                // camera.position.y = dummyquat.y * 350;
                // camera.position.z = dummyquat.z * 350;
            }
         });


        // var y = 0;
        // var vec = new THREE.Vector3();
        // vec.copy(scene.children[3].position);
        // console.log(vec);

        // var lookAtVector = new THREE.Vector3(camera.matrix.elements[8], camera.matrix.elements[9], camera.matrix.elements[10]);
        // lookAtVector.normalize();

        // var cameraX = new THREE.Vector3(camera.matrix.elements[0], camera.matrix.elements[1], camera.matrix.elements[2]);
        // cameraX.normalize();

        // var cameray = new THREE.Vector3(camera.matrix.elements[4], camera.matrix.elements[5], camera.matrix.elements[6]);
        // cameray.normalize();

        // scene.children[3].position.add(cameraX);
    }
}