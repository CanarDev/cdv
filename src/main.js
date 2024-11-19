import SceneBouncingBubbles from "./js/scenarios/SceneBouncingBubbles"
import {askMotionAccess} from "./js/Utils/askMotionAccess";

const scene2d = new SceneBouncingBubbles("canvas-scene")
const scene2d2 = new SceneBouncingBubbles("canvas-scene2")


const btn = document.getElementById('btn-access')
btn.addEventListener('click', function() {
    askMotionAccess()
},false)