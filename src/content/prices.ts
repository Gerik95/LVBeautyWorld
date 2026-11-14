export type PriceKind = "fixed" | "from";

export type PriceItem = {
  id: string;
  categoryId: string;
  de: string;
  uk: string;
  amount: number;
  kind: PriceKind;
  /** Shown on the matching service detail page. */
  serviceIds: string[];
};

export type PriceCategory = {
  id: string;
  de: string;
  uk: string;
};

export const priceCategories: PriceCategory[] = [
  { id: "skin", de: "Kosmetik & Haut", uk: "Догляд за шкірою" },
  { id: "lash-ext", de: "Wimpernverlängerung", uk: "Нарощування вій" },
  { id: "nails", de: "Nägel, Hände & Füße", uk: "Манікюр і педикюр" },
  { id: "hair", de: "Haar", uk: "Волосся" },
  { id: "pmu", de: "Permanent Make-up", uk: "Перманентний макіяж" },
  { id: "brows-lift", de: "Lifting, Brauen & Wimpern", uk: "Ліфтинг, брови та вії" },
  { id: "laser-w", de: "Laser Haarentfernung — Damen", uk: "Лазерна епіляція — жінки" },
  { id: "laser-m", de: "Laser Haarentfernung — Herren", uk: "Лазерна епіляція — чоловіки" },
  { id: "laser-pkg-w", de: "Laser-Pakete — Damen", uk: "Лазерні пакети — жінки" },
  { id: "laser-pkg-m", de: "Laser-Pakete — Herren", uk: "Лазерні пакети — чоловіки" },
  { id: "aesthetic", de: "Ästhetische Gesichtsbehandlung", uk: "Естетика обличчя" },
  { id: "styling", de: "Make-up & Haarstyling", uk: "Макіяж і укладка" },
];

const p = (
  id: string,
  categoryId: string,
  de: string,
  uk: string,
  amount: number,
  serviceIds: string[],
  kind: PriceKind = "fixed",
): PriceItem => ({ id, categoryId, de, uk, amount, kind, serviceIds });

