import * as THREE from 'three'
import GlobalContext from "./GlobalContext"
import DomElement from "../Utils/DomElement"

export default class Scene3D extends THREE.Scene {
    constructor(id) {
        super()

        /** context (window) */
        this.globalContext = new GlobalContext()
        this.globalContext.addScene(this)

        /** debug */
        this.params = {}
        this.debug = this.globalContext.debug
        if (!!this.debug.ui) {
            this.debugFolder = this.debug.ui.addFolder(id)
        }

        /** dom element */
        this.domElement = new DomElement(id)
        this.canvas = this.domElement.element
        // this.context = this.canvas.getContext("3d")

        /** example */
        this.camera = new THREE.PerspectiveCamera( 75, this.domElement.aspectRatio, 0.1, 1000 )
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas, antialias: true
        })
        
        /** init */
        this.resize()
    }

    get width() { return this.domElement.width }
    get height() { return this.domElement.height }
    get position() { return this.domElement.position }

    resize() {
        this.domElement.setSize()

        /** resize camera */
        this.camera.aspect = this.domElement.aspectRatio
        this.camera.updateProjectionMatrix()

        /** resize renderer */
        this.renderer.setSize( this.width, this.height, false )
        this.renderer.setPixelRatio(this.globalContext.window.pixelRatio)
    }

    onDeviceOrientation() {}

    update() { 
        this.renderer.render( this, this.camera )
    }

    scroll() {
        this.domElement.setSize()
    }
    
    destroy() {
        this.traverse(child => {
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose()
                for(const key in child.material) {
                    const value_ = child.material[key]
                    if(value_ && typeof value_.dispose == 'function') {
                        value_.dispose()
                    }
                }
            }
        })
    }
}