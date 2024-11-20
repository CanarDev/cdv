import Scene3D from "../Scene3D";
import * as THREE from "three";
import {OrthographicCamera} from "three";
import {Bodies, Engine, Runner, Composite, Body} from "matter-js";
import {randomRange} from "../Utils/MathUtils";

const THICKNESS = 15;

class GravityCube extends THREE.Mesh {
    constructor(size, color) {
        /** Three geometry */
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({color: color});
        super(geometry, material);

        /** Matter.js */
        this.body = Bodies.rectangle(0, 0, size, size);
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        Body.setPosition(this.body, {x: x, y: -y});
    }

    update() {
        this.position.x = this.body.position.x;
        this.position.y = -this.body.position.y;
        this.rotation.z = -this.body.angle;

    }
}

class Wall extends THREE.Mesh {
    #width;
    #height;

    constructor(color) {
        /** Three geometry */
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: color});
        super(geometry, material);

        this.#width = 1;
        this.#height = 1;

        /** Matter.js */
        this.body = Bodies.rectangle(0, 0, 1, 1, {isStatic: true});
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        Body.setPosition(this.body, {x: x, y: -y});
    }

    setSize(width, height) {

        // three
        this.scale.set(width, height, 1);

        // matter.js
        Body.scale(this.body, 1 / this.#width, 1 / this.#height);
        Body.scale(this.body, width, height);
        this.#width = width;
        this.#height = height;
    }

    update() {
        this.position.x = this.body.position.x;
        this.position.y = -this.body.position.y;
    }
}

export default class SceneGravityCubes extends Scene3D {
    constructor(id) {
        super(id);

        this.camera = new OrthographicCamera(
            -this.width / 2, this.width / 2, this.height / 2, -this.height / 2,
            0.1, 2000);

        /** Walls */
        // botton
        this.wallBottom = new Wall('lightgreen');
        this.add(this.wallBottom);

        // right
        this.wallRight = new Wall('blue');
        this.add(this.wallRight);

        // left
        this.wallLeft = new Wall('blue');
        this.add(this.wallLeft);

        /** Gravity cube */
        this.cubes = [];
        for (let i = 0; i < 10; i++) {
            const cube_ = new GravityCube(50, 'lightblue');
            const x_ = randomRange(-this.width / 2, this.width / 2);
            const y_ = randomRange(-this.height / 2, this.height / 2);
            cube_.setPosition(x_, y_);
            this.add(cube_);
            this.cubes.push(cube_);
        }

        this.camera.position.z = 1000;


        this.engine = Engine.create({
            render: {
                visible: false
            }
        })

        this.bodies = [
            ...this.cubes.map(c => c.body),
            this.wallBottom.body,
            this.wallRight.body,
            this.wallLeft.body
        ];

        Composite.add(this.engine.world, this.bodies);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);


        this.resize();
    }

    update() {
        this.cubes.map(c => c.update());

        this.wallBottom.update();
        this.wallRight.update();
        this.wallLeft.update();

        this.wallBottom.setPosition(0, -this.height / 2);
        this.wallRight.setPosition(this.width / 2, 0);
        this.wallLeft.setPosition(-this.width / 2, 0);




        super.update()
    }

    scroll() {
        // this.cube.rotation.x += 0.01
    }

    resize() {
        super.resize();

        this.camera.left = -this.width / 2;
        this.camera.right = this.width / 2;
        this.camera.top = this.height / 2;
        this.camera.bottom = -this.height / 2;

        if (!!this.wallBottom && !!this.wallRight && !!this.wallLeft) {
            this.wallBottom.setSize(this.width / 1.5, THICKNESS);
            this.wallRight.setSize(THICKNESS, this.height);
            this.wallLeft.setSize(THICKNESS, this.height);
        }

    }
}