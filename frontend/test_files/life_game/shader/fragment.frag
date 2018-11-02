precision mediump float;

uniform sampler2D texture;
uniform vec2 u_resolution;
uniform float time;
varying vec2 v_texcoord;

#pragma glslify: import("./randoms.glsl")

void main() {
    // 周囲8ピクセルの合計
    float sum = 0.0;

    for (float i = 0.; i < 8.; ++i) {
        sum += texture2D(texture, mod((vec2(mod(mod(i,3.)+2.,3.), mod(floor(i/3.) + 2., 3.))-vec2(1.))/u_resolution + v_texcoord + 1., 1.)).r;
    }

    // このピクセル自身
    float t = texture2D(texture, v_texcoord).r;

    // life-gameルール
    float a = step(2.5-t, sum) - step(3.5, sum);

    // 1%の確率で自然発生
    a += step(0.99, random(u_resolution + time));

    gl_FragColor = vec4(vec3(a), 1.0);
}
