import GlobalContext from "../GlobalContext"
import Scene2D from "../Scene2D"
import { degToRad, distance2D, randomRange } from "../Utils/MathUtils"

class Bubble {
    constructor(context, x, y, radius) {
        this.context = context
        this.x = x
        this.y = y
        this.radius = radius

        this.time = new GlobalContext().time

        /** speed */
        this.vx = randomRange(-200, 200)
        this.vy = randomRange(-200, 200)
    }

    draw() {
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, degToRad(360))
        this.context.fill()
        this.context.stroke()
        this.context.closePath()
    }

    update(width, height) {
        this.x += this.vx * this.time.delta / 1000
        this.y += this.vy * this.time.delta / 1000

        /** bounce */
        // if (this.x < 0 || this.x > width) this.vx *= -1
        // if (this.y < 0 || this.y > height) this.vy *= -1

        /** bounce corrected */
        this.vx = this.x < this.radius ? Math.abs(this.vx) : this.vx
        this.vx = this.x > width - this.radius ? -Math.abs(this.vx) : this.vx
        this.vy = this.y < this.radius ? Math.abs(this.vy) : this.vy
        this.vy = this.y > height - this.radius ? -Math.abs(this.vy) : this.vy
    }
}

export default class SceneBouncingBubbles extends Scene2D {
    constructor(id) {
        super(id)

        /** debug */
        this.params = {
            speed: 1, // positif ou negatif
            threshold: 50,
            radius: 5,
            nBubbles: 10
        }
        if (!!this.debugFolder) {
            this.debugFolder.add(this.params, "threshold", 0, 200)
            this.debugFolder.add(this.params, "radius", 0, 30, 0.1).name("Rayon").onChange(() => {
                if (!!this.bubbles) {
                    this.bubbles.forEach(b => { b.radius = this.params.radius })
                }
            })
            this.debugFolder.add(this.params, "nBubbles", 3, 50).onFinishChange(() => {
                this.generateBubbles()
            })
        }

        /** device orientation */
        this.globalContext.useDeviceOrientation = true
        this.orientation = this.globalContext.orientation

        /** init */
        this.generateBubbles()
        this.draw()
    }

    generateBubbles() {
        /** generate bubbles */
        this.bubbles = []
        for (let i = 0; i < this.params.nBubbles; i++) {
            const x_ = this.width * Math.random()
            const y_ = this.height * Math.random()
            const bubble_ = new Bubble(this.context, x_, y_, 5)
            this.bubbles.push(bubble_)
        }
    }

    draw() {
        /** style */
        this.context.strokeStyle = "white"
        this.context.fillStyle = "black"
        this.context.lineWidth = 2
        this.context.lineCap = "round"

        /** draw */
        if (!!this.bubbles) {
            for (let i = 0; i < this.bubbles.length; i++) {
                const current_ = this.bubbles[i]
                for (let j = i; j < this.bubbles.length; j++) {
                    const next_ = this.bubbles[j]

                    if (distance2D(current_.x, current_.y, next_.x, next_.y) < this.params.threshold) {
                        this.context.beginPath()
                        this.context.moveTo(current_.x, current_.y)
                        this.context.lineTo(next_.x, next_.y)
                        this.context.stroke()
                        this.context.closePath()
                    }
                }
            }

            this.bubbles.forEach(b => {
                b.draw()
            })
        }
    }

    update() {
        if (!!this.bubbles) {
            this.bubbles.forEach(b => {
                b.update(this.width, this.height)
            })
        }

        this.clear()
        this.draw()
    }

    resize() {
        super.resize()

        if (!!this.bubbles) {
            this.bubbles.forEach(b => {
                b.x = Math.max(0, Math.min(b.x, this.width))
                b.y = Math.max(0, Math.min(b.y, this.height))
            })
        }

        this.draw()
    }

    onDeviceOrientation() {
        // update the direction of the bubbles
        if (!!this.bubbles) {
            this.bubbles.forEach(b => {
                b.vx = this.orientation.gamma * this.params.speed
                b.vy = this.orientation.beta * this.params.speed
            })
        }

        this.debug.domDebug = ('alpha : ' + this.orientation.alpha.toFixed(2) + ' -|- beta : ' + this.orientation.beta.toFixed(2) + ' -|- gamma : ' + this.orientation.gamma.toFixed(2))
    }
}