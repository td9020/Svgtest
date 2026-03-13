import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

function makeMesh(geometry, material, position, rotation, scale) {
  const mesh = new THREE.Mesh(
    geometry,
    material || new THREE.MeshStandardMaterial()
  );
  if (position) mesh.position.set(...position);
  if (rotation) mesh.rotation.set(...rotation);
  if (scale) mesh.scale.set(...scale);
  mesh.updateMatrix();
  mesh.updateMatrixWorld(true);
  return mesh;
}

export function useCSG(baseCfg, subtracts = [], additions = []) {
  return useMemo(() => {
    const baseMat = baseCfg.material || new THREE.MeshStandardMaterial({ color: '#cccccc' });
    let baseMesh = makeMesh(
      baseCfg.geometry,
      baseMat,
      baseCfg.position,
      baseCfg.rotation
    );

    for (const s of subtracts) {
      const toolMesh = makeMesh(
        s.geometry,
        s.material || new THREE.MeshStandardMaterial(),
        s.position,
        s.rotation,
        s.scale
      );
      try {
        baseMesh = CSG.subtract(baseMesh, toolMesh);
      } catch (e) {
        console.warn('CSG subtract failed:', e);
      }
    }

    for (const a of additions) {
      const toolMesh = makeMesh(
        a.geometry,
        a.material || baseMat,
        a.position,
        a.rotation,
        a.scale
      );
      try {
        baseMesh = CSG.union(baseMesh, toolMesh);
      } catch (e) {
        console.warn('CSG union failed:', e);
      }
    }

    return baseMesh.geometry;
  }, []);
}

export function useMultiCSG(operations) {
  return useMemo(() => {
    const results = [];
    for (const op of operations) {
      let baseMesh = makeMesh(
        op.base.geometry,
        op.base.material || new THREE.MeshStandardMaterial(),
        op.base.position,
        op.base.rotation
      );

      for (const s of (op.subtracts || [])) {
        const toolMesh = makeMesh(
          s.geometry,
          s.material || new THREE.MeshStandardMaterial(),
          s.position,
          s.rotation,
          s.scale
        );
        try {
          baseMesh = CSG.subtract(baseMesh, toolMesh);
        } catch (e) {
          console.warn('CSG subtract failed:', e);
        }
      }

      results.push(baseMesh.geometry);
    }
    return results;
  }, []);
}

export function CSGMesh({ geometry, material, ...props }) {
  return (
    <mesh geometry={geometry} {...props}>
      {material ? (
        <primitive object={material} attach="material" />
      ) : (
        <meshStandardMaterial color="#cccccc" />
      )}
    </mesh>
  );
}
