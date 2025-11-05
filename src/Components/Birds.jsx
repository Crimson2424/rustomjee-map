import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

const WIDTH = 3                    // 3×3 = 9 birds 🐦
const BIRDS = WIDTH * WIDTH
const BOUNDS = 800
const BOUNDS_HALF = BOUNDS / 2

// ==================== SHADERS =====================

const fragmentShaderPosition = `
uniform float time;
uniform float delta;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D( texturePosition, uv );
  vec3 position = tmpPos.xyz;
  vec3 velocity = texture2D( textureVelocity, uv ).xyz;
  float phase = tmpPos.w;
  phase = mod( ( phase + delta + length( velocity.xz ) * delta * 3. + max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );
  gl_FragColor = vec4( position + velocity * delta * 15. , phase );
}
`

const fragmentShaderVelocity = `
uniform float time;
uniform float delta;
uniform float separationDistance;
uniform float alignmentDistance;
uniform float cohesionDistance;
uniform float freedomFactor;
uniform vec3 predator;
uniform vec3 target;

const float width = resolution.x;
const float height = resolution.y;
const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;

float zoneRadius = 40.0;
float zoneRadiusSquared = 1600.0;

const float UPPER_BOUNDS = BOUNDS;
const float SPEED_LIMIT = 5.0;   // slower for smaller flock

void main() {
  zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
  zoneRadiusSquared = zoneRadius * zoneRadius;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
  vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;
  vec3 velocity = selfVelocity;

  // 🐭 Predator avoidance
  vec3 dir = predator * UPPER_BOUNDS - selfPosition;
  dir.z = 0.;
  float dist = length(dir);
  float distSq = dist * dist;
  float preyRadius = 150.0;
  float preyRadiusSq = preyRadius * preyRadius;
  if (dist < preyRadius) {
    float f = (distSq / preyRadiusSq - 1.0) * delta * 100.0;
    velocity += normalize(dir) * f;
  }

  // ==================== GROUP FLOCKING ====================
  vec3 flockCenter = vec3(0.0);
  vec3 avgVelocity = vec3(0.0);
  float neighborCount = 0.0;

  for (float y = 0.0; y < height; y++) {
    for (float x = 0.0; x < width; x++) {
      vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
      vec3 otherPos = texture2D(texturePosition, ref).xyz;
      vec3 otherVel = texture2D(textureVelocity, ref).xyz;
      float d = distance(selfPosition, otherPos);
      if (d < zoneRadius) {
        flockCenter += otherPos;
        avgVelocity += otherVel;
        neighborCount += 1.0;
      }
    }
  }

  if (neighborCount > 0.0) {
    flockCenter /= neighborCount;
    avgVelocity /= neighborCount;
    // 🧭 Steer toward flock center
    velocity += normalize(flockCenter - selfPosition) * delta * 1.2;
    // 🪶 Align with group direction
    velocity += normalize(avgVelocity) * delta * 1.5;
  }

  // 🧭 Steer toward target
  vec3 toTarget = target - selfPosition;
  velocity += normalize(toTarget) * delta * 1.0;

  // ✂️ Limit speed
  float speed = length(velocity);
  if (speed > SPEED_LIMIT) velocity = normalize(velocity) * SPEED_LIMIT;

  gl_FragColor = vec4(velocity, 1.0);
}
`

const birdVertexShader = `
attribute vec2 reference;
attribute float birdVertex;
attribute vec3 birdColor;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
varying vec4 vColor;
varying float z;
uniform float time;
void main() {
  vec4 tmpPos = texture2D( texturePosition, reference );
  vec3 pos = tmpPos.xyz;
  vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);
  vec3 newPosition = position;
  if ( birdVertex == 4.0 || birdVertex == 7.0 ) {
    newPosition.y = sin( tmpPos.w ) * 2.5; // gentler flap
  }
  newPosition = mat3( modelMatrix ) * newPosition;
  velocity.z *= -1.;
  float xz = length( velocity.xz );
  float x = sqrt( 1. - velocity.y * velocity.y );
  float cosry = velocity.x / xz;
  float sinry = velocity.z / xz;
  float cosrz = x;
  float sinrz = velocity.y;
  mat3 maty =  mat3(
    cosry, 0, -sinry,
    0    , 1, 0     ,
    sinry, 0, cosry
  );
  mat3 matz =  mat3(
    cosrz , sinrz, 0,
    -sinrz, cosrz, 0,
    0     , 0    , 1
  );
  newPosition =  maty * matz * newPosition;
  newPosition += pos;
  z = newPosition.z;
  vColor = vec4( birdColor, 1.0 );
  gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );
}
`

const birdFragmentShader = `
varying vec4 vColor;
varying float z;
uniform vec3 color;
void main() {
  float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;
  gl_FragColor = vec4( z2, z2, z2, 1. );
}
`

// ==================== GEOMETRY =====================

