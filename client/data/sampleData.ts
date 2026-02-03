export type Story = {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  region: string;
  craft: string;
  hero: string;
  body: string[];
  inlineImage?: string;
  cultureLinks?: { label: string; value: string }[];
  createdOn: string;
  updatedOn: string;
  author: string;
  isPublished: boolean;
  source: string;
  srcFavIcon: string;
  srcLink: string;
};

export type Opportunity = {
  id: string;
  title: string;
  forLine: string;
  deadline: string;
  region: string;
  category: "Grant" | "Residency" | "Open Call" | "Scholarship" | "Fellowship";
  about: string;
  who: string[];
  offer: string[];
  linkLabel: string;
  createdOn: string;
  updatedOn: string;
  author: string;
  isPublished: boolean;
  source: string;
  srcFavIcon: string;
  srcLink: string;
};

export type Video = {
  id: string;
  title: string;
  duration: string;
  region: string;
  craft: string;
  thumb: string;
  description: string;
  createdOn: string;
  updatedOn: string;
  author: string;
  isPublished: boolean;
  source: string;
  srcFavIcon: string;
  srcLink: string;
};

export type CultureEntry = {
  id: string;
  title: string;
  region: string;
  craft: string;
  hero: string;
  intro: string;
  sections: { h: string; p: string }[];
  createdOn: string;
  updatedOn: string;
  author: string;
  isPublished: boolean;
};

export const SAMPLE_STORIES: Story[] = [
  {
    id: "s1",
    title: "The Hands That Shape Clay",
    subtitle: "A ceramic tradition from Oaxaca",
    readTime: "6 min read",
    region: "Mexico",
    craft: "Ceramics",
    hero: "https://images.unsplash.com/photo-1601713558325-9c2aa8d1d1ef?auto=format&fit=crop&w=1400&q=80",
    inlineImage: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
    body: [
      "In the hills of Oaxaca, the potter's hands work with a rhythm as old as the earth itself. Each movement carries the weight of centuries, a dance learned not from books but from watching—mothers, grandmothers, great-grandmothers—all shaping the same red clay.",
      "Clay is gathered, prepared, and shaped with patience—each vessel carrying the memory of place. The earth here has a particular quality, a richness that potters say speaks to them. They know its temperament, its moods, how it responds to rain and sun.",
      "Firing is both science and ceremony: heat, time, and intuition meet in a final transformation. The kiln becomes an altar, the fire a collaborator. What emerges is never quite predictable—and that's the beauty of it.",
      "What survives is not just an object, but a lineage—quietly handed down through generations. In every curve and glaze, there's a story waiting to be told.",
    ],
    cultureLinks: [
      { label: "Culture", value: "Oaxaca Ceramics" },
      { label: "Technique", value: "Hand-thrown Clay" },
    ],
    createdOn: "2026-01-15T10:00:00Z",
    updatedOn: "2026-01-20T14:30:00Z",
    author: "Elena Rodriguez",
    isPublished: true,
    source: "Craft Council",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=craftcouncil.org",
    srcLink: "https://www.craftcouncil.org/magazine/article/hands-shape-clay",
  },
  {
    id: "s2",
    title: "Weaving Memory in Kashmir",
    subtitle: "Threads, time, and a living archive",
    readTime: "4 min read",
    region: "South Asia",
    craft: "Textiles",
    hero: "https://images.unsplash.com/photo-1520975958225-53b13ab8f1a9?auto=format&fit=crop&w=1400&q=80",
    body: [
      "A loom is a kind of instrument—its music is repetition, its melody is pattern. The weavers of Kashmir work in a rhythm that predates memory, their fingers dancing across threads with practiced precision.",
      "In Kashmir, weaving becomes a language of memory, passed hand to hand. Patterns encode stories—of mountains, of seasons, of journeys taken and dreams deferred. Each shawl is a map of someone's life.",
      "Every motif is a map: of landscape, of seasons, of stories lived and told again. The finest Pashmina takes months to complete, a meditation in thread and time.",
    ],
    createdOn: "2026-01-18T09:00:00Z",
    updatedOn: "2026-01-18T09:00:00Z",
    author: "Arjun Singh",
    isPublished: true,
    source: "Textile Museum",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=textilemuseum.org",
    srcLink: "https://museum.gwu.edu/weaving-memory-kashmir",
  },
  {
    id: "s3",
    title: "The Indigo Masters of Japan",
    subtitle: "Where blue becomes infinite",
    readTime: "5 min read",
    region: "Japan",
    craft: "Textiles",
    hero: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=80",
    body: [
      "In the quiet workshops of Tokushima, indigo is not just a color—it's a living thing. The vats breathe, ferment, and transform over months of careful tending.",
      "Japanese indigo dyeing, or ai-zome, requires patience measured in years. Masters spend decades learning to read the subtle signs of a healthy vat, adjusting pH, temperature, and timing by instinct.",
      "The deepest blues require dozens of dips, each layer adding depth and complexity. What emerges is a color that seems to hold the sky itself.",
    ],
    createdOn: "2026-01-22T11:00:00Z",
    updatedOn: "2026-01-22T11:00:00Z",
    author: "Yuki Tanaka",
    isPublished: true,
    source: "Nippon.com",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=nippon.com",
    srcLink: "https://www.nippon.com/en/features/c04501/",
  },
  {
    id: "s4",
    title: "Bronze and Fire in Benin",
    subtitle: "A royal craft reborn",
    readTime: "7 min read",
    region: "West Africa",
    craft: "Metalwork",
    hero: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=1400&q=80",
    body: [
      "The bronze casters of Benin City continue a tradition that once served kings. Their lost-wax technique produces works of extraordinary detail and presence.",
      "Each piece begins with a wax model, painstakingly carved and then encased in clay. When bronze is poured, the wax melts away, leaving only metal memory.",
      "Today's artists honor their ancestors while pushing the form forward. Contemporary themes meet ancient techniques in works that speak across centuries.",
    ],
    createdOn: "2026-01-25T15:00:00Z",
    updatedOn: "2026-01-25T15:00:00Z",
    author: "Kofi Mensah",
    isPublished: true,
    source: "UNESCO",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=unesco.org",
    srcLink: "https://ich.unesco.org/en/RL/bronze-casting-in-benin-city-00001",
  },
];

