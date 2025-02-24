import * as z from "zod"

export default z.object({
  results: z.array(
    z.object({
      id: z.string(),
      imageUrl: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      properties: z.object({
        handle: z.string().optional(),
        material: z.string().optional(),
        colore: z.string().optional(),
        gusto: z.string().optional(),
        profumo: z.string().optional(),
        eventi: z.string().optional(),
        abbinamenti: z.string().optional(),
        vitigni: z.string().optional(),
        ecosostenibile: z.string().optional(),
      }),
    })
  ),
})
