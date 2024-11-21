import Debug from "../Utils/Debug"
import DeviceOrientation from "../Utils/DeviceOrientation"
import Time from "../Utils/Time"

let instanceGlobalContext = null

export default class GlobalContext {
    constructor() {
        if (!!instanceGlobalContext) return instanceGlobalContext
        instanceGlobalContext = this

        this.sceneCollection = []

        window.addEventListener('resize', () => { this.resize() })
        window.addEventListener('scroll', () => { this.scroll() })
        
        this.time = new Time()
        this.time.on('update', () => { this.update() })

        /** debug */
        this.debug = new Debug()
    }

    set useDeviceOrientation(isOrientation) {
        if(isOrientation && !!!this.orientation) {
            this.orientation = new DeviceOrientation()
            this.orientation.on('reading', () => { this.onDeviceOrientation() })
        } 
        if(!isOrientation && !!this.orientation) { this.orientation.off('reading') }
    }

    onDeviceOrientation() {
        this.sceneCollection.forEach(s => { s.onDeviceOrientation() })
    }

    get window() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: Math.min(window.devicePixelRatio, 2)
        }
    }

    addScene(scene) {
        this.sceneCollection.push(scene)
    }

    resize() {
        this.sceneCollection.forEach(s => { s.resize() })
    }

    update() {
        this.sceneCollection.forEach(s => {
            if (s.domElement.isVisible) {
                s.update()
            }
        })
    }

    scroll() {
        this.sceneCollection.forEach(s => { s.scroll() })
    }

    destroy() {
        this.sceneCollection.forEach(s => { s.destroy() })
        window.removeEventListener('resize')
        window.removeEventListener('scroll')
        this.time.off('update')
        this.useDeviceOrientation = false
        if(!!this.debug.ui) this.debug.ui.destroy()
    }
}