export const SAMPLE_OPPS: Opportunity[] = [
  {
    id: "o1",
    title: "Craft Futures Fund",
    forLine: "For textile & craft practitioners",
    deadline: "12 Feb 2026",
    region: "Global",
    category: "Grant",
    about: "The Craft Futures Fund supports emerging and mid-career makers advancing craft traditions with contemporary practice. This initiative seeks to bridge traditional knowledge with modern innovation.",
    who: ["Individual makers", "Craft collectives", "Small studios"],
    offer: ["Grant funding up to $15,000", "Mentorship program", "Showcase opportunities"],
    linkLabel: "Apply on official site",
    createdOn: "2026-01-10T08:00:00Z",
    updatedOn: "2026-01-12T09:30:00Z",
    author: "Makerburg Editorial",
    isPublished: true,
    source: "Center for Craft",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=centerforcraft.org",
    srcLink: "https://www.centerforcraft.org/grants/craft-futures-fund",
  },
  {
    id: "o2",
    title: "Artist Residency Kyoto",
    forLine: "For traditional & contemporary artists",
    deadline: "5 Mar 2026",
    region: "Japan",
    category: "Residency",
    about: "A residency focused on studio practice, local craft immersion, and community exchange in Kyoto. Residents work alongside Japanese master craftspeople.",
    who: ["Artists & makers", "Crafters exploring materials", "Small teams (up to 2)"],
    offer: ["Studio access", "Accommodation provided", "Local mentorship", "Material stipend"],
    linkLabel: "View residency page",
    createdOn: "2026-01-15T12:00:00Z",
    updatedOn: "2026-01-15T12:00:00Z",
    author: "Makerburg Editorial",
    isPublished: true,
    source: "Kyoto Art Center",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=kac.or.jp",
    srcLink: "https://www.kac.or.jp/eng/residence/",
  },
  {
    id: "o3",
    title: "Emerging Makers Award",
    forLine: "For young craft innovators",
    deadline: "20 Apr 2026",
    region: "Europe",
    category: "Open Call",
    about: "An open call recognizing new voices in craft. Selected works will be featured in a traveling showcase across major European cultural centers.",
    who: ["Under 35 makers", "Recent graduates", "Self-taught creators"],
    offer: ["Prize funding of €5,000", "Exhibition slot", "Press visibility", "Catalog inclusion"],
    linkLabel: "Open call details",
    createdOn: "2026-01-20T10:00:00Z",
    updatedOn: "2026-01-20T10:00:00Z",
    author: "Makerburg Editorial",
    isPublished: true,
    source: "Loewe Foundation",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=loewe.com",
    srcLink: "https://craftprize.loewe.com/",
  },
  {
    id: "o4",
    title: "Indigenous Craft Scholarship",
    forLine: "For indigenous artisans worldwide",
    deadline: "1 Jun 2026",
    region: "Global",
    category: "Scholarship",
    about: "Supporting indigenous craft practitioners in preserving and evolving traditional techniques. Full funding for a year-long program.",
    who: ["Indigenous artisans", "Traditional craft keepers", "Community craft leaders"],
    offer: ["Full tuition coverage", "Living stipend", "Travel grant", "Materials budget"],
    linkLabel: "Learn more",
    createdOn: "2026-01-25T14:00:00Z",
    updatedOn: "2026-01-25T14:00:00Z",
    author: "Makerburg Editorial",
    isPublished: true,
    source: "First Peoples Fund",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=firstpeoplesfund.org",
    srcLink: "https://www.firstpeoplesfund.org/grants-fellowships",
  },
  {
    id: "o5",
    title: "Ceramic Arts Fellowship",
    forLine: "For ceramic artists at any stage",
    deadline: "15 Jul 2026",
    region: "United States",
    category: "Fellowship",
    about: "A prestigious fellowship offering ceramic artists time, space, and resources to develop ambitious new bodies of work.",
    who: ["Professional ceramicists", "Studio potters", "Sculptural artists"],
    offer: ["12-month fellowship", "Private studio", "Kiln access", "$24,000 stipend"],
    linkLabel: "Apply now",
    createdOn: "2026-02-01T09:00:00Z",
    updatedOn: "2026-02-01T09:00:00Z",
    author: "Makerburg Editorial",
    isPublished: true,
    source: "Archie Bray Foundation",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=archiebray.org",
    srcLink: "https://archiebray.org/residencies/fellowships/",
  },
];

