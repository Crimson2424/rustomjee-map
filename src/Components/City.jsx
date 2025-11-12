import { MeshReflectorMaterial, useGLTF, useKTX2, useTexture } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { UnderwaterLand } from "./UnderwaterLand";
import { Sea } from "./Sea";
import { SmallSand } from "./SmallSand";
import { InstancedTrees } from "./Improvedinstancedtrees";
import { RoadClickSampler } from "./Roadsampler";
import { TrafficFromSamples } from "./TrafficFromSamples";
import { Boat } from "./Boat";
import { useControls } from "leva";
import { FishingBoat } from "./FishingBoat";
import { Yatch } from "./Yatch";
import { FishingBoat2 } from "./FishingBoat2";
import { Yatch2 } from "./Yatch2";

export function City(props) {
  const { nodes, materials } = useGLTF("models/rustomjeeEditedmap2.glb");
  const { nodes2, materials2 } = useGLTF("models/Tree-v1.glb");

  // ✅ Add Leva controls for Boat position, rotation, and scale
  const {
    boatPosition,
    boatRotation,
    boatScale,
    boat2Position,
    boat2Rotation,
    boat2Scale,
    Yatch2Position,
    Yatch2Rotation,
    Yatch2Scale,
  } = useControls("Boat Controls", {
    boatPosition: {
      value: [-620, -8, 177],
      step: 1,
      joystick: "invertY",
      label: "Position [x,y,z]",
    },
    boatRotation: {
      value: [0, -0.3, 0],
      step: 0.1,
      label: "Rotation [x,y,z]",
    },
    boatScale: {
      value: 10,
      min: 0.1,
      max: 10,
      step: 0.1,
      label: "Scale",
    },
    boat2Position: {
      value: [-620, -8, 177],
      step: 1,
      joystick: "invertY",
      label: "Position [x,y,z]",
    },
    boat2Rotation: {
      value: [0, -0.3, 0],
      step: 0.1,
      label: "Rotation [x,y,z]",
    },
    boat2Scale: {
      value: 6,
      min: 0.1,
      max: 10,
      step: 0.1,
      label: "Scale",
    },
    Yatch2Position: {
      value: [-620, -8, 177],
      step: 1,
      joystick: "invertY",
      label: "Position [x,y,z]",
    },
    Yatch2Rotation: {
      value: [0, -0.3, 0],
      step: 0.1,
      label: "Rotation [x,y,z]",
    },
    Yatch2Scale: {
      value: 6,
      min: 0.1,
      max: 10,
      step: 0.1,
      label: "Scale",
    },
  });

  const roadNames = [
    "Road-1",
    "Road-2",
    "Road-3",
    "Road-4",
    "Road-5",
    "Road-7",
    "Road-8",
    "Road-9",
    "Road-10",
    "Plane",
    "Bridge_Baked",
  ];

  const mySamples = [
    [-1100.1934159902976, 26.21803581237793, 3217.410820648803],
    [-1062.7732941389042, 26.21803581237793, 3060.7501802842007],
    [-1021.4418598483265, 26.218035812377817, 2888.794672311217],
    [-977.2534094747509, 26.218035812377817, 2701.7992567743563],
    [-952.5739322529985, 26.21803581237793, 2605.019239528293],
    [-909.0560374537567, 26.218035812377703, 2420.87888355033],
    [-872.4689433315048, 26.218035812377703, 2271.261545827364],
    [-830.899406246021, 26.21803581237793, 2091.1082110550487],
    [-789.1206417807186, 26.21803581237793, 1901.4461512968605],
    [-744.2885474328091, 26.218035812378158, 1724.5567442768165],
    [-695.8845671326554, 26.218035812378158, 1522.438987242699],
    [-626.2439745189688, 26.218035812377703, 1247.2340360875978],
    [-555.1847016681818, 26.218035812377703, 942.4229379826708],
    [-486.89966659298875, 26.218035812378158, 722.2969520055344],
    [-443.21932765509484, 26.21803581237793, 653.9426983100939],
    [-421.18989919366425, 26.218035812377703, 619.4694048688621],
    [-395.72541948778263, 26.218035812378158, 587.4352975296733],
    [-372.6245418058354, 26.21803581237793, 562.2823649110555],
    [-325.50379848121236, 26.21803581237793, 521.5492306759004],
    [-277.97142148888423, 26.218035812378158, 485.65457369425144],
    [-193.8955543726023, 26.218035812378158, 435.5268331077116],
    [-160.40443498965982, 26.21803581237793, 417.0198480657889],
    [-99.25614076394179, 20.257890964292866, 390.2087179313563],
    [-2.1311350454322593, 9.072936743013424, 344.14696973076525],
    [53.731636954699866, 2.646757900450093, 317.81682780030496],
    [67.62400089905168, 1.1707166385648362, 311.09115697415416],
    [125.54700812985561, 1.1707166385650636, 287.160823984294],
    [201.1656180039049, 1.170716638565291, 257.43921305989227],
    [271.38193038456757, 1.170716638565291, 219.8670981364372],
    [367.33532293385304, 1.170716638565291, 174.29500819186862],
    [464.5612598529275, 1.1707166385648362, 122.46103391663931],
    [546.7032519459055, 1.170716638565291, 74.03428245528866],
    [578.3430268309556, 1.1707166385648362, 50.75143043693973],
    [691.0855503977056, 1.1707166385650636, -62.458582342721314],
    [769.6662264004315, 1.1707166385650636, -152.65401217905227],
    [863.3642905488939, 1.1707166385650636, -251.38220048034668],
    [943.4361582334866, 1.1707166385650636, -340.4590436504142],
    [998.1690897819158, 1.1707166385650636, -399.39261897293716],
    [1032.1060212052168, 1.1707166385650636, -439.7526431274802],
    [1067.4511053541394, 1.170716638565291, -458.789074247352],
    [1094.749389673624, 1.170716638565291, -475.6595054595924],
    [1129.551560454851, 1.1707166385650636, -486.7216838070175],
    [1173.3388085894458, 1.1707166385648362, -495.85461155359803],
    [1205.3206915046985, 1.1707166385650636, -493.1011812148125],
    [1244.4482125108736, 1.1707166385648362, -493.24906499495233],
    [1313.1016553458965, 1.1707166385648362, -490.1782413510568],
    [1360.6804043030493, 1.170716638565291, -485.8146531970826],
    [1398.0195500227146, 1.1707166385650636, -484.74272701434745],
    [1439.0060485482059, 1.1707166385648362, -482.11921990557136],
    [1479.871924535766, 1.1707166385650636, -479.5034337316692],
    [1510.2487375097446, 1.1707166385650636, -474.93709541314405],
    [1556.1721752947903, 1.1707166385648362, -474.6195266532658],
    [1594.365938542692, 1.1707166385650636, -474.78928198825224],
    [1657.5426009133134, 1.170716638565291, -487.70739018084384],
    [1712.67460028932, 1.1707166385648362, -512.8465084696165],
    [1793.6057999347472, 1.1707166385648362, -546.6558649923927],
    [1831.0438063740771, 1.1707166385650636, -558.4982167572025],
    [1869.2790316473738, 1.1707166385650636, -573.0608283980482],
    [1945.9591826813537, 1.1707166385651773, -604.2762468410615],
    [2055.822980919132, 1.1707166385650636, -651.771005288967],
    [2173.911288226966, 1.1707166385650636, -702.6272375927354],
    [2224.036199695069, 1.17071663856495, -724.420631092208],
    [2289.8212673485064, 1.17071663856495, -753.017300912313],
    [2313.324683546758, 1.1707166385650636, -762.5075805632154],
  ];

  const mySamples2 = [
    [-1081.6958195157463, 26.218035812378158, 3278.585151174789],
    [-1068.731406892542, 26.218035812377703, 3206.224222775963],
    [-1058.8440408383221, 26.21803581237793, 3144.257122234829],
    [-1040.2891264110876, 26.21803581237793, 3068.666058981607],
    [-1012.1167693196768, 26.218035812378158, 2954.427627336363],
    [-991.9476012443532, 26.21803581237793, 2875.8923611054806],
    [-969.4799966452377, 26.21803581237793, 2782.047458819306],
    [-918.1067059528946, 26.218035812377703, 2560.9366120539516],
    [-876.1989278516473, 26.218035812377703, 2391.764487757865],
    [-850.8997439280355, 26.21803581237793, 2291.9512098514983],
    [-821.6043718302942, 26.21803581237793, 2153.688171600139],
    [-785.0092727317667, 26.218035812378158, 2010.702499241516],
    [-758.1984802791355, 26.218035812377476, 1900.283209377278],
    [-731.3669786322197, 26.21803581237793, 1781.2375893865249],
    [-683.1965579656721, 26.21803581237793, 1598.611459957339],
    [-585.5671833751935, 26.21803581237793, 1179.197107609545],
    [-538.4627583055722, 26.218035812378385, 1000.4728109852394],
    [-491.9380518487615, 26.21803581237793, 818.9674331523725],
    [-471.0824906041455, 26.21803581237793, 744.8176165210732],
    [-451.4143806067581, 26.21803581237793, 698.0925993149413],
    [-422.68384762032633, 26.218035812378385, 665.0504784274697],
    [-405.8418677003516, 26.218035812378385, 640.2864333720747],
    [-379.31743516909324, 26.218035812377476, 607.8502392247171],
    [-337.7828971327397, 26.218035812378385, 565.4889976304837],
    [-274.6452200735825, 26.218035812378385, 508.7811803043908],
    [-203.5520334538707, 26.21803581237793, 463.187394978803],
    [-149.65137876532782, 26.047665233906738, 437.8038471303273],
    [-107.97218954673929, 22.683207729387387, 423.58039638879853],
    [-26.630064570574234, 13.630182764491218, 385.0025848517165],
    [59.559180047854966, 4.04061379376878, 344.1943350322058],
    [135.6519595964831, 1.1707166385650636, 310.4094618040895],
    [314.204047871207, 1.1707166385648362, 229.96202926135572],
    [435.8034157075847, 1.170716638565291, 166.44064957083026],
    [529.3058613206838, 1.170716638565291, 118.94965643155945],
    [603.2951161116807, 1.1707166385650636, 73.0015683856534],
    [654.0574090596244, 1.1707166385648362, 21.800595162596323],
    [712.2654754658292, 1.1707166385650636, -43.07783608858131],
    [828.9745511859878, 1.1707166385650636, -171.27298535718455],
    [934.7626954434282, 1.1707166385650636, -291.186586908924],
    [1013.5939221385288, 1.1707166385650636, -376.0313893082513],
    [1040.2344436524309, 1.170716638565291, -406.67228802796956],
    [1065.739598222623, 1.1707166385650636, -426.1396473896375],
    [1100.4596536684612, 1.1707166385650636, -443.9291714424519],
    [1132.8142708366138, 1.1707166385648362, -457.10958462101746],
    [1158.4767408579548, 1.170716638565291, -463.9183004511509],
    [1188.6327506041405, 1.1707166385650636, -466.89695004064373],
    [1206.6509916152731, 1.170716638565291, -468.75022978548856],
    [1221.0296903249919, 1.1707166385650636, -472.7829991220718],
    [1240.0939668467693, 1.1707166385650636, -469.6450169542632],
    [1256.8996396533437, 1.1707166385650636, -469.2634518449441],
    [1286.1302673544362, 1.1707166385650636, -466.81492103055444],
    [1316.8043176216106, 1.170716638565291, -463.31605507743615],
    [1346.8521982565026, 1.1707166385650636, -461.4761604796727],
    [1389.7685910341102, 1.1707166385650636, -459.8053549548236],
    [1436.9951709351021, 1.1707166385648362, -455.0069443975602],
    [1476.0804698283393, 1.1707166385650636, -452.3048746018457],
    [1511.3775074502182, 1.1707166385650636, -453.2811408377831],
    [1553.9728580885874, 1.1707166385648362, -449.1046970447796],
    [1598.6005768572672, 1.1707166385650636, -446.0610805473337],
    [1643.8263964933024, 1.1707166385650636, -459.6297039903238],
    [1719.0168748036592, 1.1707166385648362, -487.03231847979106],
    [1766.7754587716327, 1.170716638565291, -506.79739304944064],
    [1826.1986188330634, 1.170716638565291, -535.9221826656512],
    [1841.0188498458292, 1.1707166385650636, -540.3186192589354],
    [1869.2943587272086, 1.1707166385650636, -549.1851509303463],
    [1917.4121825380432, 1.1707166385650636, -570.4238676116609],
    [2007.3285289070832, 1.1707166385651773, -607.0078881511122],
    [2089.784866736875, 1.1707166385650636, -644.4940777107038],
    [2148.180978088451, 1.1707166385651773, -669.0702051129961],
    [2211.1603049947357, 1.1707166385650636, -695.950920861143],
    [2293.2693697820346, 1.1707166385651773, -731.4912813613197],
  ];

  const {
    bakedLandTexture,
    bakedLand2Texture,
    buildingTextureSet1,
    buildingTextureSet2,
    buildingTextureSet3,
    buildingTextureSet4,
    buildingTextureSet5,
    buildingTextureSet6,
    buildingTextureFinal,
    roof1Texture,
    roof2Texture,
    roofLast,
    bridgeTexture,
  } = useKTX2({
    bakedLandTexture: "/Rustomjee-Bakes/Land-Main_Bake-3_etc1s_max.ktx2",
    bakedLand2Texture: "/Rustomjee-Bakes/Land_Bake1_adjusted_etc1s_max.ktx2",
  
    buildingTextureSet1: "/Rustomjee-Bakes/Building-Texture-Set-1-1_etc1s_max.ktx2",
    buildingTextureSet2: "/Rustomjee-Bakes/Building-Texture-Set-2-2_etc1s_max.ktx2",
    buildingTextureSet3: "/Rustomjee-Bakes/Building-Texture-Set-3_etc1s_max.ktx2",
    buildingTextureSet4: "/Rustomjee-Bakes/Building-Texture-Set-4_etc1s_max.ktx2",
    buildingTextureSet5: "/Rustomjee-Bakes/Building-Texture-Set-5_etc1s_max.ktx2",
    buildingTextureSet6: "/Rustomjee-Bakes/Building-Texture-Set-6_etc1s_max.ktx2",
  
    buildingTextureFinal: "/Rustomjee-Bakes/Building-Texture-Final_etc1s_max.ktx2",
  
    roof1Texture: "/Rustomjee-Bakes/Roof-1-1_etc1s_max.ktx2",
    roof2Texture: "/Rustomjee-Bakes/Roofs-2_etc1s_max.ktx2",
    roofLast: "/Rustomjee-Bakes/Roof-Last_etc1s_max.ktx2",
  
    bridgeTexture: "/Rustomjee-Bakes/Bridge_etc1s_max.ktx2",
  });
  
  // flipY = false for ALL
  [
    bakedLandTexture,
    bakedLand2Texture,
    buildingTextureSet1,
    buildingTextureSet2,
    buildingTextureSet3,
    buildingTextureSet4,
    buildingTextureSet5,
    buildingTextureSet6,
    buildingTextureFinal,
    roof1Texture,
    roof2Texture,
    roofLast,
    bridgeTexture,
  ].forEach((t) => (t.flipY = false));

  // ✅ Convert ALL GLTF materials to MeshBasicMaterial
  Object.keys(materials).forEach((key) => {
    const old = materials[key];
    materials[key] = new THREE.MeshBasicMaterial({
      map: old.map ?? null,
      color: old.color ?? new THREE.Color(1, 1, 1),
      transparent: old.transparent ?? false,
      opacity: old.opacity ?? 1,
      alphaTest: old.alphaTest ?? 0,
      side: old.side ?? THREE.FrontSide,
    });

    if (materials[key].map) {
      materials[key].map.needsUpdate = true;
    }
  });

  return (
    <group {...props} dispose={null}>
      {/* <mesh position={[0, 1.2, 0]} geometry={nodes.Retopo_Sea.geometry}>
        <PerformantOceanMaterial />
      </mesh> */}

      <Sea />

      {/* Buildings & scene geometry */}
      {Object.keys(nodes).map((key) => {
        const n = nodes[key];
        if (!n.geometry || key.includes("Tree") || key.includes("Scatter"))
          return null;

        let mat = materials[n.material?.name];

        console.log(key);

        if (key === "Sea_Land_1" || key === "Sea_Land") {
          return null;
        }

        if (
          key === "Road-1" ||
          key === "Road-2" ||
          key === "Road-3" ||
          key === "Road-4" ||
          key === "Road-5" ||
          key === "Road-7" ||
          key === "Road-8" ||
          key === "Road-9" ||
          key === "Road-10" ||
          key === "Plane"   
          
        ) {
          mat = new THREE.MeshBasicMaterial({ color: 0x404040 }); // change color if needed
        }

        // if (key === "Bridge_Baked") {
        //   const originalMat = n.material; // this is the REAL material the mesh uses

        //   mat = new THREE.MeshBasicMaterial({
        //     map: originalMat.map || null,
        //   });
        // }

        if (key === "Sea_Land_2") {
          return null;
        }

        if (key === "Retopo_Sea") {
          return null;
        }

        if (key === "Land-Main_Baked" || key === "Land_Baked") {
          return null;
        }

        if (
          key === "Building-Texture-Set-1_Baked" ||
          key === "Building-Texture-Set-3_Baked" ||
          key === "Building-Texture-Set-2_Baked" ||
          key === "Building-Texture-Set-4_Baked" ||
          key === "Building-Texture-Set-5_Baked" ||
          key === "Building-Texture-Set-6_Baked" ||
          key === "Building-Texture-Final_Baked" ||
          key === "Bridge_Baked"
        ) {
          return null;
        }

        if (key === "Roof-1_Baked") {
          return null;
        }

        return (
          <mesh
            // castShadow
            // receiveShadow
            key={key}
            geometry={n.geometry}
            material={mat}
            position={n.position}
            rotation={n.rotation}
            scale={n.scale}
          />
        );
      })}
      <UnderwaterLand position={[0, -0.2, 0]} />
      <SmallSand />

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Set-1_Baked"].geometry}
        // material={nodes["Building-Texture-Set-1_Baked"].material}
      >
        <meshBasicMaterial map={buildingTextureSet1} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Set-2_Baked"].geometry}
      >
        <meshBasicMaterial map={buildingTextureSet2} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Set-3_Baked"].geometry}
      >
        <meshBasicMaterial map={buildingTextureSet3} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Set-4_Baked"].geometry}
      >
        <meshBasicMaterial map={buildingTextureSet4} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Set-5_Baked"].geometry}
      >
        <meshBasicMaterial map={buildingTextureSet5} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Set-6_Baked"].geometry}
      >
        <meshBasicMaterial map={buildingTextureSet6} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Building-Texture-Final_Baked"].geometry}
      >
        <meshBasicMaterial map={buildingTextureFinal} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Roof-1_Baked"].geometry}
        // material={nodes["Roof-1_Baked"].material}
      >
        <meshBasicMaterial map={roof1Texture} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Roof-Last_Baked"].geometry}
      >
        <meshBasicMaterial map={roofLast} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Roofs-2_Baked"].geometry}
      >
        <meshBasicMaterial map={roof2Texture} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bridge_Baked.geometry}
      >
        <meshBasicMaterial map={bridgeTexture} />
      </mesh>

      {/* Add traffic system */}

      {/* <RoadClickSampler nodes={nodes} roadNames={roadNames} /> */}
      <TrafficFromSamples
        samples={mySamples}
        particleCount={140}
        particleScale={9.0}
        laneOffset={0} // optional lateral offset to create a "lane" look
        showDebug={false} // set false to hide debug lines & points
        speedRange={[0.01, 0.01]}
        reversed={true}
      />

      <TrafficFromSamples
        samples={mySamples2}
        particleCount={140}
        particleScale={9.0}
        laneOffset={0} // optional lateral offset to create a "lane" look
        showDebug={false} // set false to hide debug lines & points
        speedRange={[0.01, 0.01]}
      />

      {/* Boats Meshes  */}
      <FishingBoat position={[-600, -10, -400]} scale={6} />
      <FishingBoat2
        position={[355, -8, 399]}
        rotation={[0, 3.0, 0]}
        scale={6}
      />
      <Yatch2 position={[768, -8, 201]} rotation={[0, -0.3, 0.0]} scale={0.1} />
      <Yatch position={[-375, -8, -678]} scale={12} />
      <Boat
        position={[-720, -8, 177]}
        rotation={boatRotation}
        scale={boatScale}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Land-Main_Baked"].geometry}
        // material={materials['Land-Main_Baked.001']}
      >
        <meshBasicMaterial map={bakedLandTexture} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Land_Baked.geometry}
        // material={materials['Land_Baked.001']}
      >
        <meshBasicMaterial map={bakedLand2Texture} />
      </mesh>

      {/* <AnotherTree position={[100,0,100]} scale={3}/> */}

      {/* Instanced trees */}
      <InstancedTrees
        meshName="Tree-Variant-4182_Baked"
        jsonFile="Tree-Variation-4-final.json"
        texturePath="/Rustomjee-Bakes/Tree-Variant-4182_Baked_uastc_max.ktx2"
        nodes={nodes}
        materials={materials}
      />
      {/* <TreeGood /> */}
      <InstancedTrees
        meshName="Tree-Variant-6499_Baked"
        jsonFile="Tree-Variation-6-final.json"
        texturePath="/Rustomjee-Bakes/Tree-Variant-6499_Baked_uastc_max.ktx2"
        nodes={nodes}
        materials={materials}
      />

      <InstancedTrees
        meshName="Tree-Variant-5442_Baked"
        jsonFile="Tree-Variation-5-final.json"
        texturePath="/Rustomjee-Bakes/Tree-Variant-5442_Baked_uastc_max.ktx2"

        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-variant-1-Baked"
        jsonFile="Tree-Variation-1-final.json"
        texturePath="/Rustomjee-Bakes/Tree-variant-1_uastc_max.ktx2"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-Variant-3807_Baked"
        jsonFile="Tree-Variation-3-final.json"
        texturePath="/Rustomjee-Bakes/Tree-Variant-3807_Baked_uastc_max.ktx2"
        nodes={nodes}
        materials={materials}
      />
      <InstancedTrees
        meshName="Tree-Variant-2991_Baked"
        jsonFile="Tree-Variation-2-final.json"
        texturePath="/Rustomjee-Bakes/Tree-Variant-2991_Baked_uastc_max.ktx2"
        nodes={nodes}
        materials={materials}
      />
    </group>
  );
}

useGLTF.preload("models/Rustomjee-3d-without-treess.glb");
