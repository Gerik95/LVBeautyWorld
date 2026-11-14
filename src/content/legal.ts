import type { Locale } from "@/lib/site";
import { site } from "@/lib/site";

export type LegalDocId = "impressum" | "datenschutz" | "cookies";

export type LegalDoc = {
  id: LegalDocId;
  draft: boolean;
  title: { de: string; uk: string };
  seoDesc: { de: string; uk: string };
  body: { de: string[]; uk: string[] };
};

export const legalDocs: LegalDoc[] = [
  {
    id: "impressum",
    draft: false,
    title: { de: "Impressum", uk: "Реквізити" },
    seoDesc: {
      de: "Impressum der LV Beauty World GmbH, Dortmund.",
      uk: "Реквізити LV Beauty World GmbH у Дортмунді.",
    },
    body: {
      de: [
        "Angaben gemäß § 5 TMG",
        `${site.legalName}`,
        `Geschäftsführerin: ${site.managingDirector}`,
        `${site.street}`,
        `${site.postalCode} ${site.city}`,
        `${site.country}`,
        `Telefon: ${site.phoneDisplay}`,
        `E-Mail: ${site.email}`,
        `Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ${site.vatId}`,
        `Registergericht: ${site.registerCourt}`,
        `Registernummer: ${site.registerNumber}`,
        "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
        `${site.legalName}, vertreten durch die Geschäftsführerin ${site.managingDirector}, ${site.street}, ${site.postalCode} ${site.city}, ${site.country}`,
        "Zuständige Aufsichtsbehörde",
        site.supervisoryAuthority,
        "Hinweis gemäß § 36 VSBG",
        "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        "Online-Streitbeilegung",
        `Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: ${site.odrUrl}`,
        "Haftung für Inhalte",
        "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
      ],
      uk: [
        "Дані згідно з § 5 TMG",
        `${site.legalName}`,
        `Директорка: ${site.managingDirector}`,
        `${site.street}`,
        `${site.postalCode} ${site.city}`,
        `${site.country}`,
        `Телефон: ${site.phoneDisplay}`,
        `Електронна пошта: ${site.email}`,
        `Податковий номер ПДВ згідно з § 27a UStG: ${site.vatId}`,
        `Суд, де зареєстрована компанія: ${site.registerCourt}`,
        `Номер у реєстрі: ${site.registerNumber}`,
        "Хто відповідає за зміст сайту (§ 18 абз. 2 MStV)",
        `${site.legalName}, директорка ${site.managingDirector}, ${site.street}, ${site.postalCode} ${site.city}, ${site.country}`,
        "Орган нагляду",
        site.supervisoryAuthority,
        "Примітка згідно з § 36 VSBG",
        "Ми не зобов’язані і не готові брати участь у позасудовому врегулюванні спорів у споживчій примирній установі.",
        "Вирішення спорів онлайн",
        `Європейська комісія має для цього платформу: ${site.odrUrl}`,
        "Відповідальність за матеріали сайту",
        "За власні матеріали на цих сторінках ми відповідаємо згідно з § 7 абз. 1 TMG. За §§ 8–10 TMG ми не мусимо перевіряти чужу інформацію, яку нам передали або яку збережено на сайті.",
      ],
    },
  },
  {
    id: "datenschutz",
    draft: true,
    title: { de: "Datenschutz", uk: "Конфіденційність" },
    seoDesc: {
      de: "Datenschutzerklärung der LV Beauty World GmbH.",
      uk: "Як LV Beauty World працює з персональними даними.",
    },
    body: {
      de: [
        "Verantwortliche Stelle",
        `${site.legalName}, ${site.street}, ${site.postalCode} ${site.city}, ${site.email}, Telefon ${site.phoneDisplay}.`,
        "Verarbeitete Daten",
        "Beim Aufruf dieser Website speichert der Host üblicherweise Server-Logs (IP-Adresse, Zeitpunkt, User-Agent) für den technischen Betrieb.",
        "Auf Ihrem Gerät können Sprache und Darstellung liegen (localStorage / Cookie).",
        "Karten",
        "Die Kontaktseite lädt eine Google-Karte der Salonadresse. Der Browser kann dabei eine Verbindung zu Google herstellen. Den Standort des Besuchers fragt diese Website nicht ab. „Route planen“ ist ein direkter Link zu Google Maps und setzt die Karte nicht voraus. Google Analytics setzen wir nicht ein.",
        "Buchung",
        `Der Button „Termin buchen“ führt zu Salonkee. Auf einer Leistungsseite öffnet er diese Leistung, ein einzelner Preis öffnet genau diese Behandlung. Salonkee ist ein Drittanbieter (${site.bookingUrl}). Deren Datenschutz gilt ab dem Verlassen dieser Website.`,
        "Keine Analyse",
        "Diese Website setzt kein Google Analytics, kein Tag Manager und keine Werbe-Pixel ein.",
        "Ihre Rechte",
        "Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Beschwerde bei einer Aufsichtsbehörde (in NRW: LDI NRW).",
        "Speicherdauer",
        "Sprache und Darstellung bleiben auf dem Gerät, bis Sie sie ändern oder den Speicher des Browsers leeren.",
      ],
      uk: [
        "Хто відповідає за дані",
        `${site.legalName}, ${site.street}, ${site.postalCode} ${site.city}, ${site.email}, телефон ${site.phoneDisplay}.`,
        "Які дані з’являються",
        "Коли ви відкриваєте сайт, хостинг зазвичай записує технічний журнал: IP-адресу, час і дані браузера. Це потрібно, щоб сайт працював.",
        "На вашому пристрої може зберігатися обрана мова і вигляд сайту (localStorage або cookie).",
        "Карта",
        "На сторінці контактів відкривається карта Google з адресою салону. Браузер при цьому може з’єднатися з Google. Своє місцезнаходження сайт у вас не питає. Кнопка «Прокласти маршрут» — звичайне посилання на Google Maps, карта для цього не потрібна. Google Analytics ми не ставимо.",
        "Запис",
        `Кнопка запису веде на Salonkee. На сторінці послуги вона відкриває саме цю послугу, окремий рядок ціни — саме цю процедуру. Salonkee — окремий сервіс (${site.bookingUrl}). Його правила починають діяти, щойно ви залишаєте наш сайт.`,
        "Без аналітики",
        "Немає Google Analytics, Google Tag Manager і рекламних пікселів.",
        "Ваші права",
        "Ви можете дізнатися, які дані в нас є, попросити їх виправити, видалити або обмежити обробку, отримати копію, заперечити проти обробки і подати скаргу до органу нагляду. У землі Північний Рейн-Вестфалія це LDI NRW.",
        "Скільки це зберігається",
        "Мова й вигляд сайту лишаються на пристрої, доки ви самі їх не зміните або не очистите дані браузера.",
      ],
    },
  },
  {
    id: "cookies",
    draft: true,
    title: { de: "Cookies & lokale Speicherung", uk: "Cookies" },
    seoDesc: {
      de: "Welche Speicherung diese Website nutzt.",
      uk: "Що цей сайт зберігає у вас на пристрої.",
    },
    body: {
      de: [
        "Keine Werbe- oder Statistik-Cookies.",
        "Notwendig",
        "Darstellung (hell / dunkel / System) und Sprache.",
        "Dritte",
        "Salonkee und Instagram, wenn Sie den jeweiligen Link öffnen. Die Kontaktseite lädt eine Google-Karte der Salonadresse. „Route planen“ öffnet Google Maps auch ohne die Karte.",
        "Speicherdauer",
        "Lokal bis zur Änderung oder Löschung durch Sie.",
      ],
      uk: [
        "Рекламних і статистичних cookie немає.",
        "Що потрібно для роботи сайту",
        "Вигляд — світлий, темний або як на пристрої — і мова.",
        "Інші сервіси",
        "Salonkee та Instagram відкриваються, лише якщо ви самі натискаєте посилання. На сторінці контактів завантажується карта Google з адресою салону. «Прокласти маршрут» відкриває Google Maps і без цієї карти.",
        "Як довго",
        "Поки ви самі не зміните це або не видалите дані в браузері.",
      ],
    },
  },
];

export const getLegal = (id: string) => legalDocs.find((doc) => doc.id === id);

export const legalTitle = (locale: Locale, id: LegalDocId) => {
  const doc = getLegal(id);
  return doc ? doc.title[locale] : id;
};
