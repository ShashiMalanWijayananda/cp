import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Extend Three.js with necessary components
extend({ 
  Mesh: THREE.Mesh,
  BoxGeometry: THREE.BoxGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  DirectionalLight: THREE.DirectionalLight,
  AmbientLight: THREE.AmbientLight,
  OrthographicCamera: THREE.OrthographicCamera,
  Group: THREE.Group,
  PerspectiveCamera: THREE.PerspectiveCamera,
  Vector3: THREE.Vector3,
  Euler: THREE.Euler,
  Raycaster: THREE.Raycaster,
  Vector2: THREE.Vector2
})
