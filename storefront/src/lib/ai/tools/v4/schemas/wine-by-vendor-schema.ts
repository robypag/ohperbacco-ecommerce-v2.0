import * as z from "zod"

export default z.object({
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
    .string()
    .describe(
      "Il produttore del vino, indicato anche come venditore o cantina"
    ),
})
