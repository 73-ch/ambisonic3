precision mediump float;

uniform sampler2D texture;
varying vec2 v_texcoord;

void main() {
    float t = texture2D(texture, v_texcoord).r;
    gl_FragColor = vec4(vec3(t), 1.0);
}
