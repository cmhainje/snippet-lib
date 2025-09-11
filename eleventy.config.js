import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { execSync } from "child_process";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("assets/");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("search.css");

  // custom code block wrapper
  eleventyConfig.addTransform("wrapCodeBlocks", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return content.replace(
        /<pre class="language-(\w+)"><code class="language-\w+">([\s\S]*?)<\/code><\/pre>/g,
        (match, language, code) => {
          return `
<div class="code-block">
  <div class="code-header">
    <p class="language-label">${language}</p>
    <button type="button" class="copy-button" onclick="copyCode(this)">
      copy
    </button>
  </div>
  <pre class="language-${language}"><code class="language-${language}">${code}</code></pre>
</div>
          `;
        }
      );
    }
  });

  // *** filters ***
  eleventyConfig.addFilter("getKeys", (target) => {
    return Object.keys(target);
  });

  eleventyConfig.addFilter("filterTagList", (tags) => {
    return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
  });

  eleventyConfig.addFilter("sortAlphabetically", (strings) => {
    return (strings || []).sort((b, a) => b.localeCompare(a));
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("readableDate", (date) => {
    const year = date.getUTCFullYear();
    const monthIndex = date.getUTCMonth();
    const day = date.getUTCDate();

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = monthNames[monthIndex];

    const paddedDay = day < 10 ? '0' + day : day;
    return `${year} ${month} ${paddedDay}`
  });
}
