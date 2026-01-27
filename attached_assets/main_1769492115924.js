
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/**
 * Makerburg V1 Prototype (Expo / React Native)
 * - Optional login only for saving
 * - Local persistence for saved items
 * - Calm editorial UI (off-white, minimal)
 */

/** ---------- Types ---------- */
type Story = {
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
};

type Opportunity = {
  id: string;
  title: string;
  forLine: string;
  deadline: string;
  region: string;
  category: "Grant" | "Residency" | "Open Call" | "Scholarship";
  about: string;
  who: string[];
  offer: string[];
  linkLabel: string;
};

type Video = {
  id: string;
  title: string;
  duration: string;
  region: string;
  craft: string;
  thumb: string;
  description: string;
};

type CultureEntry = {
  id: string;
  title: string;
  region: string;
  craft: string;
  hero: string;
  intro: string;
  sections: { h: string; p: string }[];
};

/** ---------- Sample Data ---------- */
const SAMPLE_STORIES: Story[] = [
  {
    id: "s1",
    title: "The Hands That Shape Clay",
    subtitle: "A ceramic tradition from Oaxaca",
    readTime: "6 min read",
    region: "Mexico",
    craft: "Ceramics",
    hero:
      "https://images.unsplash.com/photo-1601713558325-9c2aa8d1d1ef?auto=format&fit=crop&w=1400&q=80",
    inlineImage:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
    body: [
      "In the hills of Oaxaca, the potter’s hands work with a rhythm as old as the earth itself.",
      "Clay is gathered, prepared, and shaped with patience—each vessel carrying the memory of place.",
      "Firing is both science and ceremony: heat, time, and intuition meet in a final transformation.",
      "What survives is not just an object, but a lineage—quietly handed down through generations.",
    ],
    cultureLinks: [
      { label: "Culture", value: "Oaxaca Ceramics" },
      { label: "Technique", value: "Hand-thrown Clay" },
    ],
  },
  {
    id: "s2",
    title: "Weaving Memory in Kashmir",
    subtitle: "Threads, time, and a living archive",
    readTime: "4 min read",
    region: "South Asia",
    craft: "Textiles",
    hero:
      "https://images.unsplash.com/photo-1520975958225-53b13ab8f1a9?auto=format&fit=crop&w=1400&q=80",
    body: [
      "A loom is a kind of instrument—its music is repetition, its melody is pattern.",
      "In Kashmir, weaving becomes a language of memory, passed hand to hand.",
      "Every motif is a map: of landscape, of seasons, of stories lived and told again.",
    ],
  },
];

const SAMPLE_OPPS: Opportunity[] = [
  {
    id: "o1",
    title: "Craft Futures Fund",
    forLine: "For textile & craft practitioners",
    deadline: "12 Feb 2026",
    region: "Global",
    category: "Grant",
    about:
      "The Craft Futures Fund supports emerging and mid-career makers advancing craft traditions with contemporary practice.",
    who: ["Individual makers", "Craft collectives", "Small studios"],
    offer: ["Grant funding", "Mentorship", "Showcase opportunities"],
    linkLabel: "Apply on official site",
  },
  {
    id: "o2",
    title: "Artist Residency Kyoto",
    forLine: "For traditional & contemporary artists",
    deadline: "5 Mar 2026",
    region: "Japan",
    category: "Residency",
    about:
      "A residency focused on studio practice, local craft immersion, and community exchange in Kyoto.",
    who: ["Artists & makers", "Crafters exploring materials", "Small teams (2)"],
    offer: ["Studio access", "Accommodation", "Local mentorship"],
    linkLabel: "View residency page",
  },
  {
    id: "o3",
    title: "Emerging Makers Award",
    forLine: "For young craft innovators",
    deadline: "20 Apr 2026",
    region: "Europe",
    category: "Open Call",
    about:
      "An open call recognizing new voices in craft. Selected works featured in a traveling showcase.",
    who: ["Under 35 makers", "Recent graduates", "Self-taught creators"],
    offer: ["Prize funding", "Exhibition slot", "Press visibility"],
    linkLabel: "Open call details",
  },
];

const SAMPLE_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Inside a Woodblock Printing Studio",
    duration: "1:20",
    region: "India",
    craft: "Printing",
    thumb:
      "https://images.unsplash.com/photo-1581349485608-9469926a8e5f?auto=format&fit=crop&w=1400&q=80",
    description:
      "A short look at the rhythm of block printing—hands, ink, and pattern in motion.",
  },
  {
    id: "v2",
    title: "Clay, Water, Fire",
    duration: "2:10",
    region: "Mexico",
    craft: "Ceramics",
    thumb:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
    description:
      "From wet clay to fired form—how vessels move through transformation.",
  },
];

