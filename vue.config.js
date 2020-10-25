module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "${require("path").resolve(
          __dirname,
          "./src/assets/sass/_variables.scss"
        )}";`
      }
    }
  }
};
