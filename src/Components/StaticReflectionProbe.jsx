// StaticReflectionProbe.jsx
import { CubeCamera } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export function StaticReflectionProbe({
  onReady,
  position = [0, 5, 0],
  resolution = 256,
}) {
  const captured = useRef(false)

  return (
    <CubeCamera
      resolution={resolution}
      frames={1}
      position={position}
      onUpdate={(texture) => {
        // Wait a tick to ensure full render
        if (!captured.current) {
          captured.current = true
          if (texture && texture.isWebGLCubeRenderTarget && onReady) {
            onReady(texture.texture) // use the cube texture
            console.log('✅ Static reflection cube captured.')
          }
        }
      }}
    >
      {() => null}
    </CubeCamera>
  )
}
