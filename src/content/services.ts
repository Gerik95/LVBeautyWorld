export type ServiceId =
  | "nails"
  | "lashes-brows"
  | "lash-extensions"
  | "hair"
  | "skin"
  | "laser"
  | "pmu"
  | "makeup";

export type Service = {
  id: ServiceId;
  image: string;
  imageAlt: { de: string; uk: string };
  name: { de: string; uk: string };
  short: { de: string; uk: string };
  body: { de: string; uk: string };
  treatments: { de: string; uk: string }[];
};

export const services: Service[] = [
  {
    id: "nails",
    image: "/photos/services/nails.jpg",
    imageAlt: {
      de: "Maniküre im Salon LV Beauty World",
      uk: "Манікюр у салоні LV Beauty World",
    },
    name: { de: "Maniküre & Pediküre", uk: "Манікюр і педикюр" },
    short: {
      de: "Klassisch, Gel-Lack oder Modellage — inklusive Babyboomer und individueller Designs.",
      uk: "Класика, гель-лак або моделювання — зокрема babyboomer та індивідуальний дизайн.",
    },
    body: {
      de: "Gepflegte Hände und Füße sind Teil eines ruhigen, präzisen Auftritts. Wir arbeiten mit Gel-Lack, Gel- oder Acryl-Modellage und setzen Designs wie French oder Babyboomer um — kurz, rund, ballerina oder square, mit oder ohne Gel. Pediküre bieten wir hygienisch, als Kombi oder apparativ an; auf Wunsch mit Lack oder Gel-Lack. Werkzeuge werden nach jeder Anwendung desinfiziert und sterilisiert. Eine medizinische Diagnose ersetzen wir nicht; bei besonderen Fußsituationen stimmen wir uns mit Fachpersonal ab.",
      uk: "Доглянуті руки й стопи — частина спокійного, точного образу. Працюємо з гель-лаком, гелевим або акриловим моделюванням і робимо дизайни на кшталт френча чи babyboomer — короткі, круглі, ballerina чи square, з гелем або без. Педикюр — гігієнічний, комбінований або апаратний; за бажанням з лаком чи гель-лаком. Інструменти дезінфікуємо та стерилізуємо після кожного використання. Медичний діагноз не ставимо; у разі особливих станів стоп узгоджуємо роботу з профільними фахівцями.",
    },
    treatments: [
      { de: "Klassische Maniküre & Gel-Lack (Shellac)", uk: "Класичний манікюр і гель-лак (Shellac)" },
      { de: "Nagelmodellage Gel/Acryl, Babyboomer, French", uk: "Моделювання гель/акрил, babyboomer, френч" },
      { de: "Hygiene-, Kombi- und apparative Pediküre", uk: "Гігієнічний, комбі- та апаратний педикюр" },
    ],
  },
  {
    id: "lashes-brows",
    image: "/photos/services/lashes-brows.jpg",
    imageAlt: {
      de: "Wimpern- und Augenbrauenbehandlung",
      uk: "Догляд за віями та бровами",
    },
    name: { de: "Wimpern & Augenbrauen", uk: "Вії та брови" },
    short: {
      de: "Laminierung, Lifting, Formen und Färben — natürlicher Blick ohne tägliches Styling.",
      uk: "Ламінування, ліфтинг, форма й фарбування — природний погляд без щоденного стайлінгу.",
    },
    body: {
      de: "Laminierung und Lifting arbeiten mit Ihren eigenen Härchen: Form, Schwung, Pflege (unter anderem Keratin) und optionales Färben. Die Behandlung dauert etwa 45–60 Minuten; das Ergebnis bleibt je nach Haar etwa 6–8 Wochen sichtbar. 24 Stunden danach kein Wasser, Dampf oder Make-up auf der Augenpartie. Beim Formen färben wir Brauen nicht tiefschwarz und schneiden sie nicht extrem dünn. Wimpernlifting färbt auf Wunsch tiefschwarz und schließt mit Pflege ab.",
      uk: "Ламінування й ліфтинг працюють із власними волосинами: форма, вигин, догляд (зокрема кератин) і за бажанням фарбування. Процедура триває близько 45–60 хвилин; результат тримається орієнтовно 6–8 тижнів. Доба після цього — без води, пари й макіяжу на зоні очей. Брови не фарбуємо в глибокий чорний і не робимо їх надто тонкими. Лаш-ліфтинг за бажанням фарбує вії в насичений чорний і завершується доглядом.",
    },
    treatments: [
      { de: "Wimpern- und Augenbrauenlaminierung", uk: "Ламінування вій і брів" },
      { de: "Lash Lifting & Brow Lifting (auch Pro)", uk: "Лаш-ліфтинг і броу-ліфтинг (також Pro)" },
      { de: "Formen und Färben", uk: "Форма та фарбування" },
    ],
  },
  {
    id: "lash-extensions",
    image: "/photos/services/lash-extensions.jpg",
    imageAlt: {
      de: "Wimpernverlängerung",
      uk: "Нарощування вій",
    },
    name: { de: "Wimpernverlängerung", uk: "Нарощування вій" },
    short: {
      de: "Classic, Volume, Wet-Look — in Schwarz, dunkler Schokolade oder Braun.",
      uk: "Classic, Volume, Wet-Look — чорний, темний шоколад або коричневий.",
    },
    body: {
      de: "Verlängerungen gibt es in drei Farben: klassisches Schwarz, dunkle Schokolade und Braun. Techniken reichen von Classic und Wet Lashes bis Volume, Cat Eye, Fox Eye, Anime, Lami-Effect und Wispy. Auffüllen nach 21 Tagen und komplettes Entfernen stehen auf der Preisliste. Die genaue Effektwahl erfolgt in der Behandlung — ohne erfundene Garantien.",
      uk: "Нарощування пропонуємо в трьох кольорах: класичний чорний, темний шоколад і коричневий. Техніки — від Classic і Wet Lashes до Volume, Cat Eye, Fox Eye, Anime, Lami-Effect і Wispy. Корекція через 21 день і повне зняття є в прайсі. Конкретний ефект обираємо під час процедури — без вигаданих гарантій.",
    },
    treatments: [
      { de: "Classic / Wet Lashes", uk: "Classic / Wet Lashes" },
      { de: "Volume, Cat Eye, Fox Eye, Wispy", uk: "Volume, Cat Eye, Fox Eye, Wispy" },
      { de: "Auffüllen und Entfernen", uk: "Корекція та зняття" },
    ],
  },
  {
    id: "hair",
    image: "/photos/services/hair.jpg",
    imageAlt: {
      de: "Haarfärbung und Pflege",
      uk: "Фарбування та догляд за волоссям",
    },
    name: { de: "Haar", uk: "Волосся" },
    short: {
      de: "Schnitt, Farbe, Pflege und Verlängerung — von Ansatz bis Airtouch.",
      uk: "Стрижка, колір, догляд і нарощування — від коренів до airtouch.",
    },
    body: {
      de: "Farbarbeit reicht von der Ansatzfärbung über Glossing bis zu Strähnen, Balayage, Babylights, Airtouch und Low Lights; wir nutzen professionelle Haarfarbe. Pflege umfasst VIART-Rekonstruktion, kalte Rekonstruktion und Kopfhaut-Peeling. Haarverlängerung wird als Mikro-Kapsel-/Bonding-Leistung geführt. Keratin-Glättung steht bei Salonkee mit einem unplausiblen Einstiegspreis — wir listen sie nicht, bis der Salon den Betrag bestätigt.",
      uk: "Колір — від фарбування коренів і глосінгу до пасом, балаяжу, babylights, airtouch і low lights; працюємо професійним барвником. Догляд: реконструкція VIART, холодна реконструкція, пілінг шкіри голови. Нарощування — мікрокапсули / bonding. Кератинове вирівнювання в Salonkee має неправдоподібну стартову ціну — не публікуємо її, доки салон не підтвердить суму.",
    },
    treatments: [
      { de: "Schnitt, Föhnen, Herren- und Damenschnitt", uk: "Стрижка, фен, жіноча та чоловіча стрижка" },
      { de: "Coloration, Balayage, Airtouch", uk: "Фарбування, балаяж, airtouch" },
      { de: "Pflege, Rekonstruktion, Haarverlängerung", uk: "Догляд, реконструкція, нарощування" },
    ],
  },
  {
    id: "skin",
    image: "/photos/services/skin.jpg",
    imageAlt: {
      de: "Gesichtsbehandlung",
      uk: "Догляд за обличчям",
    },
    name: { de: "Haut & Kosmetik", uk: "Шкіра та косметологія" },
    short: {
      de: "Reinigung, Peelings, Hydrafacial und Meso — abgestimmt auf den Hauttyp.",
      uk: "Чистка, пілінги, Hydrafacial і мезо — відповідно до типу шкіри.",
    },
    body: {
      de: "Statt einer pauschalen monatlichen Tiefenreinigung wählen wir die Behandlung nach Hauttyp: manuelle Tiefenreinigung, Hydrafacial, Enzym- und Säurepeelings, Intense Hydration sowie Meso / Bio-Revitalisierung / Microneedling. Beratung steht als eigene Position auf der Preisliste.",
      uk: "Замість шаблонної щомісячної глибокої чистки обираємо процедуру за типом шкіри: ручна чистка, Hydrafacial, ензимні та кислотні пілінги, Intense Hydration, а також мезо / біоревіталізація / мікронідлінг. Консультація є окремою позицією в прайсі.",
    },
    treatments: [
      { de: "Hydrafacial & manuelle Tiefenreinigung", uk: "Hydrafacial і ручна глибока чистка" },
      { de: "Peelings (Mandel, Jessner, Milch-, Salicylsäure)", uk: "Пілінги (мигдальний, Джесснера, молочний, саліциловий)" },
      { de: "Meso / Microneedling", uk: "Мезо / мікронідлінг" },
    ],
  },
  {
    id: "laser",
    image: "/photos/services/laser.jpg",
    imageAlt: {
      de: "Laser-Haarentfernung",
      uk: "Лазерна епіляція",
    },
    name: { de: "Laser-Haarentfernung", uk: "Лазерна епіляція" },
    short: {
      de: "Zonen und Pakete für Damen und Herren — Preise nach Fläche.",
      uk: "Зони й пакети для жінок і чоловіків — ціна залежить від ділянки.",
    },
    body: {
      de: "Dauerhafte Haarentfernung mit Lasergeräten, in der Salonkee-Liste für nahezu alle Körperzonen und für Damen- sowie Herrenpakete. Gesicht, Achseln, Intimbereich, Beine, Arme und Rücken sind einzeln und als Kombination buchbar. Mehrere Sitzungen sind üblich; wir versprechen hier kein festes Sitzungskontingent, das der Salon nicht genannt hat.",
      uk: "Довготривала лазерна епіляція — у прайсі Salonkee майже для всіх зон тіла, окремо для жінок і чоловіків. Обличчя, пахви, інтим, ноги, руки й спина — по зонах і пакетами. Зазвичай потрібні кілька сеансів; кількість, яку салон не назвав, ми не вигадуємо.",
    },
    treatments: [
      { de: "Einzelzonen Gesicht & Körper", uk: "Окремі зони обличчя та тіла" },
      { de: "Intim- und Beinpakete", uk: "Пакети інтим і ноги" },
      { de: "Full Body (Damen)", uk: "Full Body (жінки)" },
    ],
  },
  {
    id: "pmu",
    image: "/photos/services/pmu.jpg",
    imageAlt: {
      de: "Permanent Make-up",
      uk: "Перманентний макіяж",
    },
    name: { de: "Permanent Make-up", uk: "Перманентний макіяж" },
    short: {
      de: "Puder-Brauen, Lippen, Lidstrich — plus Entfernung auf der Preisliste.",
      uk: "Пудрові брови, губи, стрілка — у прайсі також зняття.",
    },
    body: {
      de: "Puder-Permanent-Make-up für einen weichen Schattierungseffekt an Augenbrauen, Lippen und Lidstrich. Auf der Preisliste: Powder Brows, Aquarell Lips, Eyeliner und Shading Eyeliner sowie Laser-Tattoo- und PMU-Remover-Behandlungen. Lippenmodellierung und Gesichtskorrektur stehen als ästhetische Positionen daneben.",
      uk: "Пудровий перманент — м’яке розтушування брів, губ і стрілки. У прайсі: Powder Brows, Aquarell Lips, Eyeliner і Shading Eyeliner, а також лазерне тату-виведення та PMU Remover. Окремо — моделювання губ і корекція обличчя.",
    },
    treatments: [
      { de: "Powder Brows", uk: "Пудрові брови" },
      { de: "Lippen (Aquarell)", uk: "Губи (акварель)" },
      { de: "Lidstrich / Shading Eyeliner", uk: "Стрілка / shading eyeliner" },
    ],
  },
  {
    id: "makeup",
    image: "/photos/services/makeup.jpg",
    imageAlt: {
      de: "Make-up und Haarstyling",
      uk: "Макіяж та укладка",
    },
    name: { de: "Make-up & Styling", uk: "Макіяж і укладка" },
    short: {
      de: "Alltag, Event und Braut — Make-up, Haar oder beides.",
      uk: "Будні, подія й весілля — макіяж, волосся або разом.",
    },
    body: {
      de: "Professionelles Make-up und Hairstyling für Alltag, Shooting, Feier oder Hochzeit. Preise gelten für Make-up, Haarstyling, die Kombination und Brautstyling. Eine auf der Altsite genannte Cannes-Referenz haben wir nicht unabhängig geprüft und führen sie deshalb nicht als Fakt.",
      uk: "Професійний макіяж і укладка для буднів, зйомки, свята чи весілля. У прайсі — макіяж, укладка, комбінація та весільний образ. Згадку про Канни зі старого сайту ми не перевірили незалежно, тому не подаємо її як факт.",
    },
    treatments: [
      { de: "Make-up", uk: "Макіяж" },
      { de: "Haarstyling", uk: "Укладка" },
      { de: "Brautstyling", uk: "Весільний образ" },
    ],
  },
];

export const getService = (id: string) => services.find((item) => item.id === id);
