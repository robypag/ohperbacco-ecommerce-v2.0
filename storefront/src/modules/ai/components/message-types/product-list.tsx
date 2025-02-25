import Image from "next/image"
import { Card, CardContent } from "modules/common/components/card"
import { Button } from "@medusajs/ui"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProductPreviewType } from "types/global"
import PlaceholderImage from "modules/common/icons/placeholder-image"

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
            <div key={item.id}>
              <motion.div
                className="flex flex-row gap-4 items-center mb-4"
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="size-14 bg-zinc-200 flex-shrink-0 rounded-lg">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title ?? "Product Image"}
                      width={48}
                      height={48}
                      className="w-14 h-14 rounded-lg aspect-auto object-contain"
                    />
                  ) : (
                    <PlaceholderImage
                      size={14}
                      className="w-14 h-14 rounded-lg aspect-auto object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Di {item.produttore}
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
              {/* Add divider if it's not the last item */}
              {index < items.length - 1 && (
                <hr className="border-t border-zinc-200 dark:border-zinc-800 mb-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
