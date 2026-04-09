module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    pathPrefix: "/choonie-portfolio/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
