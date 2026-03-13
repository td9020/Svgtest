import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Brush, Evaluator, SUBTRACTION, ADDITION, INTERSECTION } from 'three-csg-ts';

const evaluator = new Evaluator();

const OPS = {
  subtract: SUBTRACTION,
  add: ADDITION,
  intersect: INTERSECTION,
};

export function useCSG(baseGeometry, toolGeometries, operation = 'subtract') {
  return useMemo(() => {
    if (!baseGeometry || !toolGeometries || toolGeometries.length === 0) return baseGeometry;

    let baseBrush = new Brush(baseGeometry);
    baseBrush.updateMatrixWorld();

    const op = OPS[operation] || SUBTRACTION;

    for (const toolGeo of toolGeometries) {
      const toolBrush = new Brush(toolGeo);
      toolBrush.updateMatrixWorld();
      try {
        baseBrush = evaluator.evaluate(baseBrush, toolBrush, op);
      } catch (e) {
        console.warn('CSG operation failed:', e);
      }
    }

    return baseBrush.geometry;
  }, [baseGeometry, toolGeometries, operation]);
}

export function useMultiCSG(baseGeometry, operations) {
  return useMemo(() => {
    if (!baseGeometry || !operations || operations.length === 0) return baseGeometry;

    let baseBrush = new Brush(baseGeometry);
    baseBrush.updateMatrixWorld();

    for (const { geometry, operation } of operations) {
      if (!geometry) continue;
      const toolBrush = new Brush(geometry);
      toolBrush.updateMatrixWorld();
      const op = OPS[operation] || SUBTRACTION;
      try {
        baseBrush = evaluator.evaluate(baseBrush, toolBrush, op);
      } catch (e) {
        console.warn('CSG operation failed:', e);
      }
    }

    return baseBrush.geometry;
  }, [baseGeometry, operations]);
}

export function CSGMesh({ baseGeometry, toolGeometries, operation = 'subtract', material, ...props }) {
  const resultGeometry = useCSG(baseGeometry, toolGeometries, operation);

  if (!resultGeometry) return null;

  return (
    <mesh geometry={resultGeometry} {...props}>
      {material || <meshStandardMaterial color="#cccccc" />}
    </mesh>
  );
}

export default CSGMesh;
