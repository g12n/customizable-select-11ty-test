const pluginWebc = require("@11ty/eleventy-plugin-webc");
const markdownItAttrs = require("markdown-it-attrs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc);
  eleventyConfig.addBundle("css");
  // Add markdown-it-attrs plugin
   eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItAttrs));

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site-with-bundle"
    }
  };
};
