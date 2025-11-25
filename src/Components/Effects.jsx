import {
  Autofocus,
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  ColorAverage,
  DepthOfField,
  DotScreen,
  EffectComposer,
  Glitch,
  HueSaturation,
  Noise,
  Pixelation,
  Scanline,
  Sepia,
  SSAO,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import React from "react";

const Effects = () => {
  // Depth of Field Controls
  // const dofControls = useControls("Depth of Field", {
  //   dofEnabled: { value: false, label: "Enable DOF" },
  //   focusDistance: {
  //     value: 0.37,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  //   focalLength: {
  //     value: 0.38,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  //   bokehScale: {
  //     value: 4.9,
  //     min: 0,
  //     max: 10,
  //     step: 0.1,
  //   },
  // });

  // //   const autofocusControls = useControls("Autofocus", {
  // //     enabled: { value: false, label: "Enable" },

  // //     // Position controls
  // //     targetX: {
  // //       value: 0,
  // //       min: -10,
  // //       max: 10,
  // //       step: 0.1,
  // //       label: "Target X",
  // //     },
  // //     targetY: {
  // //       value: 0,
  // //       min: -10,
  // //       max: 10,
  // //       step: 0.1,
  // //       label: "Target Y",
  // //     },
  // //     targetZ: {
  // //       value: 0,
  // //       min: -10,
  // //       max: 10,
  // //       step: 0.1,
  // //       label: "Target Z",
  // //     },

  // //     bokehScale: {
  // //       value: 10,
  // //       min: 0,
  // //       max: 20,
  // //       step: 0.5,
  // //     },
  // //     focalLength: {
  // //       value: 0.02,
  // //       min: 0,
  // //       max: 0.1,
  // //       step: 0.001,
  // //     },
  // //     smoothTime: {
  // //       value: 0.25,
  // //       min: 0,
  // //       max: 1,
  // //       step: 0.05,
  // //     },
  // //     debug: { value: false, label: "Show Debug" },
  // //   });

  // // Bloom Controls
  // const bloomControls = useControls("Bloom", {
  //   bloomEnabled: { value: false, label: "Enable Bloom" },
  //   intensity: {
  //     value: 1.0,
  //     min: 0,
  //     max: 3,
  //     step: 0.1,
  //   },
  //   luminanceThreshold: {
  //     value: 0.9,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  //   luminanceSmoothing: {
  //     value: 0.025,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  // // Chromatic Aberration Controls
  // const chromaticControls = useControls("Chromatic Aberration", {
  //   chromaticEnabled: { value: false, label: "Enable Chromatic" },
  //   offset: {
  //     value: [0.002, 0.002],
  //     step: 0.001,
  //     label: "Offset",
  //   },
  // });

  // // Vignette Controls
  // const vignetteControls = useControls("Vignette", {
  //   vignetteEnabled: { value: false, label: "Enable Vignette" },
  //   offset: {
  //     value: 0.5,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //     label: "Offset",
  //   },
  //   darkness: {
  //     value: 0.5,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  // // Noise Controls
  // const noiseControls = useControls("Noise", {
  //   noiseEnabled: { value: false, label: "Enable Noise" },
  //   opacity: {
  //     value: 0.1,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  // // SSAO Controls
  // const ssaoControls = useControls("SSAO", {
  //   ssaoEnabled: { value: false, label: "Enable SSAO" },
  //   intensity: {
  //     value: 30,
  //     min: 0,
  //     max: 100,
  //     step: 1,
  //   },
  //   radius: {
  //     value: 5,
  //     min: 0,
  //     max: 20,
  //     step: 0.1,
  //   },
  // });

  // Brightness & Contrast Controls
  // const bcControls = useControls("Brightness & Contrast", {
  //   bcEnabled: { value: true, label: "Enable B&C" },
  //   brightness: {
  //     value: 0,
  //     min: -1,
  //     max: 1,
  //     step: 0.01,
  //   },
  //   contrast: {
  //     value: 0,
  //     min: -1,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  // Tone Mapping Controls
  // const toneMappingControls = useControls("Tone Mapping", {
  //   toneMappingEnabled: { value: false, label: "Enable" },

  //   // Blend Function
  //   blendFunction: {
  //     value: "NORMAL",
  //     options: [
  //       "SKIP",
  //       "ADD",
  //       "ALPHA",
  //       "AVERAGE",
  //       "COLOR_BURN",
  //       "COLOR_DODGE",
  //       "DARKEN",
  //       "DIFFERENCE",
  //       "EXCLUSION",
  //       "LIGHTEN",
  //       "MULTIPLY",
  //       "DIVIDE",
  //       "NEGATION",
  //       "NORMAL",
  //       "OVERLAY",
  //       "REFLECT",
  //       "SCREEN",
  //       "SOFT_LIGHT",
  //       "SUBTRACT",
  //     ],
  //   },

  //   // Resolution (power of 2)
  //   resolution: {
  //     value: 256,
  //     options: [64, 128, 256, 512, 1024],
  //   },

  //   // Adaptive Luminance
  //   adaptive: {
  //     value: true,
  //     label: "Adaptive",
  //   },

  //   // Middle Grey
  //   middleGrey: {
  //     value: 0.6,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },

  //   // Max Luminance
  //   maxLuminance: {
  //     value: 16,
  //     min: 1,
  //     max: 32,
  //     step: 0.5,
  //   },

  //   // Min Luminance
  //   minLuminance: {
  //     value: 0.01,
  //     min: 0.001,
  //     max: 1,
  //     step: 0.001,
  //   },

  //   // Average Luminance
  //   averageLuminance: {
  //     value: 1,
  //     min: 0,
  //     max: 2,
  //     step: 0.01,
  //   },

  //   // Adaptation Rate
  //   adaptationRate: {
  //     value: 1,
  //     min: 0,
  //     max: 5,
  //     step: 0.1,
  //   },
  // });

  // // Sepia Controls
  // const sepiaControls = useControls("Sepia", {
  //   sepiaEnabled: { value: false, label: "Enable Sepia" },
  //   intensity: {
  //     value: 0.5,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  // // Glitch Controls
  // const glitchControls = useControls("Glitch", {
  //   glitchEnabled: { value: false, label: "Enable Glitch" },
  //   delay: {
  //     value: [1.5, 3.5],
  //     min: 0,
  //     max: 10,
  //     step: 0.1,
  //     label: "Delay Min/Max",
  //   },
  //   duration: {
  //     value: [0.6, 1.0],
  //     min: 0,
  //     max: 2,
  //     step: 0.1,
  //     label: "Duration Min/Max",
  //   },
  //   strength: {
  //     value: [0.3, 1.0],
  //     min: 0,
  //     max: 1,
  //     step: 0.1,
  //     label: "Strength Min/Max",
  //   },
  // });

  // // Scanline Controls
  // const scanlineControls = useControls("Scanline", {
  //   scanlineEnabled: { value: false, label: "Enable Scanline" },
  //   density: {
  //     value: 1.25,
  //     min: 0,
  //     max: 2,
  //     step: 0.01,
  //   },
  // });

  // // Pixelation Controls
  // const pixelationControls = useControls("Pixelation", {
  //   pixelationEnabled: { value: false, label: "Enable Pixelation" },
  //   granularity: {
  //     value: 5,
  //     min: 1,
  //     max: 20,
  //     step: 1,
  //   },
  // });

  // // Hue Saturation Controls
  // const hueControls = useControls("Hue & Saturation", {
  //   hueEnabled: { value: false, label: "Enable Hue/Sat" },
  //   hue: {
  //     value: 0,
  //     min: -Math.PI,
  //     max: Math.PI,
  //     step: 0.01,
  //   },
  //   saturation: {
  //     value: 0,
  //     min: -1,
  //     max: 1,
  //     step: 0.01,
  //   },
  // });

  // // Dot Screen Controls
  // const dotScreenControls = useControls("Dot Screen", {
  //   dotScreenEnabled: { value: false, label: "Enable Dot Screen" },
  //   angle: {
  //     value: 1.57,
  //     min: 0,
  //     max: Math.PI,
  //     step: 0.01,
  //   },
  //   scale: {
  //     value: 1,
  //     min: 0.1,
  //     max: 2,
  //     step: 0.1,
  //   },
  // });

  // // Color Average Controls
  // const colorAverageControls = useControls("Color Average", {
  //   colorAverageEnabled: { value: false, label: "Enable Color Average" },
  // });

  return (
    <EffectComposer>
      {/* Depth of Field */}
      {/* {dofControls.dofEnabled && (
        <DepthOfField
          focusDistance={dofControls.focusDistance}
          focalLength={dofControls.focalLength}
          bokehScale={dofControls.bokehScale}
        />
      )} */}

      {/* {autofocusControls.enabled && (
        <Autofocus
          target={[
            autofocusControls.targetX,
            autofocusControls.targetY,
            autofocusControls.targetZ,
          ]}
          bokehScale={autofocusControls.bokehScale}
          focalLength={autofocusControls.focalLength}
          smoothTime={autofocusControls.smoothTime}
          debug={autofocusControls.debug}
        />
      )} */}

      {/* Bloom */}
      {/* {bloomControls.bloomEnabled && (
        <Bloom
          mipmapBlur
          intensity={bloomControls.intensity}
          luminanceThreshold={bloomControls.luminanceThreshold}
          luminanceSmoothing={bloomControls.luminanceSmoothing}
        />
      )} */}

      {/* Chromatic Aberration */}
      {/* {chromaticControls.chromaticEnabled && (
        <ChromaticAberration offset={chromaticControls.offset} />
      )} */}

      {/* Vignette */}
      {/* {vignetteControls.vignetteEnabled && (
        <Vignette
          offset={vignetteControls.offset}
          darkness={vignetteControls.darkness}
        />
      )} */}

      {/* Noise */}
      {/* {noiseControls.noiseEnabled && <Noise opacity={noiseControls.opacity} />} */}

      {/* SSAO */}
      {/* {ssaoControls.ssaoEnabled && (
        <SSAO intensity={ssaoControls.intensity} radius={ssaoControls.radius} />
      )} */}

      {/* Brightness & Contrast */}
      {/* {bcControls.bcEnabled && (
        <BrightnessContrast
          brightness={bcControls.brightness}
          contrast={bcControls.contrast}
        />
      )} */}

      <BrightnessContrast
        brightness={0}
        contrast={0}
      />

      {/* Sepia */}
      {/* {sepiaControls.sepiaEnabled && (
        <Sepia intensity={sepiaControls.intensity} />
      )} */}

      {/* Glitch */}
      {/* {glitchControls.glitchEnabled && (
        <Glitch
          delay={glitchControls.delay}
          duration={glitchControls.duration}
          strength={glitchControls.strength}
          mode={GlitchMode.SPORADIC}
        />
      )} */}

      {/* Scanline */}
      {/* {scanlineControls.scanlineEnabled && (
        <Scanline density={scanlineControls.density} />
      )} */}

      {/* Pixelation */}
      {/* {pixelationControls.pixelationEnabled && (
        <Pixelation granularity={pixelationControls.granularity} />
      )} */}

      {/* Hue & Saturation */}
      {/* {hueControls.hueEnabled && (
        <HueSaturation
          hue={hueControls.hue}
          saturation={hueControls.saturation}
        />
      )} */}

      {/* Dot Screen */}
      {/* {dotScreenControls.dotScreenEnabled && (
        <DotScreen
          angle={dotScreenControls.angle}
          scale={dotScreenControls.scale}
        />
      )} */}

      {/* Color Average */}
      {/* {colorAverageControls.colorAverageEnabled && (
        <ColorAverage blendFunction={BlendFunction.NORMAL} />
      )} */}

      {/* Tone Mapping */}
      {/* {toneMappingControls.toneMappingEnabled && (
        <ToneMapping
          blendFunction={BlendFunction[toneMappingControls.blendFunction]}
          resolution={toneMappingControls.resolution}
          adaptive={toneMappingControls.adaptive}
          middleGrey={toneMappingControls.middleGrey}
          maxLuminance={toneMappingControls.maxLuminance}
          minLuminance={toneMappingControls.minLuminance}
          averageLuminance={toneMappingControls.averageLuminance}
          adaptationRate={toneMappingControls.adaptationRate}
        />
      )} */}
    </EffectComposer>
  );
};

export default Effects;
