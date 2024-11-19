export const askMotionAccess = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                console.log("access sensors", permissionState)
                location.reload()
            }
        }).catch(console.error)
    }
}