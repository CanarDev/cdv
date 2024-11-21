import SceneGravityCubes from "./js/scenarios/GravityCubes/SceneGravityCubes"
import SceneBouncingBubbles from "./js/scenarios/SceneBouncingBubbles"
import GlobalContext from "./js/template/GlobalContext"
import { askMotionAccess } from "./js/Utils/DeviceAccess"

/** TODO */
/** TODO */
/*
    - SceneGravityCubes
        - Mur gauche (responsive)
        - Murs intermédiaires (responsive)
        - Fonction AddCube()
    - SceneBouncingBubbles
        - Fonction RemoveBubble()
        - Debug : paramètre speed (-1 <-> 1)
    - Main
        - Finir les correspondances
            scène 2 -> 3 (faite en cours)
            3 -> 2
            3 -> 1
            1 -> 3
            1 -> 2
            2 -> 1
*/
/** TODO */
/** TODO */

/** motion sensors authorization */
const btn = document.getElementById("btn-access")
btn.addEventListener("click", function () {
    askMotionAccess()
}, false)

/** scenes */
const scene1 = new SceneBouncingBubbles("canvas-scene-1")
const scene2 = new SceneGravityCubes("canvas-scene-2")
const scene3 = new SceneBouncingBubbles("canvas-scene-3")

/** main */
const globalContext = new GlobalContext()
const params = {
    test: 0
}
if (!!globalContext.debug.ui) {
    globalContext.debug.ui.add(params, "test", 0, 10)
}
const time = globalContext.time
const update = () => {
    /** exemple css */
    const scale_ = 1 + (Math.cos(5 * time.elapsed / 1000) / 2 + 0.5) / 20
    btn.style.transform = `scale(${scale_}, ${1})`

    /** bubbles + cube scan = is IN or OUT ? */
    const outScene2_down = scene2.cubes.filter(c => { return c.position.y < -scene2.height / 2 })

    /** remove entities (cube + bubble) OUT of their own scene */
    outScene2_down.forEach(cubeToRemove => { scene2.removeCube(cubeToRemove) })

    /** add new entities to corresponding scene, ex: bulle scene 1 -> cube scene 2 */
    outScene2_down.forEach(cubeToMove => {
        const newBubble_ = scene3.addBubble(cubeToMove.position.x + scene3.width / 2, 0)
        newBubble_.vy = Math.abs(newBubble_.vy)
    })
    
    /** exemple pour la suite */
    // outScene1_up.forEach(bulleToMove => {
    //     const newBubble_ = scene3.addBubble('TODO', 'TODO')
    //     newBubble_.vx = bulleToMove.vx // <---- transmission de la vitesse
    //     newBubble_.vy = bulleToMove.vy // <---- transmission de la vitesse
    // })
}
time.on("update", update)





/*
Hello, j'ai trouver comment utiliser le motion capteur en mode dev sans deploy sur vercel :

npm i -D @vitejs/plugin-basic-ssl

Puis modifier le vite.config.mjs :

import basicSsl from '@vitejs/plugin-basic-ssl'
export default {
    root: 'src',
    build: {
        outDir: '../dist'
    },
    plugins: [
        basicSsl()
    ]
}
*/