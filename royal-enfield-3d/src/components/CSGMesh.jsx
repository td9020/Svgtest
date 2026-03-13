import { useMemo } from 'react'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'

/**
 * CSG operations: subtract, union, intersect
 * Takes Two Three.js geometries and produces a boolean result.
 */
export function useCSG({
  geometryA,
  geometryB,
  transformB = {},
  operation = 'subtract',
}) {
  return useMemo(() => {
    const matA = new THREE.MeshStandardMaterial()
    const matB = new THREE.MeshStandardMaterial()

    const meshA = new THREE.Mesh(geometryA, matA)
    const meshB = new THREE.Mesh(geometryB, matB)

    if (transformB.position) {
      meshB.position.set(...transformB.position)
    }
    if (transformB.rotation) {
      meshB.rotation.set(...transformB.rotation)
    }
    if (transformB.scale) {
      meshB.scale.set(...transformB.scale)
    }
    meshB.updateMatrix()

    let result
    switch (operation) {
      case 'subtract':
        result = CSG.subtract(meshA, meshB)
        break
      case 'union':
        result = CSG.union(meshA, meshB)
        break
      case 'intersect':
        result = CSG.intersect(meshA, meshB)
        break
      default:
        result = meshA
    }

    matA.dispose()
    matB.dispose()

    return result.geometry
  }, [geometryA, geometryB, transformB, operation])
}

/**
 * Perform multiple CSG operations in sequence.
 * operations: [{ geometry, transform, type: 'subtract'|'union'|'intersect' }]
 */
export function useMultiCSG(baseGeometry, operations) {
  return useMemo(() => {
    const baseMat = new THREE.MeshStandardMaterial()
    let current = new THREE.Mesh(baseGeometry, baseMat)

    for (const op of operations) {
      const opMat = new THREE.MeshStandardMaterial()
      const opMesh = new THREE.Mesh(op.geometry, opMat)

      if (op.transform?.position) opMesh.position.set(...op.transform.position)
      if (op.transform?.rotation) opMesh.rotation.set(...op.transform.rotation)
      if (op.transform?.scale) opMesh.scale.set(...op.transform.scale)
      opMesh.updateMatrix()

      switch (op.type || 'subtract') {
        case 'subtract':
          current = CSG.subtract(current, opMesh)
          break
        case 'union':
          current = CSG.union(current, opMesh)
          break
        case 'intersect':
          current = CSG.intersect(current, opMesh)
          break
      }
      opMat.dispose()
    }

    baseMat.dispose()
    return current.geometry
  }, [baseGeometry, operations])
}
