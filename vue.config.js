module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
        @import "@/scss/style.scss";
        `,
        sassOptions: { indentedSyntax: false },
      },
    },
  },
};
