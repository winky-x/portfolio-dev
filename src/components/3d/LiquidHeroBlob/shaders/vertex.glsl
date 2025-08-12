uniform float uTime;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_eye;
varying vec2 v_uv;

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/stefan-g/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec3 ix = vec3(Pi0.x, Pi1.x, Pi0.x);
  vec3 iy = vec3(Pi0.y, Pi0.y, Pi1.y);
  vec3 iz0 = Pi0.zzz;
  vec3 iz1 = Pi1.zzz;

  vec3 ixy = permute(permute(ix) + iy);

  vec3 g000 = vec3(0.5, 0.5, 0.5) * 2.0 - 1.0;
  vec3 g001 = vec3(0.5, 0.5, -0.5) * 2.0 - 1.0;
  vec3 g010 = vec3(0.5, -0.5, 0.5) * 2.0 - 1.0;
  vec3 g011 = vec3(0.5, -0.5, -0.5) * 2.0 - 1.0;
  vec3 g100 = vec3(-0.5, 0.5, 0.5) * 2.0 - 1.0;
  vec3 g101 = vec3(-0.5, 0.5, -0.5) * 2.0 - 1.0;
  vec3 g110 = vec3(-0.5, -0.5, 0.5) * 2.0 - 1.0;
  vec3 g111 = vec3(-0.5, -0.5, -0.5) * 2.0 - 1.0;

  vec3 grad000 = g000;
  vec3 grad001 = g001;
  vec3 grad010 = g010;
  vec3 grad011 = g011;
  vec3 grad100 = g100;
  vec3 grad101 = g101;
  vec3 grad110 = g110;
  vec3 grad111 = g111;

  float n000 = dot(grad000, Pf0);
  float n100 = dot(grad100, vec3(Pf1.x, Pf0.y, Pf0.z));
  float n010 = dot(grad010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(grad110, vec3(Pf1.x, Pf1.y, Pf0.z));
  float n001 = dot(grad001, vec3(Pf0.x, Pf0.y, Pf1.z));
  float n101 = dot(grad101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(grad011, vec3(Pf0.x, Pf1.y, Pf1.z));
  float n111 = dot(grad111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

void main() {
  v_uv = uv;
  v_position = position;
  v_normal = normal;
  v_eye = cameraPosition - position;

  float displacement = cnoise(position * 2.0 + uTime * 0.1) * 0.2;
  vec3 newPosition = position + normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
