'use strict'

AFRAME.registerComponent('dakka', {
    init() {
        this.el.addEventListener('click', event => {
            const startPos = new THREE.Vector3()
            this.el.object3D.getWorldPosition(startPos)

            const { point: endPos, distance } = event.detail.intersection

            const bullet = document.createElement('a-entity')
            bullet.setAttribute('geometry', {
                primitive: 'sphere',
                radius: 0.05,
            })
            bullet.setAttribute('material', {
                color: '#f00',
            })
            bullet.setAttribute('position', startPos)
            bullet.setAttribute('animation', {
                property: 'position',
                to: endPos,
                dur: 100 * distance,
                easing: 'linear',
            })
            this.el.sceneEl.appendChild(bullet)
        })
    },
})
