uniform float uTime;
uniform float uMetallic;
uniform float uRoughness;
uniform float uTransmission;
uniform float uThickness;
uniform float uIor;
uniform float uChromaticAberration;
uniform float uAnisotropy;

uniform vec3 uLight;
uniform vec3 uDark;
uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;

varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_eye;
varying vec2 v_uv;

#define S(a, b, t) smoothstep(a, b, t)
#define FBM(p) fbm(p)
#define NUM_OCTAVES 4

float fbm(vec2 p) {
	float f = 0.0;
	float a = 1.0;
	vec2 d = vec2(0.0);
	for(int i = 0; i < NUM_OCTAVES; i++) {
		f += a * noise(p + d);
		a *= 0.5;
		d *= 2.0;
	}
	return f;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

void main() {
  vec3 N = normalize(v_normal);
  vec3 V = normalize(v_eye);
  vec3 L = normalize(vec3(1.0, 1.0, 1.0)); // Light direction

  float dotNL = clamp(dot(N, L), 0.0, 1.0);
  vec3 diffuse = uPrimary * dotNL;

  vec3 R = reflect(-L, N);
  float spec = pow(max(dot(R, V), 0.0), 32.0);
  vec3 specular = vec3(spec) * uAccent;

  vec3 F0 = vec3(0.04); 
  vec3 fresnel = fresnelSchlick(max(dot(N,V), 0.0), F0);

  float noiseVal = FBM(v_position.xy * 2.0 + uTime * 0.1);

  vec3 color = mix(uPrimary, uSecondary, S(0.3, 0.7, noiseVal));
  color = mix(color, uAccent, S(0.6, 0.8, noiseVal));

  vec3 finalColor = color * (0.2 + dotNL) + specular + fresnel * 0.1;

  gl_FragColor = vec4(finalColor, 1.0);
}
