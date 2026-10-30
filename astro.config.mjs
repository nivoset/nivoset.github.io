import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";

// Give rendered Markdown task checkboxes the text they describe as their label.
function labelTaskLists() {
  return tree => {
    function visit(node) {
      if (node.tagName === "li" && node.properties?.className?.includes("task-list-item")) {
        const input = node.children?.find(child => child.tagName === "input");
        if (input) {
          const text = node.children.map(function content(child) {
            return child.value ?? child.children?.map(content).join("") ?? "";
          }).join("").trim();
          input.properties.ariaLabel = text;
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://nivoset.github.io",
  // base: '/my-repo',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  markdown: {
    rehypePlugins: [labelTaskLists],
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
