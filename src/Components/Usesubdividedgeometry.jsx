import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Hook to subdivide any THREE.js geometry using simple midpoint subdivision
 * Perfect for use with gltfjsx extracted geometries
 * NO DEPENDENCIES REQUIRED - works out of the box!
 * 
 * @param {THREE.BufferGeometry} geometry - The geometry to subdivide
 * @param {number} subdivisions - Number of subdivision iterations (1-2 recommended for simple subdivision)
 * @returns {THREE.BufferGeometry} - The subdivided geometry
 */
export function useSubdividedGeometry(geometry, subdivisions = 2) {
  const subdividedGeometry = useMemo(() => {
    if (!geometry) {
      console.warn('No geometry provided to useSubdividedGeometry');
      return new THREE.BufferGeometry();
    }
    
    let result = geometry.clone();
    
    // Convert to non-indexed
    if (result.index) {
      result = result.toNonIndexed();
    }
    
    // Ensure normals
    if (!result.attributes.normal) {
      result.computeVertexNormals();
    }
    
    const originalTriangles = result.attributes.position.count / 3;
    
    // Apply midpoint subdivision
    for (let i = 0; i < subdivisions; i++) {
      result = subdivideGeometry(result);
    }
    
    const finalTriangles = result.attributes.position.count / 3;
    console.log(`Subdivided geometry: ${Math.floor(originalTriangles)} → ${Math.floor(finalTriangles)} triangles`);
    
    return result;
  }, [geometry, subdivisions]);
  
  return subdividedGeometry;
}

/**
 * OPTIONAL: Higher quality subdivision using Loop Subdivision
 * Requires: npm install three-stdlib
 * Only use if you need higher quality and have three-stdlib installed
 * 
 * @param {THREE.BufferGeometry} geometry - The geometry to subdivide
 * @param {number} subdivisions - Number of subdivision iterations (1-3 recommended)
 */
export function useLoopSubdividedGeometry(geometry, subdivisions = 2) {
  const subdividedGeometry = useMemo(() => {
    if (!geometry) {
      console.warn('No geometry provided to useLoopSubdividedGeometry');
      return new THREE.BufferGeometry();
    }
    
    // Import LoopSubdivision dynamically
    let LoopSubdivision;
    try {
      LoopSubdivision = require('three-stdlib').LoopSubdivision;
    } catch (e) {
      console.error('three-stdlib not installed. Run: npm install three-stdlib');
      console.log('Falling back to simple subdivision...');
      
      // Fallback to simple subdivision
      let result = geometry.clone();
      if (result.index) result = result.toNonIndexed();
      if (!result.attributes.normal) result.computeVertexNormals();
      for (let i = 0; i < subdivisions; i++) {
        result = subdivideGeometry(result);
      }
      return result;
    }
    
    const clonedGeometry = geometry.clone();
    
    if (!clonedGeometry.attributes.normal) {
      clonedGeometry.computeVertexNormals();
    }
    
    const modifier = new LoopSubdivision();
    const subdivided = modifier.modify(clonedGeometry, subdivisions);
    
    console.log(`Loop subdivided: ${geometry.attributes.position.count / 3} → ${subdivided.attributes.position.count / 3} triangles`);
    
    return subdivided;
  }, [geometry, subdivisions]);
  
  return subdividedGeometry;
}

/**
 * Simple midpoint subdivision
 */
function subdivideGeometry(geometry) {
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal?.array;
  const uvs = geometry.attributes.uv?.array;
  
  const newPositions = [];
  const newNormals = [];
  const newUVs = [];
  
  // Each triangle becomes 4 triangles
  for (let i = 0; i < positions.length; i += 9) {
    const v0 = [positions[i], positions[i + 1], positions[i + 2]];
    const v1 = [positions[i + 3], positions[i + 4], positions[i + 5]];
    const v2 = [positions[i + 6], positions[i + 7], positions[i + 8]];
    
    const m01 = [(v0[0] + v1[0]) / 2, (v0[1] + v1[1]) / 2, (v0[2] + v1[2]) / 2];
    const m12 = [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2];
    const m20 = [(v2[0] + v0[0]) / 2, (v2[1] + v0[1]) / 2, (v2[2] + v0[2]) / 2];
    
    newPositions.push(...v0, ...m01, ...m20);
    newPositions.push(...v1, ...m12, ...m01);
    newPositions.push(...v2, ...m20, ...m12);
    newPositions.push(...m01, ...m12, ...m20);
    
    if (normals) {
      const n0 = [normals[i], normals[i + 1], normals[i + 2]];
      const n1 = [normals[i + 3], normals[i + 4], normals[i + 5]];
      const n2 = [normals[i + 6], normals[i + 7], normals[i + 8]];
      
      const nm01 = [(n0[0] + n1[0]) / 2, (n0[1] + n1[1]) / 2, (n0[2] + n1[2]) / 2];
      const nm12 = [(n1[0] + n2[0]) / 2, (n1[1] + n2[1]) / 2, (n1[2] + n2[2]) / 2];
      const nm20 = [(n2[0] + n0[0]) / 2, (n2[1] + n0[1]) / 2, (n2[2] + n0[2]) / 2];
      
      newNormals.push(...n0, ...nm01, ...nm20);
      newNormals.push(...n1, ...nm12, ...nm01);
      newNormals.push(...n2, ...nm20, ...nm12);
      newNormals.push(...nm01, ...nm12, ...nm20);
    }
    
    if (uvs) {
      const uv0 = [uvs[(i / 3) * 2], uvs[(i / 3) * 2 + 1]];
      const uv1 = [uvs[(i / 3) * 2 + 2], uvs[(i / 3) * 2 + 3]];
      const uv2 = [uvs[(i / 3) * 2 + 4], uvs[(i / 3) * 2 + 5]];
      
      const uvm01 = [(uv0[0] + uv1[0]) / 2, (uv0[1] + uv1[1]) / 2];
      const uvm12 = [(uv1[0] + uv2[0]) / 2, (uv1[1] + uv2[1]) / 2];
      const uvm20 = [(uv2[0] + uv0[0]) / 2, (uv2[1] + uv0[1]) / 2];
      
      newUVs.push(...uv0, ...uvm01, ...uvm20);
      newUVs.push(...uv1, ...uvm12, ...uvm01);
      newUVs.push(...uv2, ...uvm20, ...uvm12);
      newUVs.push(...uvm01, ...uvm12, ...uvm20);
    }
  }
  
  const newGeometry = new THREE.BufferGeometry();
  newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
  
  if (newNormals.length > 0) {
    newGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
  } else {
    newGeometry.computeVertexNormals();
  }
  
  if (newUVs.length > 0) {
    newGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
  }
  
  return newGeometry;
}