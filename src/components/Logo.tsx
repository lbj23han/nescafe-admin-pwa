import Image from "next/image";
import { BRAND } from "@/constants/brand";

export function Logo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-14 h-14 rounded-3xl bg-[#8B5E3C] flex items-center justify-center mb-3 overflow-hidden">
        <Image
          src="/logo-cafe-ledger.png"
          alt={`${BRAND.appName} 로고`}
          width={56}
          height={56}
          className="w-10 h-10"
          priority
        />
      </div>

      <p className="text-lg font-semibold tracking-tight text-black">
        {BRAND.appName}
      </p>
      <p className="text-xs text-zinc-500 mt-1">{BRAND.tagline}</p>
    </div>
  );
}
