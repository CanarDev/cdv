import { GUI } from "dat.gui"

export default class Debug {
    constructor() {
        this.ui = null
        this.active = window.location.hash === "#debug"
    }

    set active(isUI) {
        if(isUI && !!!this.ui) {
            this.ui = new GUI()
        }
    }

    set domDebug(content) {
        document.getElementById("debug").innerHTML = content
    }
}