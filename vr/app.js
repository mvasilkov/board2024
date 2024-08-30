'use strict'

AFRAME.registerComponent('dakka', {
    init() {
        this.el.addEventListener('click', event => {
            const visible = this.el.getAttribute('visible')
            if (!visible) return

            // Bullet start position
            const origin = this.el.components.raycaster.data.origin
            const startPos = new THREE.Vector3(origin.x, origin.y, origin.z)
            this.el.object3D.localToWorld(startPos)

            // Bullet end position and distance
            const { point: endPos, distance } = event.detail.intersection

            // Bullet entity
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

            // Bullet hit
            bullet.addEventListener('animationcomplete', () => {
                bullet.parentNode.removeChild(bullet)
            })
        })
    },
})

AFRAME.registerComponent('unfuck-direction', {
    init() {
        const parent = this.el.parentNode

        const direction = new THREE.Vector3(-0.5, -1.6, -1).normalize()
        const origin = direction.clone().multiplyScalar(0.15)
        const offset = direction.clone().multiplyScalar(0.1)

        parent.setAttribute('raycaster', { direction, origin })

        this.el.object3D.position.copy(offset)
        this.el.object3D.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction)

        this._origin = origin
    },

    tick() {
        const parent = this.el.parentNode
        const parentOrigin = parent.components.raycaster.data.origin

        if (this._origin.equals(parentOrigin)) return

        parentOrigin.x = this._origin.x
        parentOrigin.y = this._origin.y
        parentOrigin.z = this._origin.z
    },
})
