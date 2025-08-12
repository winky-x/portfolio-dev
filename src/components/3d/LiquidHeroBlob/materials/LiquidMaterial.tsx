import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

class CustomLiquidMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMetallic: { value: 0.9 },
        uRoughness: { value: 0.1 },
        uTransmission: { value: 0.6 },
        uThickness: { value: 1.4 },
        uIor: { value: 1.4 },
        uChromaticAberration: { value: 0.6 },
        uAnisotropy: { value: 0.8 },
        uLight: { value: new THREE.Color('#FAFAFA') },
        uDark: { value: new THREE.Color('#0A0A0A') },
        uPrimary: { value: new THREE.Color('#6B5FFF') },
        uSecondary: { value: new THREE.Color('#FF6B5F') },
        uAccent: { value: new THREE.Color('#5FFFB6') },
      },
    });
  }
}

extend({ LiquidMaterial: CustomLiquidMaterial });

export { CustomLiquidMaterial as LiquidMaterial };
