let scene,
    camera,
    renderer,
    clock,
    deltaTime,
    light,
    particleSystem,
    rocket

let width,
    height;

let keyboard = {};



const init = () => {
    window.addEventListener('resize', onResize, false);

    clock = new THREE.Clock(true);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    width = window.innerWidth;
    height = window.innerHeight;

    renderer.setSize(width, height);

    document.getElementById('map').appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 100;

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    particleSystem = createParticleSystem();
    scene.add(particleSystem);


    const mtlLoader = new THREE.MTLLoader();

    mtlLoader.load('./assets/obj/rocket-launcher.mtl', (mat) => {
        mat.preload();
        const objLoader = new THREE.OBJLoader();

        objLoader.setMaterials(mat);
        objLoader.load('./assets/obj/rocket-launcher.obj', (mesh) => {
            rocket = new THREE.Object3D();

            const pilot = new THREE.Mesh(
                new THREE.CircleGeometry(5, 32),
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load('./assets/img/oreo.png')
                })
            );
            pilot.position.y = 15;
            pilot.position.x = -5;
            mesh.scale.set(10, 10, 10);
            mesh.rotation.z = Math.PI / 2;
            mesh.rotation.y = Math.PI;
            rocket.add(pilot);
            rocket.add(mesh);
            scene.add(rocket);
        });
    });


    // createRocket();
    animate();

};

const forward = () => {
    if (rocket.rotation.z !== 0) {
        requestAnimationFrame(forward);
        if (rocket.rotation.z > 0) {
            rocket.rotation.z -= Math.PI / 16;
        }

        if (rocket.rotation.z < 0) {
            rocket.rotation.z += Math.PI / 16;
        }
    }

};

const animate = () => {
    deltaTime = clock.getDelta();

    // control rocket

    if (keyboard[38]) { //up key
        rocket.rotation.z = Math.PI / 4;
        rocket.position.y += 1;
        forward();
    }

    if (keyboard[40]) { //down key
        rocket.rotation.z = -Math.PI / 4;
        rocket.position.y -= 1;
        forward();
    }

    if (keyboard[37]) { //left key
        rocket.position.x -= 1;
    }

    if (keyboard[39]) { //right key
        rocket.position.x += 1;
    }

    animateParticles();
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
};

const createParticleSystem = () => {
    const particleCount = 2000;
    const particles = new THREE.Geometry();

    for (let i = 0; i < particleCount; i++) {
        let x = Math.random() * 400 - 200;
        let y = Math.random() * 400 - 200;
        let z = Math.random() * 400 - 400;

        let particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
    }

    const particlesMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 4,
        map: new THREE.TextureLoader().load('./assets/img/star.png'),
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    particleSystem = new THREE.Points(particles, particlesMat);
    return particleSystem;
};

const animateParticles = () => {
    const verts = particleSystem.geometry.vertices;
    for (let i in verts) {
        let vert = verts[i];
        if (vert.x < -250) {
            vert.y = Math.random() * 400 - 200;
            vert.x = 200;
        }
        vert.x = vert.x - (10 * deltaTime);
        particleSystem.geometry.verticesNeedUpdate = true;
    }
    // particleSystem.rotation.z -= .1 * deltaTime;
};

const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
};
//
// const Rocket = function() {
//     this.mesh = new THREE.Object3D();
//
//     const headGeom = new THREE.CylinderGeometry(0, 5, 10, 500);
//     const headMat = new THREE.MeshPhongMaterial({
//         color: 0xff5511,
//         shading: THREE.FlatShading
//     });
//     const head = new THREE.Mesh(headGeom, headMat);
//     head.position.x = 15;
//     head.rotation.z = -Math.PI / 2;
//     head.castShadow = true;
//     head.receiveShadow = true;
//     this.mesh.add(head);
//
//     const bodyGeom = new THREE.CylinderGeometry(5, 5, 20, 500);
//     const bodyMat = new THREE.MeshPhongMaterial({
//         color: 0xffffff,
//         shading: THREE.FlatShading
//     });
//     const body = new THREE.Mesh(bodyGeom, bodyMat);
//     body.rotation.z = -Math.PI / 2;
//     body.castShadow = true;
//     body.receiveShadow = true;
//     this.mesh.add(body);
//
//     const propellerGeom = new THREE.CylinderGeometry(5, 3, 4, 500);
//     const propellerMat = new THREE.MeshPhongMaterial({
//         color: 0xdddddd,
//         shading: THREE.FlatShading
//     });
//     const propeller = new THREE.Mesh(propellerGeom, propellerMat);
//     propeller.position.x = -10;
//     propeller.rotation.z = -Math.PI / 2;
//     propeller.castShadow = true;
//     propeller.receiveShadow = true;
//     this.mesh.add(propeller);
//
//
//
// };

const createRocket = () => {
    // rocket = new Rocket();
    // rocket.mesh.position.x = -10;
    // scene.add(rocket.mesh)
};

const keyDown = (e) => {
    keyboard[e.keyCode] = true;
};

const keyUp = (e) => {
    keyboard[e.keyCode] = false;
};


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init();