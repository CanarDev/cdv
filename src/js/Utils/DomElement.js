export default class DomElement {
    constructor(id) {
        this.id = id
        this.element = document.getElementById(id)
        this.setSize()
    }

    setSize() {
        const rect_ = this.element.getBoundingClientRect()
        this.width = rect_.width
        this.height = rect_.height
        this.position = {
            left: rect_.left,
            top: rect_.top,
            right: rect_.right,
            bottom: rect_.bottom
        }
    }

    get isVisible() {
        let isVisible_ = true
        if (this.position.bottom < 0 || this.position.top > window.innerHeight ||
            this.position.right < 0 || this.position.left > window.innerWidth) {
            isVisible_ = false
        }
        return isVisible_
    }

    get aspectRatio() {
        let ratio_ = 1
        if(!!this.width && !!this.height) ratio_ = this.width / this.height
        return ratio_
    }
}