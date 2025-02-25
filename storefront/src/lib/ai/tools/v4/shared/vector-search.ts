"use server"

import { getEmbedding } from "@lib/util/ai"
import { embed } from "ai"
import { getArrayFromIterator } from "@lib/util/ai"
import _ from "lodash"
import connectMongo from "@lib/ai/database"
import Wine from "@lib/ai/database/models/wine.model"
import { SimpleSearchResultItem } from "types/global"

const EMPTY_STRING = ""

const skipValues = [
  "di",
  "da",
  "il",
  "la",
  "un",
  "una",
  "del",
  "delle",
  "dello",
  "in",
  "con",
  "su",
  "fra",
  "tra",
  "dei",
  "d'",
]

const regexCondition = (
  exp: string | undefined,
  fieldName: string,
  regSearch: boolean = false
) => {
  let conditionObject: Record<string, any> = {}
  const value = regSearch ? exp?.replace(/ /g, "|") : exp
  conditionObject[fieldName] = {
    $regex: value && value.toLowerCase() !== "any" ? value : ".*",
    $options: "i",
  }
  return conditionObject
}

const inOrEqCondition = (exp: (string | undefined)[], fieldName: string) => {
  let conditionObject: Record<string, any> = {}
  if (exp) {
    const nonAnyValues = exp.filter((e) => e?.toLowerCase() !== "any")
    if (nonAnyValues.length > 0) {
      /*
      conditionObject[fieldName] =
        nonAnyValues.length > 1
          ? { $in: nonAnyValues.map((e) => e) }
          : { $eq: nonAnyValues[0] }
       */
      conditionObject[fieldName] = { $in: nonAnyValues.map((e) => e) }
    } else return null
  } else return null
  return conditionObject
}

const arrayToOrCondition = (
  fieldName: string,
  values: (string | undefined)[],
  regSearch: boolean = false
) => {
  if (!values) {
    return regexCondition("any", fieldName, regSearch)
  }
  if (values.length > 1) {
    return {
      $or: values.map((v) => regexCondition(v, fieldName, regSearch)),
    }
  } else {
    if (values[0]?.toLowerCase() !== "any") {
      return regexCondition(values[0], fieldName, regSearch)
    }
    return null
  }
}

const preProcessTags = (tags: string[]): string[] => {
  const result: string[] = []
  tags.forEach((t) => {
    result.push(t.toLowerCase())
    const parts = t.trim().split(/\s+/)
    if (parts.length > 1) {
      result.push(
        ...parts
          .filter((p) => !skipValues.includes(p))
          .map((p) => p.toLowerCase())
      )
    }
  })
  return result
}

const priceTagCondition = (priceTag: string | undefined) => {
  switch (priceTag) {
    case "economico":
      return { prezzo_vino: { $lte: 15 } }
    case "abbordabile":
      return {
        $and: [{ prezzo_vino: { $lte: 20 } }, { prezzo_vino: { $gte: 16 } }],
      }
    case "costoso":
      return { prezzo_vino: { $gt: 20 } }
    default:
      return null
  }
}

const generateVectorFilterQuery = (
  produttori: string[],
  regioni: string[],
  types: string[],
  vitigni: string[],
  priceTag: string | undefined,
  tags: string[]
): Record<string, any> => {
  const andCondition = [
    inOrEqCondition(
      types.map((w: string | undefined) => w).filter((w) => w !== undefined),
      "tipologia_vino"
    ),
    inOrEqCondition(
      regioni.map((r: string | undefined) => r).filter((r) => r !== undefined),
      "regione"
    ),
    inOrEqCondition(
      preProcessTags(
        tags.filter((t) => t !== undefined).map((t) => t.toLowerCase())
      ),
      "tags"
    ),
    inOrEqCondition(
      produttori
        .map((p: string | undefined) => p)
        .filter((p) => p !== undefined),
      "produttore"
    ),
    /*
    priceTagCondition(priceTag),
    */
  ]
  return { $and: andCondition.filter((e: any) => e !== null) }
}

/**
 * Generate Embeddings for the conversation
 * @param messages Array that contains message exchanged between user and assistant
 * @returns the vector embeddings of the messages
 */
export async function generateEmbeddings(messages: string[]) {
  const { embedding } = await embed({
    model: getEmbedding(),
    value: messages.join("\n"),
  })
  return embedding.values()
}

export async function basicSearch({
  max_results = 5,
  regioni,
  vitigni,
  types,
  tags,
}: {
  max_results: number
  regioni: string[]
  types: string[]
  vitigni: string[]
  tags: string[]
}): Promise<SimpleSearchResultItem[] | null> {
  await connectMongo()
  const filterObject = generateVectorFilterQuery(
    [],
    regioni,
    types,
    vitigni,
    undefined,
    tags
  )

  console.info(`Pre-Filter on VectorDB => ${JSON.stringify(filterObject)}`)
  try {
    const items = await Wine.find(filterObject).limit(max_results).exec()
    return items.map(
      (item) =>
        ({
          description: item.description,
          abbinamenti: item.abbinamenti,
          eventi: item.eventi,
        } as SimpleSearchResultItem)
    )
  } catch (err) {
    console.error(`Error in basicSearch: ${err}`)
    return null
  }
}

export async function searchByVendor({
  types,
  produttore,
}: {
  types: string[]
  produttore: string
}): Promise<string[] | null> {
  await connectMongo()
  const filterObject = generateVectorFilterQuery(
    [produttore],
    [],
    types,
    [],
    undefined,
    []
  )

  console.info(`Pre-Filter on VectorDB => ${JSON.stringify(filterObject)}`)
  try {
    const items = await Wine.find(filterObject).limit(100).exec()
    return items.map((item) => item.relatedProductId)
  } catch (err) {
    console.error(`Error in SearchByVendor: ${err}`)
    return null
  }
}

export async function vectorSearch({
  embeddings,
  max_results,
  regioni,
  types,
  produttori,
  vitigni,
  priceTag,
  tags,
}: {
  embeddings: IterableIterator<number> | undefined
  max_results: number
  regioni: string[]
  types: string[]
  produttori: string[]
  vitigni: string[]
  priceTag: string | undefined
  tags: string[]
}): Promise<string[]> {
  if (!embeddings) {
    throw new Error("Cannot apply aggregate on an empty vector")
  }

  await connectMongo()
  const filterObject = generateVectorFilterQuery(
    produttori,
    regioni,
    types,
    vitigni,
    priceTag,
    tags
  )

  console.info(`Pre-Filter on VectorDB => ${JSON.stringify(filterObject)}`) // * Debug

  const aggregatePipeline = [
    {
      $vectorSearch: {
        queryVector: getArrayFromIterator(embeddings),
        path: "description_embedding",
        numCandidates: 60,
        limit: max_results,
        index: "description_embedding_index",
        filter: {
          ...filterObject,
        },
      },
    },
    {
      $project: { vector: 0, description_embedding: 0 },
    },
    {
      $addFields: {
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $match: { score: { $gte: 0.8 } },
    },
  ]

  // * Execute the aggregation pipeline:
  const items = await Wine.aggregate(aggregatePipeline).exec()
  // * Debug:
  // console.info(`Wine Search Result => ${JSON.stringify(items)}`)
  // * Return found wine Ids:
  return items.map((item) => item.relatedProductId)
}