/** Confirmed Salonkee list. Never includes 0 € placeholders. */
export const prices: PriceItem[] = [
  p("skin-consult", "skin", "Beratung", "Консультація", 30, ["skin"]),
  p("skin-hydra", "skin", "Aqua Peeling Hydrafacial", "Aqua Peeling Hydrafacial", 130, ["skin"]),
  p("skin-deep", "skin", "Manuelle Tiefenreinigung", "Ручна глибока чистка", 120, ["skin"]),
  p("skin-enzyme", "skin", "Fast Beauty mit Enzymen", "Fast Beauty з ензимами", 85, ["skin"]),
  p("skin-sos", "skin", "Fast Beauty SOS Programm", "Fast Beauty SOS", 80, ["skin"]),
  p("skin-sensitive", "skin", "Sensitive Beauty Programm", "Sensitive Beauty", 95, ["skin"]),
  p("skin-hydrate", "skin", "Intense Hydration", "Intense Hydration", 150, ["skin"]),
  p("skin-meso", "skin", "Meso / Bio-Revitalisierung / Microneedling", "Мезо / біоревіталізація / мікронідлінг", 200, ["skin"]),
  p("skin-hibiscus", "skin", "Hibiscus Flower Mandelic Peel", "Мигдальний пілінг Hibiscus", 110, ["skin"]),
  p("skin-mango", "skin", "Depigmentierender Mangobrite Resurfacer", "Пілінг Mangobrite від пігментації", 110, ["skin"]),
  p("skin-jessner", "skin", "Modifiziertes Jessner-Peeling", "Модифікований пілінг Джесснера", 100, ["skin"]),
  p("skin-botox-peel", "skin", "Verjüngungspeeling mit Botox-Effekt", "Пілінг з ефектом ботоксу", 120, ["skin"]),
  p("skin-lactic", "skin", "Lactic Acid Resurfacer", "Молочний пілінг", 110, ["skin"]),
  p("skin-salicylic", "skin", "Salicylic Acid Resurfacer", "Саліциловий пілінг", 110, ["skin"]),
  p("skin-aftersun", "skin", "After Sun Skin Reset", "After Sun Skin Reset", 70, ["skin"]),

  p("le-classic", "lash-ext", "Classic Lashes / Wet Lashes", "Classic / Wet Lashes", 100, ["lash-extensions"]),
  p("le-refill", "lash-ext", "Auffüllen (21 Tage)", "Корекція (21 день)", 80, ["lash-extensions"]),
  p("le-remove", "lash-ext", "Komplettes Entfernen", "Повне зняття", 30, ["lash-extensions"]),
  p("le-wetlook", "lash-ext", "Wet-Look Doll Eye / Mascara / Long Mascara / Wet Hybrid", "Wet-Look Doll Eye / Mascara / Wet Hybrid", 110, ["lash-extensions"]),
  p("le-volume", "lash-ext", "Anime / Lami-Effect / Volume / Cat Eye / Fox Eye / Wispy", "Anime / Lami-Effect / Volume / Cat Eye / Fox Eye / Wispy", 130, ["lash-extensions"]),

  p("nail-classic", "nails", "Maniküre Classic", "Класичний манікюр", 50, ["nails"]),
  p("nail-jp", "nails", "Japanische Maniküre", "Японський манікюр", 60, ["nails"]),
  p("nail-polish", "nails", "Maniküre mit Lack", "Манікюр з лаком", 60, ["nails"]),
  p("nail-gel", "nails", "Maniküre mit Gel-Lack", "Манікюр з гель-лаком", 70, ["nails"]),
  p("nail-strengthen", "nails", "Naturnagelverstärkung mit Gel", "Зміцнення натуральних нігтів гелем", 80, ["nails"]),
  p("nail-fill", "nails", "Auffüllen", "Корекція", 90, ["nails"]),
  p("nail-new", "nails", "Neumodellage + Verlängerung (Gel)", "Нове нарощування гелем", 110, ["nails"]),
  p("pedi-classic", "nails", "Pediküre Classic", "Класичний педикюр", 60, ["nails"]),
  p("pedi-jp", "nails", "Japanische Pediküre", "Японський педикюр", 70, ["nails"]),
  p("pedi-polish", "nails", "Pediküre mit Nagellack", "Педикюр з лаком", 70, ["nails"]),
  p("pedi-gel", "nails", "Pediküre mit Gel-Lack / Gel", "Педикюр з гель-лаком / гелем", 80, ["nails"]),
  p("nail-off-own", "nails", "Entfernung Gel-Lack / Gel (unsere Arbeit)", "Зняття гель-лаку чи гелю (якщо робили в нас)", 30, ["nails"]),
  p("nail-off-mani", "nails", "Entfernung Gel-Lack / Gel inkl. Maniküre (unsere Arbeit)", "Зняття гель-лаку чи гелю разом із манікюром (якщо робили в нас)", 65, ["nails"]),
  p("nail-off-pedi", "nails", "Entfernung Gel-Lack inkl. Pediküre", "Зняття гель-лаку з педикюром", 75, ["nails"]),
  p("nail-off-foreign", "nails", "Entfernung Gel-Lack (Fremdarbeit)", "Зняття гель-лаку (якщо робили не в нас)", 40, ["nails"]),
  p("nail-off-acrylic", "nails", "Entfernung Gel / Acryl (Fremdarbeit)", "Зняття гелю чи акрилу (якщо робили не в нас)", 60, ["nails"]),
  p("nail-design", "nails", "Aufwändiges Design", "Складний дизайн", 10, ["nails"]),
  p("nail-repair-late", "nails", "Reparatur (ab dem 8. Tag oder Fremdarbeit)", "Ремонт (з 8-го дня або якщо робили не в нас)", 10, ["nails"]),

  p("hair-cut-w", "hair", "Damenhaarschnitt (waschen, föhnen, Styling)", "Жіноча стрижка (миття, фен, укладка)", 60, ["hair"], "from"),
  p("hair-viart-cut", "hair", "Haarschnitt inkl. VIART-Pflege", "Стрижка з доглядом VIART", 140, ["hair"]),
  p("hair-viart", "hair", "VIART Haarrekonstruktion", "Реконструкція волосся VIART", 100, ["hair"]),
  p("hair-color-consult", "hair", "Beratung Coloration / Teststrähne", "Консультація з фарбування / тестове пасмо", 30, ["hair"]),
  p("hair-global", "hair", "Global Color", "Повне фарбування", 150, ["hair"], "from"),
  p("hair-roots-2", "hair", "Ansatzfärbung (bis 2 cm)", "Фарбування коренів (до 2 см)", 120, ["hair"]),
  p("hair-roots-6", "hair", "Ansatzfärbung (2–6 cm)", "Фарбування коренів (2–6 см)", 150, ["hair"]),
  p("hair-advanced", "hair", "Advanced Color (Strähnen, Balayage, Babylights, Airtouch, Low Lights)", "Складне фарбування (пасма, балаяж, babylights, airtouch)", 280, ["hair"], "from"),
  p("hair-faceframe", "hair", "Face Framing", "Face Framing", 200, ["hair"]),
  p("hair-blonde", "hair", "Total Blonde (Ansatz)", "Total Blonde (корені)", 240, ["hair"], "from"),
  p("hair-gloss", "hair", "Glossing / Toner Refresh", "Глосинг / оновлення тону", 120, ["hair"], "from"),
  p("hair-cold", "hair", "Kalte Haarrekonstruktion", "Холодна реконструкція волосся", 80, ["hair"]),
  p("hair-peel", "hair", "Tiefenreinigung Kopfhaut-Peeling (Zusatz)", "Пілінг шкіри голови (додатково)", 30, ["hair"]),
  p("hair-ext", "hair", "Haarverlängerungen", "Нарощування волосся", 300, ["hair"]),
  p("hair-bond-own", "hair", "Bonding entfernen (eigene Arbeit)", "Зняття капсул (якщо робили в нас)", 80, ["hair"]),
  p("hair-bond-foreign", "hair", "Bonding entfernen (Fremdarbeit)", "Зняття капсул (якщо робили не в нас)", 100, ["hair"]),
  p("hair-blow", "hair", "Waschen, föhnen, stylen", "Миття, фен, укладка", 50, ["hair"]),
  p("hair-cut-m", "hair", "Herrenhaarschnitt", "Чоловіча стрижка", 50, ["hair"]),

  p("pmu-lips", "pmu", "Aquarell Lips", "Акварельні губи", 400, ["pmu"]),
  p("pmu-brows", "pmu", "Powder Brows", "Пудрові брови", 400, ["pmu"]),
  p("pmu-shade-liner", "pmu", "Shading Eyeliner", "Стрілка з розтушовкою", 450, ["pmu"]),
  p("pmu-liner", "pmu", "Eyeliner", "Стрілка", 300, ["pmu"]),
  p("pmu-laser", "pmu", "Laser Tattoo Pro Behandlung", "Laser Tattoo Pro", 150, ["pmu"]),
  p("pmu-remover", "pmu", "PMU Remover Pro Behandlung", "PMU Remover Pro", 200, ["pmu"]),

  p("brow-shape", "brows-lift", "Augenbrauen modellieren", "Корекція брів", 30, ["lashes-brows"]),
  p("brow-tint", "brows-lift", "Augenbrauen färben", "Фарбування брів", 30, ["lashes-brows"]),
  p("lash-tint", "brows-lift", "Wimpern färben", "Фарбування вій", 30, ["lashes-brows"]),
  p("brow-perfect", "brows-lift", "Perfect Brows", "Perfect Brows", 50, ["lashes-brows"]),
  p("brow-lift", "brows-lift", "Brow Lifting", "Броу-ліфтинг", 70, ["lashes-brows"]),
  p("brow-lift-pro", "brows-lift", "Brow Lifting Pro", "Броу-ліфтинг Pro", 80, ["lashes-brows"]),
  p("lash-lift", "brows-lift", "Lash Lifting", "Лемі-ліфтинг / ламінування вій", 80, ["lashes-brows"]),
  p("wax-lip", "brows-lift", "Wachsepilation Oberlippe", "Віск: вусики", 10, ["lashes-brows"]),
  p("combo-perfect-tint", "brows-lift", "Perfect Brows + Wimpern färben", "Perfect Brows + фарбування вій", 70, ["lashes-brows"]),
  p("combo-lift-tint", "brows-lift", "Brow Lifting + Wimpern färben", "Броу-ліфтинг + фарбування вій", 90, ["lashes-brows"]),
  p("combo-liftpro-tint", "brows-lift", "Brow Lifting Pro + Wimpern färben", "Броу-ліфтинг Pro + фарбування вій", 100, ["lashes-brows"]),
  p("combo-lash-shape", "brows-lift", "Lash Lifting + Augenbrauen zupfen oder modellieren", "Лемі-ліфтинг + корекція брів", 95, ["lashes-brows"]),
  p("combo-lash-perfect", "brows-lift", "Lash Lifting + Perfect Brows", "Лемі-ліфтинг + Perfect Brows", 115, ["lashes-brows"]),
  p("combo-lash-brow", "brows-lift", "Lash Lifting + Brow Lifting (ohne Färbung)", "Лемі-ліфтинг + броу-ліфтинг (без фарбування)", 130, ["lashes-brows"]),
  p("combo-pro-lash", "brows-lift", "Kombipaket Brow Lifting Pro (mit Färbung) + Lash Lifting", "Пакет броу-ліфтинг Pro (з фарбуванням) + лемі-ліфтинг", 140, ["lashes-brows"]),

  p("lw-lip", "laser-w", "Oberlippe", "Верхня губа", 30, ["laser"]),
  p("lw-chin", "laser-w", "Kinn", "Підборіддя", 40, ["laser"]),
  p("lw-neck", "laser-w", "Hals", "Шия", 40, ["laser"]),
  p("lw-cheeks", "laser-w", "Wangen", "Щоки", 40, ["laser"]),
  p("lw-nape", "laser-w", "Nacken", "Потилиця", 40, ["laser"]),
  p("lw-axilla", "laser-w", "Achseln", "Пахви", 50, ["laser"]),
  p("lw-belly", "laser-w", "Bauch", "Живіт", 50, ["laser"]),
  p("lw-linea", "laser-w", "Bauchlinie", "Доріжка на животі", 40, ["laser"]),
  p("lw-chest", "laser-w", "Brust", "Груди", 50, ["laser"]),
  p("lw-nipple", "laser-w", "Brustwarzen", "Соски", 40, ["laser"]),
  p("lw-upperarm", "laser-w", "Oberarme (beide)", "Верх рук", 70, ["laser"]),
  p("lw-forearm", "laser-w", "Unterarme (beide)", "Передпліччя (обидва)", 70, ["laser"]),
  p("lw-back", "laser-w", "Rücken", "Спина", 90, ["laser"]),
  p("lw-shoulders", "laser-w", "Schultern (beide)", "Плечі", 50, ["laser"]),
  p("lw-coccyx", "laser-w", "Steißbein", "Куприк", 40, ["laser"]),
  p("lw-thigh", "laser-w", "Oberschenkel (beide)", "Стегна (обидва)", 100, ["laser"]),
  p("lw-calf", "laser-w", "Unterschenkel (beide)", "Гомілки (обидві)", 90, ["laser"]),
  p("lw-bikini", "laser-w", "Bikinizone (Rand außen)", "Бікіні (зовнішній контур)", 50, ["laser"]),
  p("lw-intim", "laser-w", "Intim (ohne Bikinizone)", "Інтим (без бікіні)", 60, ["laser"]),
  p("lw-feet", "laser-w", "Füße (beide)", "Стопи (обидві)", 30, ["laser"]),
  p("lw-butt", "laser-w", "Po komplett (inkl. Falte)", "Сідниці повністю (зі складкою)", 90, ["laser"]),
  p("lw-gluteal", "laser-w", "Po-Falte", "Сіднична складка", 50, ["laser"]),
  p("lw-brow", "laser-w", "Augenbrauen (dazwischen)", "Між бровами", 30, ["laser"]),

  p("lm-lip", "laser-m", "Oberlippe", "Верхня губа", 40, ["laser"]),
  p("lm-chin", "laser-m", "Kinn", "Підборіддя", 50, ["laser"]),
  p("lm-neck", "laser-m", "Hals", "Шия", 50, ["laser"]),
  p("lm-cheeks", "laser-m", "Wangen", "Щоки", 50, ["laser"]),
  p("lm-nape", "laser-m", "Nacken", "Потилиця", 60, ["laser"]),
  p("lm-axilla", "laser-m", "Achseln", "Пахви", 60, ["laser"]),
  p("lm-belly", "laser-m", "Bauch", "Живіт", 80, ["laser"]),
  p("lm-linea", "laser-m", "Bauchlinie", "Доріжка на животі", 40, ["laser"]),
  p("lm-chest", "laser-m", "Brust", "Груди", 80, ["laser"]),
  p("lm-nipple", "laser-m", "Brustwarzen", "Соски", 40, ["laser"]),
  p("lm-upperarm", "laser-m", "Oberarme (beide)", "Верх рук", 100, ["laser"]),
  p("lm-forearm", "laser-m", "Unterarme (beide)", "Передпліччя (обидва)", 90, ["laser"]),
  p("lm-back", "laser-m", "Rücken", "Спина", 100, ["laser"]),
  p("lm-shoulders", "laser-m", "Schultern (beide)", "Плечі", 70, ["laser"]),
  p("lm-coccyx", "laser-m", "Steißbein", "Куприк", 50, ["laser"]),
  p("lm-thigh", "laser-m", "Oberschenkel (beide)", "Стегна (обидва)", 100, ["laser"]),
  p("lm-calf", "laser-m", "Unterschenkel", "Гомілки", 90, ["laser"]),
  p("lm-bikini", "laser-m", "Bikinizone", "Бікіні", 50, ["laser"]),
  p("lm-intim", "laser-m", "Intim (ohne Bikinizone)", "Інтим (без бікіні)", 60, ["laser"]),
  p("lm-feet", "laser-m", "Füße (beide)", "Стопи (обидві)", 30, ["laser"]),
  p("lm-butt", "laser-m", "Po komplett (inkl. Falte)", "Сідниці повністю (зі складкою)", 100, ["laser"]),
  p("lm-gluteal", "laser-m", "Po-Falte", "Сіднична складка", 50, ["laser"]),
  p("lm-brow", "laser-m", "Augenbrauen (dazwischen)", "Між бровами", 30, ["laser"]),
  p("lm-ear", "laser-m", "Ohr", "Вуха", 30, ["laser"]),

  p("lpw-arms", "laser-pkg-w", "Arme komplett", "Руки повністю", 100, ["laser"]),
  p("lpw-intim", "laser-pkg-w", "Intim komplett (Bikinizone & Intim)", "Інтим повністю (бікіні + інтим)", 80, ["laser"]),
  p("lpw-legs", "laser-pkg-w", "Beine komplett", "Ноги повністю", 170, ["laser"]),
  p("lpw-intim-ax", "laser-pkg-w", "Intim komplett & Achseln", "Інтим повністю + пахви", 120, ["laser"]),
  p("lpw-face", "laser-pkg-w", "Gesicht komplett (Oberlippe, Kinn, Wangen)", "Обличчя повністю (верхня губа, підборіддя, щоки)", 70, ["laser"]),
  p("lpw-combo", "laser-pkg-w", "Intim komplett & Achseln & Unterschenkel", "Інтим повністю + пахви + гомілки", 170, ["laser"]),
  p("lpw-full", "laser-pkg-w", "Full Body (Achseln, Arme, Beine, Intim komplett)", "Full Body (пахви, руки, ноги, інтим)", 380, ["laser"]),

  p("lpm-legs", "laser-pkg-m", "Beine komplett", "Ноги повністю", 180, ["laser"]),
  p("lpm-chest", "laser-pkg-m", "Bauch & Brust", "Живіт і груди", 140, ["laser"]),
  p("lpm-back", "laser-pkg-m", "Rücken (inkl. Nacken & Schulter)", "Спина (з потилицею і плечима)", 200, ["laser"]),

  p("aes-lips", "aesthetic", "Lippenmodellierung", "Моделювання губ", 300, ["pmu"]),
  p("aes-face", "aesthetic", "Gesichtskorrektur", "Корекція обличчя", 280, ["pmu"]),
  p("aes-lips-off", "aesthetic", "Lippenmodellierung −10 %", "Моделювання губ −10 %", 270, ["pmu"]),

  p("st-makeup", "styling", "Make-up", "Макіяж", 150, ["makeup"]),
  p("st-hair", "styling", "Haarstyling", "Укладка", 150, ["makeup"]),
  p("st-both", "styling", "Make-up + Haarstyling", "Макіяж + укладка", 280, ["makeup"]),
  p("st-bridal", "styling", "Brautstyling", "Весільний образ", 380, ["makeup"]),
];

export const pricesForService = (serviceId: string) =>
  prices.filter((item) => item.serviceIds.includes(serviceId));

export const formatPrice = (locale: "de" | "uk", item: PriceItem) => {
  const number = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(item.amount);
  if (item.kind === "from") {
    return locale === "uk" ? `від ${number}` : `ab ${number}`;
  }
  return number;
};
