import { i18n, Locale } from "./i18n";

namespace Template {
  export type Price = { amount: number };
}

export const dictionary = i18n.dictionary({
  appTitle: {
    [Locale.En]: "Reacti8n · Coffee Menu",
    [Locale.Fr]: "Reacti8n · Carte des Cafés",
    [Locale.De]: "Reacti8n · Kaffeekarte",
    [Locale.It]: "Reacti8n · Menù del Caffè",
    [Locale.Es]: "Reacti8n · Carta de Cafés",
  },
  tagline: {
    [Locale.En]: "Tiny, type-safe i18n for React — demonstrated on caffeine.",
    [Locale.Fr]: "Un i18n compact et typé pour React — illustré à la caféine.",
    [Locale.De]:
      "Schlankes, typsicheres i18n für React — am Koffein demonstriert.",
    [Locale.It]:
      "Un i18n compatto e tipizzato per React — dimostrato con caffeina.",
    [Locale.Es]:
      "Un i18n compacto y tipado para React — demostrado con cafeína.",
  },
  languageLabel: {
    [Locale.En]: "Language",
    [Locale.Fr]: "Langue",
    [Locale.De]: "Sprache",
    [Locale.It]: "Lingua",
    [Locale.Es]: "Idioma",
  },
  price: i18n.template<Template.Price>({
    [Locale.En]({ tokens, helpers }) {
      return helpers
        .numberFormat({ style: "currency", currency: "USD" })
        .format(tokens.amount);
    },
    [Locale.Fr]({ tokens, helpers }) {
      return helpers
        .numberFormat({ style: "currency", currency: "EUR" })
        .format(tokens.amount);
    },
    [Locale.De]({ tokens, helpers }) {
      return helpers
        .numberFormat({ style: "currency", currency: "EUR" })
        .format(tokens.amount);
    },
    [Locale.It]({ tokens, helpers }) {
      return helpers
        .numberFormat({ style: "currency", currency: "EUR" })
        .format(tokens.amount);
    },
    [Locale.Es]({ tokens, helpers }) {
      return helpers
        .numberFormat({ style: "currency", currency: "EUR" })
        .format(tokens.amount);
    },
  }),

  espressoName: {
    [Locale.En]: "Espresso",
    [Locale.Fr]: "Expresso",
    [Locale.De]: "Espresso",
    [Locale.It]: "Espresso",
    [Locale.Es]: "Espresso",
  },
  espressoDescription: {
    [Locale.En]:
      "A small, concentrated shot brewed by forcing hot water through finely-ground beans under pressure.",
    [Locale.Fr]:
      "Un café court et concentré, obtenu en faisant passer de l'eau chaude sous pression à travers des grains finement moulus.",
    [Locale.De]:
      "Ein kleiner, konzentrierter Kaffeeschuss, gebrüht indem heißes Wasser unter Druck durch fein gemahlene Bohnen gepresst wird.",
    [Locale.It]:
      "Un caffè breve e concentrato, ottenuto facendo passare acqua calda sotto pressione attraverso chicchi macinati finemente.",
    [Locale.Es]:
      "Un café corto y concentrado, preparado pasando agua caliente bajo presión a través de granos finamente molidos.",
  },

  cappuccinoName: {
    [Locale.En]: "Cappuccino",
    [Locale.Fr]: "Cappuccino",
    [Locale.De]: "Cappuccino",
    [Locale.It]: "Cappuccino",
    [Locale.Es]: "Cappuccino",
  },
  cappuccinoDescription: {
    [Locale.En]:
      "Equal parts espresso, steamed milk, and a thick crown of milk foam.",
    [Locale.Fr]:
      "Un espresso surmonté de lait chaud à parts égales et d'une épaisse couronne de mousse de lait.",
    [Locale.De]:
      "Espresso mit gleichen Teilen heißer Milch und einer dicken Krone aus Milchschaum.",
    [Locale.It]:
      "Un espresso con pari parti di latte caldo e una densa corona di schiuma di latte.",
    [Locale.Es]:
      "Un espresso con partes iguales de leche caliente y una espesa corona de espuma de leche.",
  },

  latteName: {
    [Locale.En]: "Latte",
    [Locale.Fr]: "Café Latte",
    [Locale.De]: "Latte",
    [Locale.It]: "Caffè Latte",
    [Locale.Es]: "Café con Leche",
  },
  latteDescription: {
    [Locale.En]:
      "A generous pour of steamed milk over a single shot of espresso, topped with a thin layer of foam.",
    [Locale.Fr]:
      "Un grand verre de lait chaud versé sur un espresso, garni d'une fine couche de mousse.",
    [Locale.De]:
      "Großzügig aufgeschäumte Milch über einem Espresso, gekrönt von einer feinen Schaumschicht.",
    [Locale.It]:
      "Generosa colata di latte caldo su un singolo espresso, sormontato da uno strato sottile di schiuma.",
    [Locale.Es]:
      "Una generosa cantidad de leche caliente vertida sobre un espresso, coronada por una fina capa de espuma.",
  },

  mochaName: {
    [Locale.En]: "Mocha",
    [Locale.Fr]: "Mocha",
    [Locale.De]: "Mokka",
    [Locale.It]: "Moka",
    [Locale.Es]: "Moca",
  },
  mochaDescription: {
    [Locale.En]:
      "A chocolatey twist on the latte — espresso, steamed milk, and a swirl of dark chocolate.",
    [Locale.Fr]:
      "Une variante chocolatée du latte — espresso, lait chaud et un tourbillon de chocolat noir.",
    [Locale.De]:
      "Eine schokoladige Variante des Latte — Espresso, heiße Milch und ein Schuss dunkle Schokolade.",
    [Locale.It]:
      "Una variante cioccolatosa del latte — espresso, latte caldo e un vortice di cioccolato fondente.",
    [Locale.Es]:
      "Una variante achocolatada del latte — espresso, leche caliente y un toque de chocolate oscuro.",
  },

  americanoName: {
    [Locale.En]: "Americano",
    [Locale.Fr]: "Americano",
    [Locale.De]: "Americano",
    [Locale.It]: "Americano",
    [Locale.Es]: "Americano",
  },
  americanoDescription: {
    [Locale.En]:
      "An espresso lengthened with hot water for a smoother, drip-style cup.",
    [Locale.Fr]:
      "Un espresso allongé à l'eau chaude pour une tasse plus douce, façon café filtre.",
    [Locale.De]:
      "Ein mit heißem Wasser verlängerter Espresso für eine mildere, filterkaffeeartige Tasse.",
    [Locale.It]:
      "Un espresso allungato con acqua calda per una tazza più morbida, in stile filtro.",
    [Locale.Es]:
      "Un espresso alargado con agua caliente para una taza más suave, estilo café de filtro.",
  },

  flatWhiteName: {
    [Locale.En]: "Flat White",
    [Locale.Fr]: "Flat White",
    [Locale.De]: "Flat White",
    [Locale.It]: "Flat White",
    [Locale.Es]: "Flat White",
  },
  flatWhiteDescription: {
    [Locale.En]:
      "A double espresso topped with velvety microfoam — bolder than a latte, smoother than a cappuccino.",
    [Locale.Fr]:
      "Un double espresso surmonté d'une microfoam veloutée — plus corsé qu'un latte, plus doux qu'un cappuccino.",
    [Locale.De]:
      "Ein doppelter Espresso mit samtigem Mikroschaum — kräftiger als ein Latte, weicher als ein Cappuccino.",
    [Locale.It]:
      "Un doppio espresso con vellutata microschiuma — più deciso di un latte, più morbido di un cappuccino.",
    [Locale.Es]:
      "Un doble espresso con microespuma aterciopelada — más intenso que un latte, más suave que un cappuccino.",
  },
});
