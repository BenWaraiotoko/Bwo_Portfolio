import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration - Ben Warai Otoko
 * Kanagawa Theme
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Ben Warai Otoko",
    pageTitleSuffix: " | Digital Garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "benwaraiotoko.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "JetBrains Mono",
      },
      colors: {
        // Kanagawa Light Mode
        lightMode: {
          light: "#F2ECDC",           // lotusWhite - page background
          lightgray: "#DCD7BA",       // fujiWhite - borders, lines
          gray: "#C8C093",            // oldWhite - secondary elements
          darkgray: "#727169",        // fujiGray - muted text
          dark: "#1F1F28",            // sumiInk1 - primary text
          secondary: "#E46876",       // waveRed - accent/headings
          tertiary: "#2D4F67",        // winterBlue - links
          highlight: "rgba(152, 187, 108, 0.15)",  // springGreen transparent
          textHighlight: "#E6C38488", // carpYellow transparent
        },
        // Kanagawa Dark Mode (default)
        darkMode: {
          light: "#1F1F28",           // sumiInk1 - page background
          lightgray: "#2A2A37",       // sumiInk3 - borders, cards
          gray: "#363646",            // sumiInk4 - secondary elements
          darkgray: "#C8C093",        // oldWhite - muted text
          dark: "#DCD7BA",            // fujiWhite - primary text
          secondary: "#E46876",       // waveRed - accent/headings
          tertiary: "#7FB4CA",        // crystalBlue - links
          highlight: "rgba(126, 156, 216, 0.15)",  // waveBlue transparent
          textHighlight: "#E6C38488", // carpYellow transparent
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [
      Plugin.ExplicitPublish(),  // Only files with publish: true
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Disabled for faster builds - enable for production
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
