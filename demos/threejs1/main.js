window.addEventListener('load', pageInit);

var container;
var camera, scene, renderer;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var boxes = [];
var currentlySelectedObject;
var triggerRaycastUpdate = false;
var alterLightPosition   = false;
var animExpandingContracting = false;

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
    window.positions = [
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
    window.light = new THREE.PointLight(0xffffff, 2, 1000);
    light.position.set(100, 100, 100);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x222222); // soft white light
    scene.add(ambient);

    scene.background = new THREE.Color(0x222222);


    window.addEventListener('keydown', function (e) {
        if (e.key == "k") {
            animateExpand();
        }   

        if (e.key == "l") {
            animateContract();            
        }


        if (e.key == "g") {
            window.removeEventListener('mousemove', onMouseMove, false);
            window.removeEventListener('click', onClick, false);

            animateSelected();
        }
    });



    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick);


    currentlySelectedObject = boxes[7].mesh;
    onClick();


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

    if(!alterLightPosition)
        light.position.set(camera.position.x * 0.5, camera.position.y * 0.5, camera.position.z * 0.5);

    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
}


















function onMouseMove(event) {
    if(expContrObj.status === 0) return;

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    triggerRaycastUpdate = true;


    var radius = Math.floor(innerWidth * 0.25);
    var x = event.clientX - innerWidth  / 2;
    var y = event.clientY - innerHeight / 2;

    var length = Math.sqrt(x*x + y*y);
    if(length < radius && (expContrObj.animstatus === 2 || 
                           expContrObj.animstatus === 0)) {
        animateExpand();
    }   

    if(length > radius && (expContrObj.animstatus === 1 || 
                           expContrObj.animstatus === 0)) {
        animateContract();
    }   
}

var lastSelectedObject = null;
function onClick(event) {
    if (currentlySelectedObject !== undefined) {

        if(currentlySelectedObject === lastSelectedObject) {
            // if( expContrObj.status === 1                       &&    // if expanded
            //     expContrObj.animstatus !== 3) {                      // and not currently rotating
            
            if( expContrObj.animstatus !== 3) {    // not currently rotating
                
                expContrObj.status = 0;
                animateSelected();

                // prevent the following animation to run
                return;
            }

            // if the selected object is the same as before, no need to reanimate
            return;
        } 
          
        expContrObj.animstatus = 3;

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
            complete: function() {
                expContrObj.animstatus = 0;        
            },
            update: function (anim) {
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
            }
         });


         lastSelectedObject = currentlySelectedObject;
    }
}








var expContrObj = {
    t: 0,
    extension: 1.1,
    rotation: 2,
    status: 2,          // 0 = animation completed  1 = expanded,  2 = contracted
    animstatus: 0       // 0 = idle,                1 = expanding, 2 = contracting, 3 = rotation animation when 
                        //                                                              the cursor clicks a box
};

function animateExpand() {
    var obj = expContrObj;
    expContrObj.animstatus = 1;

    anime.remove(obj);
    anime({
        targets: obj,
        t: 1,
        elasticity: 650,
        duration: 2500,
        complete: function() {
            expContrObj.animstatus = 0;
            obj.status = 1;
        },
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

function animateContract() {
    var obj = expContrObj;

    expContrObj.animstatus = 2;

    anime.remove(obj);
    anime({
        targets: obj,
        t: 0,
        easing: 'easeInOutCubic',
        duration: 400,
        complete: function() {
            expContrObj.animstatus = 0;
            
            obj.status = 2;            
        },
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

function animateSelected() {
    var obj2 = {
        origx: camera.position.x, 
        origy: camera.position.y, 
        origz: camera.position.z,
        t: 0,
        rotation: 2.2
    };

    anime.remove(expContrObj);
    anime({
        targets: obj2,
        t: [0, 1],
        easing: 'easeInOutCubic',
        duration: 800,
        begin: function() {
            alterLightPosition = true;
            // resetting the boxes color
            for (var i = 0; i < boxes.length; i++) {
                boxes[i].mesh.material.color.set(boxes[i].color);
            }
        },
        complete: function() {
            toggleAnimHeadings();
        },
        update: function (anim) {
            for (var i = 0, l = scene.children.length - 2; i < l; i++) {
                var t = Number(obj2.t);
                var rot = Number(obj2.rotation);

                var op = positions[i];

                var axis = new THREE.Vector3(op[0], op[1], op[2]).normalize();
                var quat1 = new THREE.Quaternion();
                //quat1.setFromAxisAngle(axis, t * rot);
                quat1.copy(scene.children[i].quaternion);


                // // camera's X Vector
                // var cameraX = new THREE.Vector3();
                // cameraX.set(
                //     camera.matrix.elements[0],
                //     camera.matrix.elements[1],
                //     camera.matrix.elements[2]
                // );
                
                // // camera matrix ha 3 assi, che hanno ruotato la scena, trova 
                // // l'anti rotazione della matrice che ruota la scena e dovresti trovare il modo di interpolare da lì
                // // forse usando quaternion.setFromRotationMatrix
                // var invMatrix = new THREE.Matrix4();
                // invMatrix.getInverse(camera.matrix);
                // invMatrix.elements[12] = 0;
                // invMatrix.elements[13] = 0;
                // invMatrix.elements[14] = 0;
                // invMatrix.elements[15] = 1;

                var rotMatrix = new THREE.Matrix4();
                rotMatrix.makeRotationZ(Math.PI / 4);

                var compound = new THREE.Matrix4();
                compound.copy(camera.matrix);

                compound.multiply(rotMatrix);

                var quat2 = new THREE.Quaternion();
                // I expected the inverse matrix to make it, but apparently the matrix itself will do it
                quat2.setFromRotationMatrix(compound);


                quat1.slerp(quat2, t);
                scene.children[i].quaternion.copy(quat1);

                


                /*
                
                    you should converge the camera closer to the OBJECT and not the center
                    you should converge the camera closer to the OBJECT and not the center
                    you should converge the camera closer to the OBJECT and not the center
                    you should converge the camera closer to the OBJECT and not the center

                
                 */



                // converging the camera closer to the center
                camera.position.x = obj2.origx * (1.0 - 0.62 * t);
                camera.position.y = obj2.origy * (1.0 - 0.62 * t);
                camera.position.z = obj2.origz * (1.0 - 0.62 * t);

                light.position.x = obj2.origx * 0.5 * (1.0 + 3.5 * t);
                light.position.y = obj2.origy * 0.5 * (1.0 + 3.5 * t);
                light.position.z = obj2.origz * 0.5 * (1.0 + 3.5 * t);
            }
        }
    });
}

function toggleAnimHeadings() {
    
}