function BirdGeometry() {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const trianglesPerBird = 3
    const triangles = BIRDS * trianglesPerBird
    const points = triangles * 3

    const vertices = new Float32Array(points * 3)
    const colors = new Float32Array(points * 3)
    const references = new Float32Array(points * 2)
    const birdVertex = new Float32Array(points)

    let v = 0
    const wingsSpan = 20
    const verts_push = (...args) => { for (let i = 0; i < args.length; i++) vertices[v++] = args[i] }

    for (let f = 0; f < BIRDS; f++) {
      verts_push(0, 0, -20, 0, 4, -20, 0, 0, 30)
      verts_push(0, 0, -15, -wingsSpan, 0, 0, 0, 0, 15)
      verts_push(0, 0, 15, wingsSpan, 0, 0, 0, 0, -15)
    }

    for (let i = 0; i < triangles * 3; i++) {
      const triangleIndex = ~~(i / 3)
      const birdIndex = ~~(triangleIndex / trianglesPerBird)
      const x = (birdIndex % WIDTH) / WIDTH
      const y = ~~(birdIndex / WIDTH) / WIDTH
      const c = new THREE.Color(0x666666 + ~~(i / 9) / BIRDS * 0x666666)
      colors[i * 3 + 0] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      references[i * 2] = x
      references[i * 2 + 1] = y
      birdVertex[i] = i % 9
    }

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geo.setAttribute('birdColor', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('reference', new THREE.BufferAttribute(references, 2))
    geo.setAttribute('birdVertex', new THREE.BufferAttribute(birdVertex, 1))
    geo.scale(0.2, 0.2, 0.2)
    return geo
  }, [])
}

// ==================== MAIN COMPONENT =====================

export default function BirdsFlocking() {
  const { gl, mouse } = useThree()
  const gpuCompute = useRef()
  const velocityVariable = useRef()
  const positionVariable = useRef()
  const positionUniforms = useRef()
  const velocityUniforms = useRef()
  const birdUniforms = useRef({
    color: { value: new THREE.Color(0xff2200) },
    texturePosition: { value: null },
    textureVelocity: { value: null },
    time: { value: 0 },
    delta: { value: 0 }
  })
  const last = useRef(performance.now())

  // INIT GPU COMPUTE
  useEffect(() => {
    gpuCompute.current = new GPUComputationRenderer(WIDTH, WIDTH, gl)

    const dtPosition = gpuCompute.current.createTexture()
    const dtVelocity = gpuCompute.current.createTexture()

    const posArray = dtPosition.image.data
    for (let k = 0; k < posArray.length; k += 4) {
      posArray[k + 0] = Math.random() * BOUNDS - BOUNDS_HALF
      posArray[k + 1] = Math.random() * BOUNDS - BOUNDS_HALF
      posArray[k + 2] = Math.random() * BOUNDS - BOUNDS_HALF
      posArray[k + 3] = 1
    }

    const velArray = dtVelocity.image.data
    for (let k = 0; k < velArray.length; k += 4) {
      velArray[k + 0] = (Math.random() - 0.5) * 5
      velArray[k + 1] = (Math.random() - 0.5) * 5
      velArray[k + 2] = (Math.random() - 0.5) * 5
      velArray[k + 3] = 1
    }

    velocityVariable.current = gpuCompute.current.addVariable('textureVelocity', fragmentShaderVelocity, dtVelocity)
    positionVariable.current = gpuCompute.current.addVariable('texturePosition', fragmentShaderPosition, dtPosition)

    gpuCompute.current.setVariableDependencies(velocityVariable.current, [positionVariable.current, velocityVariable.current])
    gpuCompute.current.setVariableDependencies(positionVariable.current, [positionVariable.current, velocityVariable.current])

    positionUniforms.current = positionVariable.current.material.uniforms
    velocityUniforms.current = velocityVariable.current.material.uniforms

    positionUniforms.current['time'] = { value: 0 }
    positionUniforms.current['delta'] = { value: 0 }
    velocityUniforms.current['time'] = { value: 0 }
    velocityUniforms.current['delta'] = { value: 0 }
    velocityUniforms.current['separationDistance'] = { value: 20 }
    velocityUniforms.current['alignmentDistance'] = { value: 30 }
    velocityUniforms.current['cohesionDistance'] = { value: 20 }
    velocityUniforms.current['freedomFactor'] = { value: 0.1 }
    velocityUniforms.current['predator'] = { value: new THREE.Vector3() }
    velocityUniforms.current['target'] = { value: new THREE.Vector3(0, 200, -500) }

    velocityVariable.current.material.defines.BOUNDS = BOUNDS.toFixed(2)
    const error = gpuCompute.current.init()
    if (error) console.error(error)
  }, [gl])

  // UPDATE LOOP
  useFrame(({ clock }) => {
    const now = performance.now()
    let delta = (now - last.current) / 1000
    if (delta > 1) delta = 1
    last.current = now

    positionUniforms.current['time'].value = now
    positionUniforms.current['delta'].value = delta
    velocityUniforms.current['time'].value = now
    velocityUniforms.current['delta'].value = delta
    birdUniforms.current['time'].value = now
    birdUniforms.current['delta'].value = delta

    // Predator follows mouse
    velocityUniforms.current['predator'].value.set(0.5 * mouse.x, -0.5 * mouse.y, 0)

    // 🧭 Circular path target
    const t = clock.elapsedTime * 0.2
    const radius = 500
    const x = Math.sin(t) * radius
    const z = Math.cos(t) * radius
    const y = 200
    velocityUniforms.current['target'].value.set(x, y, z)

    gpuCompute.current.compute()

    birdUniforms.current['texturePosition'].value =
      gpuCompute.current.getCurrentRenderTarget(positionVariable.current).texture
    birdUniforms.current['textureVelocity'].value =
      gpuCompute.current.getCurrentRenderTarget(velocityVariable.current).texture
  })

  const geometry = BirdGeometry()
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: birdUniforms.current,
        vertexShader: birdVertexShader,
        fragmentShader: birdFragmentShader,
        side: THREE.DoubleSide
      }),
    []
  )

  return (
    <>
      <OrbitControls />
      <mesh geometry={geometry} material={material} rotation={[0, Math.PI / 2, 0]} />
    </>
  )
}
