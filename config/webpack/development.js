process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment');

environment.loaders.append('glsl-import', {
    test: /\.(glsl|frag|vert)$/,
    use: 'glslify-import-loader',
    exclude: /node_modules/
});

environment.loaders.append('raw', {
    test: /\.(glsl|frag|vert)$/,
    use: 'raw-loader',
    exclude: /node_modules/
});

environment.loaders.append('glsl', {
    test: /\.(glsl|frag|vert)$/,
    use: 'glslify-loader',
    exclude: /node_modules/
});

module.exports = environment.toWebpackConfig();