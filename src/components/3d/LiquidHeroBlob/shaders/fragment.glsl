varying vec3 v_position;
varying vec3 v_normal;

uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;
uniform vec3 uLight;
uniform vec3 uDark;

void main() {
    vec3 normal = normalize(v_normal);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.5, 0.6)));

    vec3 color = mix(uPrimary, uSecondary, (v_position.x + 1.0) * 0.5);
    color = mix(color, uAccent, (v_position.y + 1.0) * 0.5);

    vec3 final_color = mix(uDark, color, lighting);
    
    gl_FragColor = vec4(final_color, 1.0);
}
