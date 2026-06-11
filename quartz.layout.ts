import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// ssp.sh-inspired layout: centered content, minimal sidebars
// Graph at bottom, TOC near top, clean navigation

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
    Component.Spacer(),
    Component.DesktopOnly(
      Component.Breadcrumbs({ rootName: "Home" }),
    ),
    Component.Spacer(),
    Component.Search(),
    Component.Darkmode(),
  ],
  afterBody: [
    Component.Graph({
      localGraph: {
        drag: true,
        zoom: true,
        depth: 2,
        scale: 1.1,
        repelForce: 0.5,
        centerForce: 0.3,
        linkDistance: 30,
        fontSize: 0.6,
        opacityScale: 1,
        showTags: true,
      },
      globalGraph: {
        drag: true,
        zoom: true,
        depth: -1,
        scale: 0.9,
        repelForce: 0.5,
        centerForce: 0.3,
        linkDistance: 30,
        fontSize: 0.6,
        opacityScale: 1,
        showTags: true,
      },
    }),
    Component.Backlinks(),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/bnardini",
      LinkedIn: "https://www.linkedin.com/in/bnardini/",
      Email: "mailto:bwonews@proton.me",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.TableOfContents(),
  ],
  left: [
    Component.DesktopOnly(
      Component.Explorer({
        title: "Explorer",
        folderClickBehavior: "collapse",
        folderDefaultState: "open",
        useSavedState: true,
      }),
    ),
  ],
  right: [
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Posts",
        limit: 6,
        showTags: true,
        filter: (f) => {
          const category = f.frontmatter?.category
          return category === "posts" || (f.tags ?? []).includes("homelab")
        },
      }),
    ),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.DesktopOnly(
      Component.Explorer({
        title: "Explorer",
        folderClickBehavior: "collapse",
        folderDefaultState: "open",
        useSavedState: true,
      }),
    ),
  ],
  right: [],
}