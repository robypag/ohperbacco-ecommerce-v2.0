import Link from "next/link"
import { IconBacco } from "@modules/common/icons/bacco"

export const Overview = () => {
  return (
    <div key="overview" className="max-w-3xl mx-auto md:mt-10">
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl max-h-[450px]">
        <p className="flex flex-row justify-center gap-4 items-center">
          <IconBacco className="w-32 h-32" />
        </p>
        <p>
          <Link
            className="font-medium underline underline-offset-4"
            href="/about-bacco"
            target="_blank"
          >
            Bacco
          </Link>{" "}
          è un assistente virtuale pensato per rendere la tua esperienza di
          acquisto facile e veloce. Può aiutarti nel trovare il Vino più adatto,
          fornirti informazioni sui tuoi ordini, sulle cantine affiliate e molto
          altro.
        </p>
        <p className="text-lg font-bold">Come posso aiutarti oggi?</p>
      </div>
    </div>
  )
}
