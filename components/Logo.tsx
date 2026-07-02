import Image from "next/image";
import Link from "next/link";
import logo from "@/public/media/logo.png";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="PIXELUP LABS home">
      <Image src={logo} alt="" width={20} height={20} priority className="h-5 w-5" />
      <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-white">
        PIXELUP LABS
      </span>
    </Link>
  );
}
