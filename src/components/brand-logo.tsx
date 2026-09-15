import Image from "next/image";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <>
    <Image src="/brand/serendib-icon.png" alt="" width={40} height={40} className="serendibBrandIcon" priority/>
    {!compact && <span>Serendib</span>}
  </>;
}