export const SAMPLE_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Inside a Woodblock Printing Studio",
    duration: "1:20",
    region: "India",
    craft: "Printing",
    thumb: "https://images.unsplash.com/photo-1581349485608-9469926a8e5f?auto=format&fit=crop&w=1400&q=80",
    description: "A short look at the rhythm of block printing—hands, ink, and pattern in motion. Watch as generations of knowledge flow through careful movements.",
    createdOn: "2026-01-12T11:00:00Z",
    updatedOn: "2026-01-12T11:00:00Z",
    author: "Sanjay Gupta",
    isPublished: true,
    source: "YouTube",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=youtube.com",
    srcLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v2",
    title: "Clay, Water, Fire",
    duration: "2:10",
    region: "Mexico",
    craft: "Ceramics",
    thumb: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
    description: "From wet clay to fired form—how vessels move through transformation. A meditation on material and making.",
    createdOn: "2026-01-18T15:30:00Z",
    updatedOn: "2026-01-18T15:30:00Z",
    author: "Elena Rodriguez",
    isPublished: true,
    source: "Vimeo",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=vimeo.com",
    srcLink: "https://vimeo.com/123456789",
  },
  {
    id: "v3",
    title: "The Loom's Song",
    duration: "3:45",
    region: "Guatemala",
    craft: "Textiles",
    thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
    description: "Backstrap weaving in the highlands—where tradition meets the rhythm of daily life. Colors emerge from ancient patterns.",
    createdOn: "2026-01-22T10:00:00Z",
    updatedOn: "2026-01-22T10:00:00Z",
    author: "Maria Santos",
    isPublished: true,
    source: "National Geographic",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=nationalgeographic.com",
    srcLink: "https://www.nationalgeographic.com/video/the-looms-song",
  },
  {
    id: "v4",
    title: "Forging Damascus Steel",
    duration: "4:30",
    region: "Japan",
    craft: "Metalwork",
    thumb: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=80",
    description: "The ancient art of folding steel, layer upon layer. Heat, hammer, and patience create blades of legendary strength.",
    createdOn: "2026-01-28T14:00:00Z",
    updatedOn: "2026-01-28T14:00:00Z",
    author: "Hiroshi Sato",
    isPublished: true,
    source: "History Channel",
    srcFavIcon: "https://www.google.com/s2/favicons?sz=64&domain=history.com",
    srcLink: "https://www.history.com/shows/forged-in-fire/videos/damascus-steel",
  },
];

