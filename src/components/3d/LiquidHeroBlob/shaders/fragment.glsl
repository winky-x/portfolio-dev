uniform float uTime;
uniform float uMetallic;
uniform float uRoughness;
uniform float uTransmission;
uniform float uThickness;
uniform float uIor;
uniform float uChromaticAberration;
uniform vec3 uLight;
uniform vec3 uDark;
uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;

varying vec3 v_position;
varying vec3 v_normal;

vec3 getEyeVector(mat4 modelViewMatrix, vec3 position) {
  return normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
}

void main() {
  vec3 eyeVector = getEyeVector(modelviewMatrix, v_position);
  vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * v_normal);

  // Fresnel
  float fresnel = dot(eyeVector, worldNormal);
  fresnel = pow(fresnel, 2.0);

  // Iridescence
  vec3 color = mix(uPrimary, uSecondary, fresnel);
  color = mix(color, uAccent, pow(fresnel, 2.0));

  // Fake PBR
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(0.0, dot(worldNormal, lightDir)) * 0.5 + 0.5;

  vec3 finalColor = mix(uDark, color * uLight, diffuse);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
