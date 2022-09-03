module.exports = function override (config, env) {
    console.log('override...')
    let loaders = config.resolve
    loaders.fallback = {
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http")
    }
    
    return config
}