export const SAMPLE_CULTURE: CultureEntry[] = [
  {
    id: "c1",
    title: "Ajrak Printing",
    region: "Sindh, Pakistan",
    craft: "Textiles",
    hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
    intro: "A resist-dye printing tradition rooted in geometry, patience, and deep indigo tones. Ajrak is more than cloth—it's identity, ceremony, and belonging.",
    sections: [
      {
        h: "Origins & History",
        p: "Ajrak patterns have been found in the ancient Indus Valley civilization, making this one of the world's oldest continuous craft traditions. The name itself may derive from 'azrak,' the Arabic word for blue. For millennia, Ajrak has served as identity, gift, and ceremony—carried through time in cloth.",
      },
      {
        h: "Materials & Techniques",
        p: "Traditional Ajrak uses natural dyes—indigo for blue, madder for red—applied through a complex process of resist printing. Wood blocks carved with geometric patterns press a mud-resist mixture onto cloth. Multiple rounds of dyeing and washing reveal the final design. The process can take up to two weeks.",
      },
      {
        h: "Cultural Significance",
        p: "More than decoration, Ajrak is a marker of belonging and a living craft economy. It's given at births, weddings, and funerals. Men wear it as turbans; it drapes over shoulders in greeting. The geometric patterns are said to represent the cosmos, connecting wearers to something larger.",
      },
    ],
    createdOn: "2026-01-10T10:00:00Z",
    updatedOn: "2026-01-10T10:00:00Z",
    author: "Zainab Ali",
    isPublished: true,
  },
  {
    id: "c2",
    title: "Kintsugi",
    region: "Japan",
    craft: "Ceramics",
    hero: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=80",
    intro: "The Japanese art of repairing broken pottery with gold. Rather than hiding damage, Kintsugi celebrates it—transforming fractures into features.",
    sections: [
      {
        h: "Philosophy",
        p: "Kintsugi embodies the Japanese concept of wabi-sabi—finding beauty in imperfection. A broken bowl becomes more valuable after repair, its history visible in gleaming gold lines. The practice teaches acceptance of change and impermanence.",
      },
      {
        h: "Technique",
        p: "Traditional Kintsugi uses urushi lacquer mixed with powdered gold, silver, or platinum. The process requires patience—each layer must cure for days. Modern practitioners continue to use authentic materials, though some contemporary versions employ synthetic adhesives.",
      },
      {
        h: "Modern Practice",
        p: "Today, Kintsugi has become a metaphor for resilience. Artists worldwide apply its principles to ceramics, furniture, and even digital art. The message remains: our breaks and repairs are part of what makes us beautiful.",
      },
    ],
    createdOn: "2026-01-15T11:00:00Z",
    updatedOn: "2026-01-15T11:00:00Z",
    author: "Kenji Nakamura",
    isPublished: true,
  },
  {
    id: "c3",
    title: "Kilim Weaving",
    region: "Anatolia, Turkey",
    craft: "Textiles",
    hero: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1400&q=80",
    intro: "Flat-woven rugs that carry the stories of nomadic peoples. Each kilim is a document of place, tribe, and maker.",
    sections: [
      {
        h: "Nomadic Heritage",
        p: "Kilims evolved as practical floor coverings for tent-dwelling peoples. Lighter than pile rugs, they could be rolled and transported easily. The patterns encoded tribal identity—a kilim could tell you where a family came from.",
      },
      {
        h: "Symbolic Language",
        p: "Every motif carries meaning. The elibelinde represents fertility; the wolf's mouth offers protection. Weavers combine these symbols intuitively, creating textiles that speak in a visual language passed through generations.",
      },
      {
        h: "Contemporary Revival",
        p: "Young Turkish designers are reviving kilim traditions, working with village weavers to create contemporary pieces. The ancient craft finds new life in modern interiors, connecting global audiences to Anatolian heritage.",
      },
    ],
    createdOn: "2026-01-20T14:00:00Z",
    updatedOn: "2026-01-20T14:00:00Z",
    author: "Fatima Kaya",
    isPublished: true,
  },
];
