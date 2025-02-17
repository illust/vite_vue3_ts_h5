import * as THREE from 'three'

export class createThreeScene {
  private readonly width: number
  private readonly height: number
  private readonly fov: number
  constructor(fov: number, width: number, height: number) {
    this.fov = fov
    this.width = width
    this.height = height
  }

  create() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(this.fov, this.width / this.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(this.width, this.height)
    renderer.setAnimationLoop(animate)
    document.body.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    function animate() {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }
  }
}