const SAMPLE_CULTURE: CultureEntry[] = [
  {
    id: "c1",
    title: "Ajrak Printing",
    region: "Sindh, Pakistan",
    craft: "Textiles",
    hero:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
    intro:
      "A resist-dye printing tradition rooted in geometry, patience, and deep indigo tones.",
    sections: [
      {
        h: "Origins & History",
        p: "Ajrak patterns have long served as identity, gift, and ceremony—carried through time in cloth.",
      },
      {
        h: "Materials & Techniques",
        p: "Wood blocks, natural dyes, and layered resist processes create depth and symmetry.",
      },
      {
        h: "Cultural Significance",
        p: "More than decoration, Ajrak is a marker of belonging and a living craft economy.",
      },
    ],
  },
];

/** ---------- Storage Keys ---------- */
const KEY_AUTH = "makerburg_auth_v1";
const KEY_SAVED = "makerburg_saved_v1";

/** ---------- Saved Model ---------- */
type SavedItem =
  | { kind: "story"; id: string }
  | { kind: "opportunity"; id: string }
  | { kind: "video"; id: string }
  | { kind: "culture"; id: string };

type SavedState = {
  items: SavedItem[];
};

function uniqSaved(items: SavedItem[]) {
  const seen = new Set<string>();
  return items.filter((it) => {
    const k = `${it.kind}:${it.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** ---------- Theme ---------- */
const theme = {
  bg: "#F6F2EC", // soft ivory
  card: "#FFFFFF",
  text: "#111111",
  subtext: "#4B4B4B",
  hairline: "rgba(0,0,0,0.08)",
  accent: "#2E2A24", // muted near-black
  pill: "#EFE8DF",
};

/** ---------- Navigation ---------- */
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const StoriesStack = createNativeStackNavigator();
const OppStack = createNativeStackNavigator();
const WatchStack = createNativeStackNavigator();
const CultureStack = createNativeStackNavigator();

/** ---------- Auth + Saved Context (simple) ---------- */
function useAppState() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [saved, setSaved] = useState<SavedState>({ items: [] });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem(KEY_AUTH);
      setLoggedIn(auth === "1");
      const raw = await AsyncStorage.getItem(KEY_SAVED);
      if (raw) setSaved(JSON.parse(raw));
      setAuthReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    AsyncStorage.setItem(KEY_AUTH, loggedIn ? "1" : "0");
  }, [loggedIn, authReady]);

  useEffect(() => {
    if (!authReady) return;
    AsyncStorage.setItem(KEY_SAVED, JSON.stringify(saved));
  }, [saved, authReady]);

  const toggleSave = (item: SavedItem) => {
    const key = `${item.kind}:${item.id}`;
    const has = saved.items.some((x) => `${x.kind}:${x.id}` === key);
    setSaved((prev) => ({
      items: has
        ? prev.items.filter((x) => `${x.kind}:${x.id}` !== key)
        : uniqSaved([item, ...prev.items]),
    }));
  };

  const isSaved = (item: SavedItem) =>
    saved.items.some((x) => x.kind === item.kind && x.id === item.id);

  return { loggedIn, setLoggedIn, saved, toggleSave, isSaved, authReady };
}

/** ---------- Shared Components ---------- */
function TopBar({
  title,
  onPressBookmark,
}: {
  title: string;
  onPressBookmark: () => void;
}) {
  return (
    <View style={styles.topBar}>
      <Text style={styles.topTitle}>{title}</Text>
      <Pressable onPress={onPressBookmark} hitSlop={12}>
        <Text style={styles.bookmarkIcon}>🔖</Text>
      </Pressable>
    </View>
  );
}

function SectionTitle({ label, right }: { label: string; right?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{label}</Text>
      {right ? <Text style={styles.sectionRight}>{right}</Text> : null}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Hairline() {
  return <View style={styles.hairline} />;
}

/** ---------- Login Modal ---------- */
function LoginModal({
  visible,
  onClose,
  onLogin,
}: {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (!visible) setEmail("");
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Save to your Library</Text>
          <Text style={styles.modalSub}>
            Optional login — only needed to save bookmarks.
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email (optional for demo)"
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={{ height: 10 }} />

          <Pressable
            onPress={() => {
              // Demo login
              onLogin();
              onClose();
            }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Sign in & Continue</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/** ---------- Library Screen ---------- */
function LibraryScreen({
  app,
  navigation,
}: {
  app: ReturnType<typeof useAppState>;
  navigation: any;
}) {
  const stories = useMemo(
    () =>
      app.saved.items
        .filter((i) => i.kind === "story")
        .map((i) => SAMPLE_STORIES.find((s) => s.id === i.id))
        .filter(Boolean) as Story[],
    [app.saved.items]
  );

  const opps = useMemo(
    () =>
      app.saved.items
        .filter((i) => i.kind === "opportunity")
        .map((i) => SAMPLE_OPPS.find((o) => o.id === i.id))
        .filter(Boolean) as Opportunity[],
    [app.saved.items]
  );

  const vids = useMemo(
    () =>
      app.saved.items
        .filter((i) => i.kind === "video")
        .map((i) => SAMPLE_VIDEOS.find((v) => v.id === i.id))
        .filter(Boolean) as Video[],
    [app.saved.items]
  );

  const culture = useMemo(
    () =>
      app.saved.items
        .filter((i) => i.kind === "culture")
        .map((i) => SAMPLE_CULTURE.find((c) => c.id === i.id))
        .filter(Boolean) as CultureEntry[],
    [app.saved.items]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.page}>
        <Text style={styles.h1}>Library</Text>
        <Text style={styles.muted}>
          Saved stories, opportunities, videos, and culture entries.
        </Text>

        <View style={{ height: 12 }} />

        <SectionTitle label="Stories" />
        {stories.length === 0 ? (
          <Text style={styles.empty}>No saved stories yet.</Text>
        ) : (
          stories.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => navigation.navigate("StoryDetail", { id: s.id })}
              style={{ marginBottom: 10 }}
            >
              <Card>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Text style={styles.cardMeta}>
                  {s.readTime} • {s.region} • {s.craft}
                </Text>
              </Card>
            </Pressable>
          ))
        )}

        <View style={{ height: 10 }} />
        <SectionTitle label="Opportunities" />
        {opps.length === 0 ? (
          <Text style={styles.empty}>No saved opportunities yet.</Text>
        ) : (
          opps.map((o) => (
            <Pressable
              key={o.id}
              onPress={() =>
                navigation.navigate("OpportunityDetail", { id: o.id })
              }
              style={{ marginBottom: 10 }}
            >
              <Card>
                <Text style={styles.cardTitle}>{o.title}</Text>
                <Text style={styles.cardMeta}>
                  Deadline: {o.deadline} • {o.region} • {o.category}
                </Text>
              </Card>
            </Pressable>
          ))
        )}

        <View style={{ height: 10 }} />
        <SectionTitle label="Watch" />
        {vids.length === 0 ? (
          <Text style={styles.empty}>No saved videos yet.</Text>
        ) : (
          vids.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => navigation.navigate("VideoDetail", { id: v.id })}
              style={{ marginBottom: 10 }}
            >
              <Card>
                <Text style={styles.cardTitle}>{v.title}</Text>
                <Text style={styles.cardMeta}>
                  {v.duration} • {v.region} • {v.craft}
                </Text>
              </Card>
            </Pressable>
          ))
        )}

        <View style={{ height: 10 }} />
        <SectionTitle label="Culture" />
        {culture.length === 0 ? (
          <Text style={styles.empty}>No saved culture entries yet.</Text>
        ) : (
          culture.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => navigation.navigate("CultureEntry", { id: c.id })}
              style={{ marginBottom: 10 }}
            >
              <Card>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardMeta}>
                  {c.region} • {c.craft}
                </Text>
              </Card>
            </Pressable>
          ))
        )}

        <View style={{ height: 24 }} />
        <Pressable
          onPress={() => {
            app.setLoggedIn(false);
            Alert.alert("Signed out", "You are now logged out.");
          }}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryBtnText}>Sign out</Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

/** ---------- Home ---------- */
function HomeScreen({ navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);

  const ensureLogin = () => {
    if (!app.loggedIn) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  const hero = SAMPLE_STORIES[0];
  const opp = SAMPLE_OPPS[0];
  const picks = SAMPLE_STORIES.slice(0, 2);
  const watch = SAMPLE_VIDEOS[0];
  const culture = SAMPLE_CULTURE[0];

  const onBookmark = () => {
    if (!app.loggedIn) setLoginOpen(true);
    else navigation.navigate("Library");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBar title="Makerburg" onPressBookmark={onBookmark} />

      <ScrollView>
        <Pressable onPress={() => navigation.navigate("StoryDetail", { id: hero.id })}>
          <Image source={{ uri: hero.hero }} style={styles.heroImage} />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>{hero.title}</Text>
            <Text style={styles.heroSub}>{hero.subtitle}</Text>
            <Text style={styles.heroMeta}>{hero.readTime}</Text>
          </View>
        </Pressable>

        <View style={styles.page}>
          <SectionTitle label="Opportunities" right="→" />
          <Pressable onPress={() => navigation.navigate("Opportunities", { screen: "OpportunitiesList" })} />

          <Pressable
            onPress={() =>
              navigation.navigate("OpportunityDetail", { id: opp.id })
            }
            style={{ marginBottom: 14 }}
          >
            <Card>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.cardTitle}>{opp.title}</Text>
                  <Text style={styles.cardSub}>{opp.forLine}</Text>
                  <Text style={styles.cardMeta}>
                    Deadline: {opp.deadline} • {opp.region}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    if (!ensureLogin()) return;
                    app.toggleSave({ kind: "opportunity", id: opp.id });
                  }}
                  hitSlop={12}
                >
                  <Text style={styles.saveIcon}>
                    {app.isSaved({ kind: "opportunity", id: opp.id }) ? "🔖" : "📑"}
                  </Text>
                </Pressable>
              </View>
            </Card>
          </Pressable>

          <SectionTitle label="Editor’s Picks" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {picks.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => navigation.navigate("StoryDetail", { id: s.id })}
                style={{ marginRight: 12 }}
              >
                <View style={styles.pickCard}>
                  <Image source={{ uri: s.hero }} style={styles.pickImage} />
                  <View style={{ padding: 10 }}>
                    <Text style={styles.pickTitle} numberOfLines={2}>
                      {s.title}
                    </Text>
                    <Text style={styles.pickMeta}>{s.readTime}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ height: 18 }} />

          <SectionTitle label="Watch" right="→" />
          <Pressable
            onPress={() => navigation.navigate("VideoDetail", { id: watch.id })}
          >
            <View style={styles.videoPreview}>
              <Image source={{ uri: watch.thumb }} style={styles.videoThumb} />
              <View style={styles.playBadge}>
                <Text style={styles.playBadgeText}>▶</Text>
              </View>
              <Text style={styles.durationBadge}>{watch.duration}</Text>
            </View>
            <Text style={styles.cardTitle}>{watch.title}</Text>
            <Text style={styles.cardMeta}>
              {watch.region} • {watch.craft}
            </Text>
          </Pressable>

          <View style={{ height: 18 }} />

          <SectionTitle label="From the Culture Atlas" right="→" />
          <Pressable
            onPress={() => navigation.navigate("CultureEntry", { id: culture.id })}
          >
            <Card>
              <Text style={styles.cardTitle}>{culture.title}</Text>
              <Text style={styles.cardMeta}>
                {culture.region} • {culture.craft}
              </Text>
            </Card>
          </Pressable>

          <View style={{ height: 18 }} />
          <Text style={styles.footerHint}>
            Explore more • Stories • Opportunities • Culture
          </Text>

          <View style={{ height: 28 }} />
        </View>
      </ScrollView>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

/** ---------- Stories ---------- */
function StoriesListScreen({ navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);

  const onBookmark = () => {
    if (!app.loggedIn) setLoginOpen(true);
    else navigation.navigate("Library");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBar title="Stories" onPressBookmark={onBookmark} />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        data={SAMPLE_STORIES}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Hairline}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("StoryDetail", { id: item.id })}
            style={{ paddingVertical: 14 }}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.subtitle}</Text>
            <Text style={styles.cardMeta}>
              {item.readTime} • {item.region} • {item.craft}
            </Text>
          </Pressable>
        )}
      />

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

function StoryDetailScreen({ route, navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);
  const { id } = route.params;
  const story = SAMPLE_STORIES.find((s) => s.id === id);

  if (!story) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text>Story not found</Text>
      </View>
    );
  }

  const ensureLogin = () => {
    if (!app.loggedIn) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Image source={{ uri: story.hero }} style={styles.detailHero} />

        <View style={styles.page}>
          <Text style={styles.detailTitle}>{story.title}</Text>
          <Text style={styles.detailSub}>{story.subtitle}</Text>
          <Text style={styles.detailMeta}>
            {story.readTime} • {story.region} • {story.craft}
          </Text>

          <Pressable
            onPress={() => {
              if (!ensureLogin()) return;
              app.toggleSave({ kind: "story", id: story.id });
            }}
            style={styles.saveRow}
          >
            <Text style={styles.saveRowText}>
              {app.isSaved({ kind: "story", id: story.id }) ? "🔖 Saved" : "🔖 Save"}
            </Text>
          </Pressable>

          <View style={{ height: 10 }} />

          {story.body.map((p, idx) => (
            <Text key={idx} style={styles.paragraph}>
              {p}
            </Text>
          ))}

          {story.inlineImage ? (
            <>
              <Image source={{ uri: story.inlineImage }} style={styles.inlineImg} />
              <Text style={styles.caption}>Traditional pottery drying in the sun.</Text>
            </>
          ) : null}

          {story.cultureLinks ? (
            <View style={styles.contextBox}>
              <Text style={styles.contextTitle}>About the craft</Text>
              <Text style={styles.contextText}>
                Cultural practices often hold centuries of technique, identity, and place—quietly
                preserved through making.
              </Text>

              <View style={styles.pillRow}>
                {story.cultureLinks.map((l) => (
                  <View key={l.value} style={styles.pill}>
                    <Text style={styles.pillText}>
                      {l.label}: {l.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={{ height: 18 }} />
          <Text style={styles.endStory}>— End of Story —</Text>

          <View style={{ height: 26 }} />
        </View>
      </ScrollView>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

/** ---------- Opportunities ---------- */
function OpportunitiesListScreen({ navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [filter, setFilter] = useState<
    "All" | "Grant" | "Residency" | "Open Call" | "Scholarship"
  >("All");

  const filtered = useMemo(() => {
    if (filter === "All") return SAMPLE_OPPS;
    return SAMPLE_OPPS.filter((o) => o.category === filter);
  }, [filter]);

  const ensureLogin = () => {
    if (!app.loggedIn) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  const onBookmark = () => {
    if (!app.loggedIn) setLoginOpen(true);
    else navigation.navigate("Library");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBar title="Opportunities" onPressBookmark={onBookmark} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(["All", "Grant", "Residency", "Open Call", "Scholarship"] as const).map(
          (x) => (
            <Pressable
              key={x}
              onPress={() => setFilter(x)}
              style={[
                styles.filterPill,
                filter === x && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === x && styles.filterTextActive,
                ]}
              >
                {x}
              </Text>
            </Pressable>
          )
        )}
      </ScrollView>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        data={filtered}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("OpportunityDetail", { id: item.id })
            }
          >
            <Card>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSub}>{item.forLine}</Text>
                  <Text style={styles.cardMeta}>
                    Deadline: {item.deadline} • {item.region} • {item.category}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    if (!ensureLogin()) return;
                    app.toggleSave({ kind: "opportunity", id: item.id });
                  }}
                  hitSlop={12}
                >
                  <Text style={styles.saveIcon}>
                    {app.isSaved({ kind: "opportunity", id: item.id }) ? "🔖" : "📑"}
                  </Text>
                </Pressable>
              </View>
            </Card>
          </Pressable>
        )}
      />

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

function OpportunityDetailScreen({ route, navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);
  const { id } = route.params;
  const opp = SAMPLE_OPPS.find((o) => o.id === id);

  if (!opp) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text>Opportunity not found</Text>
      </View>
    );
  }

  const ensureLogin = () => {
    if (!app.loggedIn) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.page}>
          <Text style={styles.detailTitle}>{opp.title}</Text>

          <Text style={styles.detailMeta}>
            Deadline: {opp.deadline} • {opp.region} • {opp.category}
          </Text>

          <View style={{ height: 12 }} />
          <Text style={styles.h2}>About this opportunity</Text>
          <Text style={styles.paragraph}>{opp.about}</Text>

          <Text style={styles.h2}>Who can apply</Text>
          {opp.who.map((x) => (
            <Text key={x} style={styles.bullet}>
              • {x}
            </Text>
          ))}

          <View style={{ height: 8 }} />
          <Text style={styles.h2}>What’s offered</Text>
          {opp.offer.map((x) => (
            <Text key={x} style={styles.bullet}>
              • {x}
            </Text>
          ))}

          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <View style={styles.stickyActions}>
        <Pressable
          onPress={() => {
            if (!ensureLogin()) return;
            app.toggleSave({ kind: "opportunity", id: opp.id });
          }}
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}>
            {app.isSaved({ kind: "opportunity", id: opp.id }) ? "Saved 🔖" : "Save"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => Alert.alert("External Link", opp.linkLabel)}
          style={[styles.actionBtn, styles.actionBtnPrimary]}
        >
          <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>
            Apply Externally →
          </Text>
        </Pressable>
      </View>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

/** ---------- Watch ---------- */
function WatchScreen({ navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);

  const onBookmark = () => {
    if (!app.loggedIn) setLoginOpen(true);
    else navigation.navigate("Library");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBar title="Watch" onPressBookmark={onBookmark} />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        data={SAMPLE_VIDEOS}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("VideoDetail", { id: item.id })}>
            <View style={styles.videoCard}>
              <Image source={{ uri: item.thumb }} style={styles.videoThumbLarge} />
              <View style={styles.playBadgeLarge}>
                <Text style={styles.playBadgeText}>▶</Text>
              </View>
              <Text style={styles.durationBadgeLarge}>{item.duration}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.region} • {item.craft}
            </Text>
          </Pressable>
        )}
      />

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

function VideoDetailScreen({ route, navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);
  const { id } = route.params;
  const vid = SAMPLE_VIDEOS.find((v) => v.id === id);

  if (!vid) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text>Video not found</Text>
      </View>
    );
  }

  const ensureLogin = () => {
    if (!app.loggedIn) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.videoCard}>
          <Image source={{ uri: vid.thumb }} style={styles.videoThumbLarge} />
          <View style={styles.playBadgeLarge}>
            <Text style={styles.playBadgeText}>▶</Text>
          </View>
          <Text style={styles.durationBadgeLarge}>{vid.duration}</Text>
        </View>

        <View style={styles.page}>
          <Text style={styles.detailTitle}>{vid.title}</Text>
          <Text style={styles.detailMeta}>
            {vid.region} • {vid.craft}
          </Text>

          <Pressable
            onPress={() => {
              if (!ensureLogin()) return;
              app.toggleSave({ kind: "video", id: vid.id });
            }}
            style={styles.saveRow}
          >
            <Text style={styles.saveRowText}>
              {app.isSaved({ kind: "video", id: vid.id }) ? "🔖 Saved" : "🔖 Save"}
            </Text>
          </Pressable>

          <Text style={styles.paragraph}>{vid.description}</Text>
          <Text style={styles.muted}>
            (Video playback is mocked in this prototype. Next step is integrating an actual player.)
          </Text>

          <View style={{ height: 28 }} />
        </View>
      </ScrollView>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

/** ---------- Culture ---------- */
function CultureScreen({ navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);

  const onBookmark = () => {
    if (!app.loggedIn) setLoginOpen(true);
    else navigation.navigate("Library");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBar title="Culture" onPressBookmark={onBookmark} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.page}>
          <SectionTitle label="Explore by Region" />
          <View style={styles.grid}>
            {["South Asia", "East Asia", "Africa", "Europe", "Americas", "Middle East"].map((r) => (
              <Pressable
                key={r}
                style={styles.gridItem}
                onPress={() => Alert.alert("Region", r)}
              >
                <Text style={styles.gridText}>{r}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ height: 12 }} />
          <SectionTitle label="Explore by Craft" />
          <View style={styles.grid}>
            {["Textiles", "Ceramics", "Woodwork", "Metal", "Printing", "Leather"].map((c) => (
              <Pressable
                key={c}
                style={styles.gridItem}
                onPress={() => Alert.alert("Craft", c)}
              >
                <Text style={styles.gridText}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ height: 16 }} />
          <SectionTitle label="Featured" />
          <Pressable onPress={() => navigation.navigate("CultureEntry", { id: "c1" })}>
            <View style={styles.featuredCulture}>
              <Image source={{ uri: SAMPLE_CULTURE[0].hero }} style={styles.featuredCultureImg} />
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{SAMPLE_CULTURE[0].title}</Text>
                <Text style={styles.featuredSub}>{SAMPLE_CULTURE[0].region}</Text>
              </View>
            </View>
          </Pressable>

          <View style={{ height: 26 }} />
        </View>
      </ScrollView>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

function CultureEntryScreen({ route, navigation, app }: any) {
  const [loginOpen, setLoginOpen] = useState(false);
  const { id } = route.params;
  const entry = SAMPLE_CULTURE.find((c) => c.id === id);

  if (!entry) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text>Culture entry not found</Text>
      </View>
    );
  }

  const ensureLogin = () => {
    if (!app.loggedIn) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Image source={{ uri: entry.hero }} style={styles.detailHero} />

        <View style={styles.page}>
          <Text style={styles.detailTitle}>{entry.title}</Text>
          <Text style={styles.detailMeta}>
            {entry.region} • {entry.craft}
          </Text>

          <Pressable
            onPress={() => {
              if (!ensureLogin()) return;
              app.toggleSave({ kind: "culture", id: entry.id });
            }}
            style={styles.saveRow}
          >
            <Text style={styles.saveRowText}>
              {app.isSaved({ kind: "culture", id: entry.id }) ? "🔖 Saved" : "🔖 Save"}
            </Text>
          </Pressable>

          <Text style={styles.paragraph}>{entry.intro}</Text>

          {entry.sections.map((s) => (
            <View key={s.h} style={{ marginTop: 12 }}>
              <Text style={styles.h2}>{s.h}</Text>
              <Text style={styles.paragraph}>{s.p}</Text>
            </View>
          ))}

          <View style={{ height: 28 }} />
        </View>
      </ScrollView>

      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => app.setLoggedIn(true)}
      />
    </View>
  );
}

/** ---------- Tab Stacks ---------- */
function HomeStackNav({ app }: any) {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain">
        {(props) => <HomeScreen {...props} app={app} />}
      </HomeStack.Screen>

      <HomeStack.Screen name="StoryDetail">
        {(props) => <StoryDetailScreen {...props} app={app} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="OpportunityDetail">
        {(props) => <OpportunityDetailScreen {...props} app={app} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="VideoDetail">
        {(props) => <VideoDetailScreen {...props} app={app} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="CultureEntry">
        {(props) => <CultureEntryScreen {...props} app={app} />}
      </HomeStack.Screen>

      <HomeStack.Screen name="Library">
        {(props) => <LibraryScreen {...props} app={app} />}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

function StoriesStackNav({ app }: any) {
  return (
    <StoriesStack.Navigator screenOptions={{ headerShown: false }}>
      <StoriesStack.Screen name="StoriesList">
        {(props) => <StoriesListScreen {...props} app={app} />}
      </StoriesStack.Screen>
      <StoriesStack.Screen name="StoryDetail">
        {(props) => <StoryDetailScreen {...props} app={app} />}
      </StoriesStack.Screen>
      <StoriesStack.Screen name="Library">
        {(props) => <LibraryScreen {...props} app={app} />}
      </StoriesStack.Screen>
    </StoriesStack.Navigator>
  );
}

function OppStackNav({ app }: any) {
  return (
    <OppStack.Navigator screenOptions={{ headerShown: false }}>
      <OppStack.Screen name="OpportunitiesList">
        {(props) => <OpportunitiesListScreen {...props} app={app} />}
      </OppStack.Screen>
      <OppStack.Screen name="OpportunityDetail">
        {(props) => <OpportunityDetailScreen {...props} app={app} />}
      </OppStack.Screen>
      <OppStack.Screen name="Library">
        {(props) => <LibraryScreen {...props} app={app} />}
      </OppStack.Screen>
    </OppStack.Navigator>
  );
}

function WatchStackNav({ app }: any) {
  return (
    <WatchStack.Navigator screenOptions={{ headerShown: false }}>
      <WatchStack.Screen name="WatchList">
        {(props) => <WatchScreen {...props} app={app} />}
      </WatchStack.Screen>
      <WatchStack.Screen name="VideoDetail">
        {(props) => <VideoDetailScreen {...props} app={app} />}
      </WatchStack.Screen>
      <WatchStack.Screen name="Library">
        {(props) => <LibraryScreen {...props} app={app} />}
      </WatchStack.Screen>
    </WatchStack.Navigator>
  );
}

function CultureStackNav({ app }: any) {
  return (
    <CultureStack.Navigator screenOptions={{ headerShown: false }}>
      <CultureStack.Screen name="CultureMain">
        {(props) => <CultureScreen {...props} app={app} />}
      </CultureStack.Screen>
      <CultureStack.Screen name="CultureEntry">
        {(props) => <CultureEntryScreen {...props} app={app} />}
      </CultureStack.Screen>
      <CultureStack.Screen name="Library">
        {(props) => <LibraryScreen {...props} app={app} />}
      </CultureStack.Screen>
    </CultureStack.Navigator>
  );
}

/** ---------- Tabs ---------- */
function Tabs({ app }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.hairline,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 22 : 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="Home">{() => <HomeStackNav app={app} />}</Tab.Screen>
      <Tab.Screen name="Stories">{() => <StoriesStackNav app={app} />}</Tab.Screen>
      <Tab.Screen name="Opportunities">{() => <OppStackNav app={app} />}</Tab.Screen>
      <Tab.Screen name="Watch">{() => <WatchStackNav app={app} />}</Tab.Screen>
      <Tab.Screen name="Culture">{() => <CultureStackNav app={app} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

/** ---------- App ---------- */
export default function App() {
  const app = useAppState();

  if (!app.authReady) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={styles.muted}>Loading Makerburg…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs">{() => <Tabs app={app} />}</RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  topBar: {
    paddingTop: Platform.OS === "ios" ? 58 : 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: theme.bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topTitle: {
    fontSize: 24,
    letterSpacing: 0.2,
    color: theme.text,
    fontWeight: "600",
  },
  bookmarkIcon: { fontSize: 18 },

  page: { padding: 16 },

  h1: { fontSize: 28, fontWeight: "600", color: theme.text },
  h2: { fontSize: 16, fontWeight: "600", color: theme.text, marginTop: 12 },
  muted: { color: theme.subtext, marginTop: 6, lineHeight: 20 },
  empty: { color: theme.subtext, paddingVertical: 10 },

  sectionRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
  sectionRight: { color: theme.subtext },

  heroImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#ddd",
  },
  heroTextWrap: { padding: 16 },
  heroTitle: { fontSize: 26, fontWeight: "700", color: theme.text },
  heroSub: { fontSize: 14, color: theme.subtext, marginTop: 6 },
  heroMeta: { fontSize: 12, color: theme.subtext, marginTop: 10 },

  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.hairline,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
  cardSub: { fontSize: 13, color: theme.subtext, marginTop: 4 },
  cardMeta: { fontSize: 12, color: theme.subtext, marginTop: 8 },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  saveIcon: { fontSize: 18 },

  pickCard: {
    width: 220,
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.hairline,
  },
  pickImage: { width: "100%", height: 120, backgroundColor: "#ddd" },
  pickTitle: { fontSize: 14, fontWeight: "600", color: theme.text },
  pickMeta: { fontSize: 12, color: theme.subtext, marginTop: 6 },

  videoPreview: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.hairline,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  videoThumb: { width: "100%", height: 200 },
  playBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  playBadgeText: { color: "white", fontWeight: "700" },
  durationBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
  },

  footerHint: { color: theme.subtext, textAlign: "center" },

  hairline: { height: 1, backgroundColor: theme.hairline },

  backRow: { paddingTop: Platform.OS === "ios" ? 58 : 18, paddingHorizontal: 16, paddingBottom: 10 },
  backText: { color: theme.subtext, fontSize: 14 },

  detailHero: { width: "100%", height: 320, backgroundColor: "#ddd" },
  detailTitle: { fontSize: 28, fontWeight: "700", color: theme.text, marginTop: 6 },
  detailSub: { fontSize: 14, color: theme.subtext, marginTop: 8 },
  detailMeta: { fontSize: 12, color: theme.subtext, marginTop: 10 },

  saveRow: { marginTop: 14, alignSelf: "flex-end" },
  saveRowText: { color: theme.text, fontWeight: "600" },

  paragraph: { color: theme.text, lineHeight: 24, fontSize: 16, marginTop: 12 },
  caption: { color: theme.subtext, fontSize: 12, marginTop: 8 },
  inlineImg: { width: "100%", height: 220, borderRadius: 16, marginTop: 16, backgroundColor: "#ddd" },

  contextBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.hairline,
    backgroundColor: theme.pill,
  },
  contextTitle: { fontWeight: "700", color: theme.text, marginBottom: 6 },
  contextText: { color: theme.subtext, lineHeight: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 8 },
  pill: { backgroundColor: theme.card, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: theme.hairline },
  pillText: { color: theme.text, fontSize: 12 },

  endStory: { color: theme.subtext, textAlign: "center", marginTop: 18 },

  filterRow: { paddingHorizontal: 16, paddingBottom: 10 },
  filterPill: {
    backgroundColor: theme.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.hairline,
  },
  filterPillActive: { backgroundColor: theme.text },
  filterText: { color: theme.text, fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: "white" },

  stickyActions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: theme.bg,
    borderTopWidth: 1,
    borderTopColor: theme.hairline,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.hairline,
    backgroundColor: theme.card,
  },
  actionBtnPrimary: { backgroundColor: theme.text, borderColor: theme.text },
  actionBtnText: { fontWeight: "700", color: theme.text },
  actionBtnPrimaryText: { color: "white" },

  videoCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.hairline,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  videoThumbLarge: { width: "100%", height: 260 },
  playBadgeLarge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  durationBadgeLarge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: {
    width: "48%",
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.hairline,
  },
  gridText: { color: theme.text, fontWeight: "700" },

  featuredCulture: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.hairline,
  },
  featuredCultureImg: { width: "100%", height: 200 },
  featuredOverlay: {
    position: "absolute",
    left: 12,
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 12,
    borderRadius: 14,
  },
  featuredTitle: { color: "white", fontWeight: "800", fontSize: 18 },
  featuredSub: { color: "white", marginTop: 4, opacity: 0.9 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.hairline,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: theme.text },
  modalSub: { color: theme.subtext, marginTop: 6, lineHeight: 20 },
  input: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: theme.hairline,
    borderRadius: 14,
    padding: 12,
    color: theme.text,
    backgroundColor: theme.bg,
  },
  primaryBtn: {
    backgroundColor: theme.text,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "800" },
  secondaryBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.hairline,
    backgroundColor: theme.card,
  },
  secondaryBtnText: { color: theme.text, fontWeight: "700" },
});


