import Image from "next/image"
import { Card, CardContent } from "modules/common/components/card"
import { Button } from "@medusajs/ui"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProductPreviewType } from "types/global"

export interface ProductListItem {
  id: string
  imageUrl: string
  title?: string
  description?: string
  store_name?: string
  properties: {
    handle?: string
    material?: string
    colore?: string
    gusto?: string
    profumo?: string
    eventi?: string
    abbinamenti?: string
    vitigni?: string
    ecosostenibile?: string
  }
}

interface ProductListProps {
  items: ProductPreviewType[]
}

export default function ProductList({ items }: ProductListProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          {items.map((item, index) => (
            <motion.div
              className="flex flex-row gap-4 items-center"
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <div className="size-14 bg-zinc-200 flex-shrink-0 rounded-lg">
                <Image
                  src={
                    item.thumbnail ?? "/placeholder.svg?height=200&width=200"
                  }
                  alt={item.title ?? "Product Image"}
                  width={48}
                  height={48}
                  className="w-14 h-14 rounded-lg aspect-auto object-contain"
                />
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col gap-1">
                  <div className="text-sm">{item.title}</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Prodotto da{" "}
                    <div className="text-sm hover:underline">
                      <b>{item.produttore}</b>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-start">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="text-zinc-800">
                      <Link href={`/products/${item.handle}`}>
                        <Button
                          variant="transparent"
                          size="base"
                          className="flex items-center gap-1"
                        >
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
