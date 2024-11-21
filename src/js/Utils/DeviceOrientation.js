import EventEmitter from "./EventEmitter"

export default class DeviceOrientation extends EventEmitter {
    constructor() {
        super()

        /** coordinates */
        this.alpha = 0 // around z (0 to 360°)
        this.gamma = 0 // around y (-180 to 180°)
        this.beta = 0 // around x (-90 to 90)

        /** permission */
        if (navigator.permissions) {
            Promise.all(
                [navigator.permissions.query({ name: "accelerometer" }),
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" })])
                .then(results => {
                    if (results.every(
                        result => result.state === "granted")) {
                        this.init()
                    } else {
                        console.log("Permission to use sensor was denied.")
                    }
                }).catch(err => {
                    console.log("Integration with Permissions API is not enabled, still try to start app.")
                    this.init()
                })
        } else {
            console.log("No Permissions API, still try to start app.")
            this.init()
        }
    }

    init() {
        window.addEventListener("deviceorientation", (e) => {
            this.alpha = e.alpha
            this.beta = e.beta
            this.gamma = e.gamma

            this.trigger('reading')
        }, true)
    }
}