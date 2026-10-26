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
    title: { de: "Impressum", uk: "Імпресум" },
    seoDesc: {
      de: "Impressum der LV Beauty World GmbH, Dortmund.",
      uk: "Імпресум LV Beauty World GmbH, Дортмунд.",
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
        "Відомості згідно з § 5 TMG (Німеччина)",
        `${site.legalName}`,
        `Директорка: ${site.managingDirector}`,
        `${site.street}`,
        `${site.postalCode} ${site.city}`,
        `${site.country}`,
        `Телефон: ${site.phoneDisplay}`,
        `Ел. пошта: ${site.email}`,
        `Ідентифікаційний номер платника ПДВ (§ 27a UStG): ${site.vatId}`,
        `Реєстровий суд: ${site.registerCourt}`,
        `Номер реєстру: ${site.registerNumber}`,
        "Відповідальна за зміст згідно з § 18 Abs. 2 MStV",
        `${site.legalName} в особі директорки ${site.managingDirector}, ${site.street}, ${site.postalCode} ${site.city}, ${site.country}`,
        "Наглядовий орган",
        site.supervisoryAuthority,
        "Примітка згідно з § 36 VSBG",
        "Ми не зобов’язані й не готові брати участь у позасудовому врегулюванні спорів у споживчій арбітражній установі.",
        "Онлайн-врегулювання спорів",
        `Європейська комісія надає платформу: ${site.odrUrl}`,
        "Відповідальність за зміст",
        "Як надавач послуг ми відповідаємо за власний зміст згідно з § 7 Abs. 1 TMG. За §§ 8–10 TMG ми не зобов’язані контролювати передану чи збережену чужу інформацію.",
      ],
    },
  },
  {
    id: "datenschutz",
    draft: true,
    title: { de: "Datenschutz", uk: "Захист даних" },
    seoDesc: {
      de: "Entwurf der Datenschutzerklärung — vom Inhaber zu prüfen.",
      uk: "Чернетка політики конфіденційності — на перевірку власниці.",
    },
    body: {
      de: [
        "Dies ist ein Entwurf nach TDDDG und DSGVO. Er ersetzt keine anwaltliche Freigabe.",
        "Verantwortliche Stelle",
        `${site.legalName}, ${site.street}, ${site.postalCode} ${site.city}, ${site.email}, Telefon ${site.phoneDisplay}.`,
        "Es ist uns nicht bekannt, ob ein Datenschutzbeauftragter bestellt ist. Bis zur Bestätigung durch den Inhaber nennen wir niemanden.",
        "Verarbeitete Daten",
        "Beim Aufruf dieser Website speichert der Host üblicherweise Server-Logs (IP-Adresse, Zeitpunkt, User-Agent) für den technischen Betrieb. Dauer und Auftragsverarbeitung hängen vom gewählten Hosting ab und sind vom Inhaber zu ergänzen.",
        "Auf Ihrem Gerät können Sprache, Theme und Karten-Einwilligung liegen (localStorage / Cookie). Das ist für die Darstellung erforderlich (Art. 6 Abs. 1 lit. b bzw. f DSGVO, § 25 Abs. 2 TDDDG).",
        "Karten",
        "Apple MapKit JS wird nur geladen, wenn Sie auf der Kontaktseite zustimmen. Dann überträgt Ihr Browser Daten an Apple (Vereinigte Staaten). Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Ohne Einwilligung bleibt die Adresse als Text nutzbar.",
        "Buchung",
        `Der Button „Termin buchen“ führt zu Salonkee (${site.bookingUrl}), einem Drittanbieter. Deren Datenschutz gilt ab dem Verlassen dieser Website.`,
        "Keine Analyse",
        "Diese Website setzt kein Google Analytics, kein Tag Manager und keine Werbe-Pixel ein.",
        "Ihre Rechte",
        "Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Beschwerde bei einer Aufsichtsbehörde (in NRW: LDI NRW). Widerruf von Einwilligungen mit Wirkung für die Zukunft über die Einstellungen.",
        "Speicherdauer",
        "Einwilligungen und Theme bleiben, bis Sie sie ändern oder den Speicher des Browsers leeren.",
      ],
      uk: [
        "Це чернетка відповідно до TDDDG і GDPR. Вона не замінює юридичне погодження.",
        "Відповідальний",
        `${site.legalName}, ${site.street}, ${site.postalCode} ${site.city}, ${site.email}, телефон ${site.phoneDisplay}.`,
        "Чи призначено захисника даних, нам не відомо. До підтвердження власницею нікого не називаємо.",
        "Які дані обробляються",
        "Під час відкриття сайту хостинг зазвичай пише технічні журнали (IP, час, user-agent). Строк і договір обробки залежить від хостингу — власниця має дописати.",
        "На пристрої можуть зберігатися мова, тема й згода на мапу (localStorage / cookie). Це потрібно для показу сайту.",
        "Мапи",
        "Apple MapKit JS завантажується лише після згоди на сторінці контактів. Тоді браузер передає дані Apple (США). Підстава: згода. Без згоди адреса лишається текстом.",
        "Запис",
        `Кнопка запису веде на Salonkee (${site.bookingUrl}) — сторонній сервіс із власними правилами.`,
        "Без аналітики",
        "Немає Google Analytics, Tag Manager і рекламних пікселів.",
        "Ваші права",
        "Доступ, виправлення, видалення, обмеження, портативність, заперечення та скарга до наглядового органу (у Північному Рейні-Вестфалії — LDI NRW). Відкликання згоди — у налаштуваннях, на майбутнє.",
        "Строк зберігання",
        "Згоди й тема лишаються, доки ви їх не зміните або не очистите сховище браузера.",
      ],
    },
  },
  {
    id: "cookies",
    draft: true,
    title: { de: "Cookies & lokale Speicherung", uk: "Файли cookie та локальне сховище" },
    seoDesc: {
      de: "Welche Speicherung diese Website nutzt — Entwurf.",
      uk: "Що зберігає цей сайт — чернетка.",
    },
    body: {
      de: [
        "Entwurf. Keine Werbe- oder Statistik-Cookies.",
        "Notwendig",
        "Theme (hell / dunkel / System), Sprache, Karten-Einwilligung. Technisch nötig, damit Einstellungen und die Karte nicht gegen Ihren Willen laden.",
        "Dritte",
        "Salonkee, Instagram, Apple oder Google Maps nur, wenn Sie den jeweiligen Link oder die Karten-Einwilligung nutzen. Dann gelten deren Hinweise.",
        "Speicherdauer",
        "Lokal bis zur Änderung oder Löschung durch Sie.",
        "Einwilligung steuern",
        "Unter Einstellungen können Sie die Karten-Einwilligung entziehen. Die Karte baut dann keine Verbindung zu Apple auf.",
      ],
      uk: [
        "Чернетка. Немає рекламних чи статистичних cookie.",
        "Необхідне",
        "Тема, мова, згода на мапу — щоб інтерфейс працював і мапа не вантажилась без вашої волі.",
        "Треті сторони",
        "Salonkee, Instagram, Apple чи Google Maps — лише якщо ви самі переходите за посиланням або даєте згоду на мапу.",
        "Строк",
        "Локально, доки не зміните або не видалите.",
        "Керування згодою",
        "У налаштуваннях можна відкликати згоду на мапу. Тоді з’єднання з Apple не встановлюється.",
      ],
    },
  },
];

export const getLegal = (id: string) => legalDocs.find((doc) => doc.id === id);

export const legalTitle = (locale: Locale, id: LegalDocId) => {
  const doc = getLegal(id);
  return doc ? doc.title[locale] : id;
};
