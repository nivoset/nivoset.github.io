import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://nivoset.github.io/",
  author: "Ben Koop",
  desc: "Marginal Notes — writing on the tools, automation, and things I build.",
  title: "Nivoset",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/nivoset",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:nivoset@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
