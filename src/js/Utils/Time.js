import EventEmitter from "./EventEmitter"

export default class Time extends EventEmitter {
    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 // time between 2 consecutive frames

        this.update()
    }

    update() {
        const current_ = Date.now()
        this.delta = current_ - this.current
        this.current = current_
        this.elapsed = this.current - this.start

        this.trigger('update')

        window.requestAnimationFrame(() => this.update())
    }
}