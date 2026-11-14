import type { SalonkeeCategory } from "@/lib/booking";

export type TeamMember = {
  slug: string;
  name: string;
  specialty: { de: string; uk: string } | null;
  line: { de: string; uk: string } | null;
  photo: string | null;
  /** CSS object-position for the portrait crop. */
  objectPosition: string;
  /** Salonkee category list this master's booking button opens. */
  salonkeeCategory: SalonkeeCategory;
};

export const team: TeamMember[] = [
  {
    slug: "kristina",
    name: "Kristina",
    specialty: {
      de: "Wimpern- und Augenbrauenlaminierung",
      uk: "Ламінування вій і брів",
    },
    line: {
      de: "Meisterin der Wimpern- und Augenbrauenlaminierung",
      uk: "Майстриня ламінування вій і брів",
    },
    photo: "/photos/team/kristina.jpg",
    objectPosition: "50% 18%",
    salonkeeCategory: "augenbrauen-und-make-up",
  },
  {
    slug: "diana",
    name: "Diana",
    specialty: {
      de: "Wimpernverlängerung",
      uk: "Нарощування вій",
    },
    line: {
      de: "Expertin für Wimpernverlängerung",
      uk: "Майстриня з нарощування вій",
    },
    photo: null,
    objectPosition: "50% 20%",
    salonkeeCategory: "augenbrauen-und-make-up",
  },
  {
    slug: "anastasiia",
    name: "Anastasiia",
    specialty: { de: "Nageldesign", uk: "Дизайн нігтів" },
    line: { de: "Nageldesignerin", uk: "Майстриня манікюру" },
    photo: null,
    objectPosition: "50% 20%",
    salonkeeCategory: "nagelstudio",
  },
  {
    slug: "viktoriia",
    name: "Viktoriia",
    specialty: null,
    line: null,
    photo: "/photos/team/viktoriia.jpg",
    objectPosition: "50% 15%",
    salonkeeCategory: "friseure",
  },
  {
    slug: "ilona",
    name: "Ilona",
    specialty: null,
    line: null,
    photo: "/photos/team/ilona.jpg",
    objectPosition: "48% 12%",
    salonkeeCategory: "friseure",
  },
  {
    slug: "karina",
    name: "Karina",
    specialty: { de: "Kosmetik", uk: "Косметологія" },
    line: { de: "Kosmetikerin", uk: "Косметологиня" },
    photo: "/photos/team/karina.jpg",
    objectPosition: "50% 18%",
    salonkeeCategory: "gesichtspflege",
  },
  {
    slug: "anzhelika",
    name: "Anzhelika",
    specialty: { de: "Nageldesign", uk: "Дизайн нігтів" },
    line: { de: "Nageldesignerin", uk: "Майстриня манікюру" },
    photo: null,
    objectPosition: "50% 20%",
    salonkeeCategory: "nagelstudio",
  },
  {
    slug: "tetiana",
    name: "Tetiana",
    specialty: { de: "Nageldesign", uk: "Дизайн нігтів" },
    line: { de: "Nageldesignerin", uk: "Майстриня манікюру" },
    photo: null,
    objectPosition: "50% 20%",
    salonkeeCategory: "nagelstudio",
  },
  {
    slug: "olha",
    name: "Olha",
    specialty: { de: "Nageldesign", uk: "Дизайн нігтів" },
    line: { de: "Nageldesignerin", uk: "Майстриня манікюру" },
    photo: null,
    objectPosition: "50% 20%",
    salonkeeCategory: "nagelstudio",
  },
  {
    slug: "kateryna",
    name: "Kateryna",
    specialty: { de: "Nageldesign", uk: "Дизайн нігтів" },
    line: { de: "Nageldesignerin", uk: "Майстриня манікюру" },
    photo: null,
    objectPosition: "50% 20%",
    salonkeeCategory: "nagelstudio",
  },
];

export const getMember = (slug: string) => team.find((item) => item.slug === slug);
