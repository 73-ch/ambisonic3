precision mediump float;

uniform vec2 u_resolution;
uniform float seed;
varying vec2 v_texcoord;

#pragma glslify: import("./randoms.glsl")

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution;

    float a = step(.9, random(uv+seed));

    gl_FragColor = vec4(vec3(a), 1.);
}
