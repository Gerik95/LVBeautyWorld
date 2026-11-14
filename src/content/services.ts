export type ServiceId =
  | "nails"
  | "lashes-brows"
  | "lash-extensions"
  | "hair"
  | "skin"
  | "laser"
  | "pmu"
  | "makeup";

/** Home gallery, in the existing service order. PMU and styling keep their own pages. */
export const homeServiceIds = [
  "nails",
  "lashes-brows",
  "lash-extensions",
  "hair",
  "skin",
  "laser",
] as const satisfies readonly ServiceId[];

export type HomeServiceId = (typeof homeServiceIds)[number];

export type Service = {
  id: ServiceId;
  image: string;
  imageAlt: { de: string; uk: string };
  objectPosition?: string;
  gallery?: { src: string; alt: { de: string; uk: string }; objectPosition?: string }[];
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
    objectPosition: "center 42%",
    gallery: [
      {
        src: "/photos/services/nails.jpg",
        alt: {
          de: "Maniküre im Salon LV Beauty World",
          uk: "Манікюр у салоні LV Beauty World",
        },
        objectPosition: "center 42%",
      },
      {
        src: "/photos/services/pedicure.jpg",
        alt: {
          de: "Pediküre im Salon LV Beauty World",
          uk: "Педикюр у салоні LV Beauty World",
        },
        objectPosition: "center",
      },
    ],
    name: { de: "Maniküre & Pediküre", uk: "Манікюр і педикюр" },
    short: {
      de: "Klassisch, Gel-Lack oder Modellage — inklusive Babyboomer und individueller Designs.",
      uk: "Класика, гель-лак або нарощування — френч, babyboomer і дизайн на ваш смак.",
    },
    body: {
      de: "Gepflegte Hände und Füße sind Teil eines ruhigen, präzisen Auftritts. Wir arbeiten mit Gel-Lack und Gel-Modellage und setzen Designs wie French oder Babyboomer um — kurz, rund, ballerina oder square, mit oder ohne Gel. Pediküre bieten wir hygienisch, als Kombi oder apparativ an; auf Wunsch mit Lack oder Gel-Lack. Werkzeuge werden nach jeder Anwendung desinfiziert und sterilisiert. Eine medizinische Diagnose ersetzen wir nicht; bei besonderen Fußsituationen stimmen wir uns mit Fachpersonal ab.",
      uk: "Доглянуті руки й стопи — це про акуратність, без поспіху. Робимо гель-лак і нарощування гелем, френч і babyboomer. Форма може бути короткою, круглою, балериною чи квадратом, з гелем або без. Педикюр буває гігієнічний, комбінований і апаратний, за бажанням — зі звичайним лаком або гель-лаком. Інструменти після кожного клієнта дезінфікуємо і стерилізуємо. Діагнозів не ставимо: якщо зі стопою щось особливе, узгодимо це з лікарем.",
    },
    treatments: [
      { de: "Klassische Maniküre & Gel-Lack (Shellac)", uk: "Класичний манікюр і гель-лак (Shellac)" },
      { de: "Nagelmodellage mit Gel, Babyboomer, French", uk: "Нарощування гелем, babyboomer, френч" },
      { de: "Hygiene-, Kombi- und apparative Pediküre", uk: "Гігієнічний, комбінований і апаратний педикюр" },
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
      uk: "Ламінування, ліфтинг, форма і фарбування — щоб погляд тримався без щоденного макіяжу.",
    },
    body: {
      de: "Laminierung und Lifting arbeiten mit Ihren eigenen Härchen: Form, Schwung, Pflege (unter anderem Keratin) und optionales Färben. Die Behandlung dauert etwa 45–60 Minuten; das Ergebnis bleibt je nach Haar etwa 6–8 Wochen sichtbar. 24 Stunden danach kein Wasser, Dampf oder Make-up auf der Augenpartie. Beim Formen färben wir Brauen nicht tiefschwarz und schneiden sie nicht extrem dünn. Wimpernlifting färbt auf Wunsch tiefschwarz und schließt mit Pflege ab.",
      uk: "Ламінування і ліфтинг робимо на ваших власних віях і бровах: форма, вигин, догляд (зокрема кератин) і фарбування, якщо хочете. Процедура триває приблизно 45–60 хвилин, ефект тримається близько 6–8 тижнів — залежить від волоска. Добу після неї очі не мочіть, не піддавайте пару і не фарбуйте. Брови не фарбуємо в глухий чорний і не вищипуємо в ниточку. Ліфтинг вій за бажанням фарбує їх у насичений чорний і закінчується доглядом.",
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
      uk: "Класика, об’єм і мокрий ефект — чорні, шоколадні або коричневі.",
    },
    body: {
      de: "Verlängerungen gibt es in drei Farben: klassisches Schwarz, dunkle Schokolade und Braun. Techniken reichen von Classic und Wet Lashes bis Volume, Cat Eye, Fox Eye, Anime, Lami-Effect und Wispy. Auffüllen nach 21 Tagen und komplettes Entfernen stehen auf der Preisliste. Die genaue Effektwahl erfolgt in der Behandlung.",
      uk: "Нарощуємо в трьох кольорах: класичний чорний, темний шоколад і коричневий. Є класика і wet lashes, об’єм, cat eye, fox eye, anime, ефект ламінування і wispy. Корекція через 21 день і повне зняття є в прайсі. Який ефект вам личить, обираємо вже на процедурі.",
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
      uk: "Стрижка, фарбування, догляд і нарощування — від коренів до airtouch.",
    },
    body: {
      de: "Farbarbeit reicht von der Ansatzfärbung über Glossing bis zu Strähnen, Balayage, Babylights, Airtouch und Low Lights; wir nutzen professionelle Haarfarbe. Pflege umfasst VIART-Rekonstruktion, kalte Rekonstruktion und Kopfhaut-Peeling. Haarverlängerung wird als Mikro-Kapsel-/Bonding-Leistung geführt.",
      uk: "Фарбуємо корені, робимо глосинг, пасма, балаяж, babylights, airtouch і low lights — професійною фарбою. З догляду є реконструкція VIART, холодна реконструкція волосся і пілінг шкіри голови. Нарощування кріпимо на мікрокапсулах.",
    },
    treatments: [
      { de: "Schnitt, Föhnen, Herren- und Damenschnitt", uk: "Стрижка, укладка феном, жіноча і чоловіча" },
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
    name: { de: "Haut & Kosmetik", uk: "Догляд за шкірою" },
    short: {
      de: "Reinigung, Peelings, Hydrafacial und Meso — abgestimmt auf den Hauttyp.",
      uk: "Чистка, пілінги, Hydrafacial і мезотерапія — під ваш тип шкіри.",
    },
    body: {
      de: "Statt einer pauschalen monatlichen Tiefenreinigung wählen wir die Behandlung nach Hauttyp: manuelle Tiefenreinigung, Hydrafacial, Enzym- und Säurepeelings, Intense Hydration sowie Meso / Bio-Revitalisierung / Microneedling. Beratung steht als eigene Position auf der Preisliste.",
      uk: "Не ставимо всім одну й ту саму глибоку чистку раз на місяць. Дивимось на шкіру і пропонуємо ручну чистку, Hydrafacial, ензимний або кислотний пілінг, інтенсивне зволоження, мезотерапію, біоревіталізацію або мікронідлінг. Консультація в прайсі стоїть окремим пунктом.",
    },
    treatments: [
      { de: "Hydrafacial & manuelle Tiefenreinigung", uk: "Hydrafacial і ручна глибока чистка" },
      { de: "Peelings (Mandel, Jessner, Milch-, Salicylsäure)", uk: "Пілінги: мигдальний, Джесснера, молочний, саліциловий" },
      { de: "Meso / Microneedling", uk: "Мезотерапія і мікронідлінг" },
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
      uk: "Окремі зони і пакети для жінок і чоловіків. Ціна залежить від ділянки.",
    },
    body: {
      de: "Dauerhafte Haarentfernung mit Lasergeräten für Gesicht, Achseln, Intimbereich, Beine, Arme und Rücken — einzelne Zonen und Pakete für Damen und Herren. Mehrere Sitzungen sind üblich.",
      uk: "Лазерна епіляція обличчя, пахв, зони бікіні, ніг, рук і спини. Можна взяти одну зону або пакет — є варіанти для жінок і для чоловіків. Зазвичай потрібно кілька сеансів.",
    },
    treatments: [
      { de: "Einzelzonen Gesicht & Körper", uk: "Окремі зони обличчя і тіла" },
      { de: "Intim- und Beinpakete", uk: "Пакети: бікіні і ноги" },
      { de: "Full Body (Damen)", uk: "Усе тіло (для жінок)" },
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
      uk: "Пудрові брови, губи і стрілка. Зняття теж є в прайсі.",
    },
    body: {
      de: "Puder-Permanent-Make-up für einen weichen Schattierungseffekt an Augenbrauen, Lippen und Lidstrich. Auf der Preisliste: Powder Brows, Aquarell Lips, Eyeliner und Shading Eyeliner sowie Laser-Tattoo- und PMU-Remover-Behandlungen. Lippenmodellierung und Gesichtskorrektur stehen als ästhetische Positionen daneben.",
      uk: "Пудровий перманент дає м’яку тінь на бровах, губах і повіці. У прайсі є пудрові брови, акварельні губи, стрілка і стрілка з розтушовкою, а також лазерне виведення тату і зняття перманенту. Окремо можна зробити моделювання губ і корекцію обличчя.",
    },
    treatments: [
      { de: "Powder Brows", uk: "Пудрові брови" },
      { de: "Lippen (Aquarell)", uk: "Акварельні губи" },
      { de: "Lidstrich / Shading Eyeliner", uk: "Стрілка і стрілка з розтушовкою" },
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
      uk: "На кожен день, на свято і на весілля — макіяж, укладка або разом.",
    },
    body: {
      de: "Professionelles Make-up und Hairstyling für Alltag, Shooting, Feier oder Hochzeit. Preise gelten für Make-up, Haarstyling, die Kombination und Brautstyling.",
      uk: "Зробимо макіяж і укладку на день, зйомку, свято чи весілля. У прайсі є макіяж, укладка, обидва разом і весільний образ.",
    },
    treatments: [
      { de: "Make-up", uk: "Макіяж" },
      { de: "Haarstyling", uk: "Укладка" },
      { de: "Brautstyling", uk: "Весільний образ" },
    ],
  },
];

export const getService = (id: string) => services.find((item) => item.id === id);

export const homeServices = () =>
  homeServiceIds.flatMap((id) => {
    const service = getService(id);
    return service ? [service] : [];
  });

/** Photo for the home gallery. Each service uses its own file, including skin care. */
export const serviceGalleryImage = (service: Service): string | null => service.image;
