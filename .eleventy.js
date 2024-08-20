function getRSSContent(dataAsJson) {
  return dataAsJson.elements[0].elements[0].elements.reduce((memo, elem) => {
    if (elem.name === "item") {
      const html = elem.elements.reduce((a, b) => {
        if (b.name === "description") {
          // TODO: add date for bookwyrm fetch
          a = b.elements[0].text || b.elements[0].cdata;
        }
        return a;
      });
      const cleanedHtml = html.split("staxl ")[1] || html;
      memo.push(`<div>${cleanedHtml}</div>`);
    }
    // get the latest 5 elements
    return memo.slice(0, 5);
  }, []);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add(".gitignore");

  eleventyConfig.addPassthroughCopy("./*.css");
  eleventyConfig.addPassthroughCopy("./assets");
  eleventyConfig.addLiquidShortcode("header-active", function (fileslug) {
    return `
        <a ${
          fileslug === "" || fileslug === "/" ? "class='active'" : ""
        } href="/">Home</a>
        <a ${
          fileslug === "" || fileslug === "/now" ? "class='active'" : ""
        } href="/now">Now</a>
        <!-- <a ${
          fileslug === "blog" ? "class='active'" : ""
        } href="/blog">Blog</a> -->
        <a ${
          fileslug === "livecoding" ? "class='active'" : ""
        } href="/livecoding">Algorave</a>
        <a ${
          fileslug === "music" ? "class='active'" : ""
        } href="/music">Music</a>
        <a ${
          fileslug === "webdev" ? "class='active'" : ""
        } href="/webdev">Web Dev</a>
        <a ${
          fileslug === "imprint" ? "class='active'" : ""
        } id="imprint" href="/imprint">Imprint</a>
      `;
  });
  eleventyConfig.addLiquidShortcode("letterboxd", async function () {
    const convert = require("xml-js");
    /* get latest items via RSS */
    const RSS_URL = `https://letterboxd.com/staxl/rss`;

    const latest = await fetch(RSS_URL)
      .then((response) => response.text())
      .then((str) => {
        dataAsJson = JSON.parse(convert.xml2json(str));
        const latestActivityElements = getRSSContent(dataAsJson);
        return latestActivityElements;
      });
    return latest;
  });
  eleventyConfig.addLiquidShortcode("bookwyrm", async function () {
    const convert = require("xml-js");
    /* get latest items via RSS */
    const RSS_URL = `https://bookwyrm.social/user/staxl/rss`;

    const latest = await fetch(RSS_URL)
      .then((response) => response.text())
      .then((str) => {
        dataAsJson = JSON.parse(convert.xml2json(str));
        const latestActivityElements = getRSSContent(dataAsJson);
        return latestActivityElements;
      });
    return latest;
  });

  return {
    passthroughFileCopy: true,
  };
};
