import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function HorizontalFog({
  color = "#9eb7c5",
  density = 0.00045,
  heightFalloff = 0.0015,
  waterHeight = 0
}) {
  const { scene, camera } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material && !child.userData.fogModified) {
        const mat = child.material;
        child.userData.fogModified = true;

        mat.onBeforeCompile = (shader) => {
          // Inject uniforms (NO cameraPosition redeclare)
          shader.uniforms.fogColor = { value: new THREE.Color(color) };
          shader.uniforms.fogDensity = { value: density };
          shader.uniforms.fogHeightFalloff = { value: heightFalloff };
          shader.uniforms.fogWaterHeight = { value: waterHeight };

          // Vertex shader: inject world position varying
          shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
            #include <common>
            varying vec3 vWorldPosition;
            `
          );

          shader.vertexShader = shader.vertexShader.replace(
            "#include <worldpos_vertex>",
            `
            #include <worldpos_vertex>
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            `
          );

          // Fragment shader: inject our fog logic at the end
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <common>",
            `
            #include <common>
            varying vec3 vWorldPosition;
            uniform vec3 fogColor;
            uniform float fogDensity;
            uniform float fogHeightFalloff;
            uniform float fogWaterHeight;
            `
          );

          // Add fog code safely before final color output
          shader.fragmentShader = shader.fragmentShader.replace(
            /void\s+main\s*\(\)\s*{/,
            `
            void main() {
            `
          );

          // Append at the end of main()
          shader.fragmentShader = shader.fragmentShader.replace(
            /}$/gm,
            `
            // --- Custom Horizontal Fog ---
            vec3 relPos = vWorldPosition - cameraPosition;
            float fogDistance = length(relPos.xz);
            float fogFactor = 1.0 - exp(-pow(fogDistance * fogDensity, 2.0));

            // fade fog with height
            float heightFactor = clamp(exp(-vWorldPosition.y * fogHeightFalloff), 0.0, 1.0);
            fogFactor *= heightFactor;

            // fade fog below water level
            float underFade = smoothstep(fogWaterHeight - 5.0, fogWaterHeight + 1.0, vWorldPosition.y);
            fogFactor *= underFade;

            gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
            // --- End Fog ---
            }
            `
          );
        };

        mat.needsUpdate = true;
      }
    });
  }, [scene, camera, color, density, heightFalloff, waterHeight]);

  return null;
}
