import { title } from "process"
import * as z from "zod"

export default z.object({
  context: z.array(
    z
      .string()
      .describe(
        "L'ultima risposta - completa - inviata dall'assistente virtuale"
      )
  ),
  title: z.string().optional().describe("Il nome del vino"),
  type: z
    .array(
      z
        .enum([
          "Vini Rossi",
          "Vini Bianchi",
          "Vini Rosati",
          "Spumanti",
          "Dolci",
          "Any",
        ])
        .default("Any")
    )
    .default(["Any"])
    .describe(
      "La tipologia di vino, ad esempio 'Vini Rossi' o 'Vini Bianchi'. 'Any' significa nessun tipo specificato"
    ),
  produttore: z
    .array(
      z
        .string()
        .describe(
          "Il nome del produttore del vino. 'Any' significa nessun produttore specificato. Ad esempio 'Cortefabbri' o 'Cantina Spiritolibero'"
        )
        .default("Any")
    )
    .default(["Any"]),
  regione: z
    .array(z.string().default("Any"))
    .default(["Any"])
    .describe(
      "La regione Italiana di provenienza del vino, ad esempio 'Toscana' o 'Piemonte'"
    ),
  vitigni: z
    .array(z.string().default("Any"))
    .default(["Any"])
    .describe(
      "La tipologia di uve utilizzata per la produzione del vino, ad esempio 'Nebbiolo 100%' o 'Sangiovese 100%'"
    ),
  store: z
    .array(z.string().default("Any"))
    .default(["Any"])
    .describe(
      "Il nome del negozio o cantina che produce i vini pubblicati nel marketplace"
    ),
  priceTag: z
    .enum(["economico", "abbordabile", "costoso"])
    .optional()
    .describe(
      "Il budget dell'utente, economico significa minore o uguale a 15€, abbordabile significa tra 15 e 30, costoso significa oltre i 30 euro"
    ),
  tags: z.array(
    z
      .string()
      .describe(
        'Il nome generico del vino, contenente la denominazione e il tipo di uve, ad esempio "Barolo", "Chardonnay", "Gavi", etc... da usare solo se viene chiesta una denominazione specifica'
      )
      .default("Any")
  ),
})
