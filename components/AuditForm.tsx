import { Geist } from "next/font/google";
import Image from "next/image";
import auditFormBg from "@/public/media/audit-form-bg.png";
import dakshImg from "@/public/media/daksh-img.svg";

// Scoped to the closing line below — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

// Same transparent + hairline-underline treatment as the Footer's newsletter input.
const fieldClassName =
  "w-full border-b-[0.5px] border-hairline bg-transparent pb-2 text-[14px] font-normal text-white placeholder:text-white/40 focus:outline-none";

// Placeholder shell — audit form UI lands in the right column later.
export function AuditForm() {
  return (
    <section
      id="audit"
      className="flex w-full flex-col border-t-[0.5px] border-hairline py-7 desk:h-[calc(90vh-4rem)] desk:flex-row"
    >
      <div className="relative h-90 w-full desk:h-full desk:w-3/5">
        <Image src={auditFormBg} alt="" fill className="object-cover" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
              <Image src={dakshImg} alt="Daksh Aswal" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-normal text-white">Daksh Aswal</p>
              <p className="font-normal text-white/60">Creative Director</p>
            </div>
          </div>
          <p className={`${geist.className} text-[28px] font-medium leading-[120%] text-white desk:text-[40px]`}>
            See your site <span className="text-white/60">the way</span>
            <br />
            <span className="text-white/60">your buyer does.</span>
          </p>
        </div>
      </div>
      <form className="flex w-full flex-col gap-5 bg-[#0A0A0A] px-5 py-6 desk:h-full desk:w-2/5 desk:gap-9">
        <div className="flex flex-col gap-5 desk:flex-row">
          <input type="text" placeholder="First Name" className={fieldClassName} />
          <input type="email" placeholder="Work Email" className={fieldClassName} />
        </div>
        <div className="flex flex-col gap-5 desk:flex-row">
          <input type="text" placeholder="Site to audit" className={fieldClassName} />
          <input type="text" placeholder="Your LinkedIn" className={fieldClassName} />
        </div>
        <input type="text" placeholder="Your Buyers" className={fieldClassName} />
        <textarea
          placeholder="What isn't working?"
          className={`${fieldClassName} min-h-25 flex-1 resize-none`}
        />
        <input type="text" placeholder="Where you are at?" className={fieldClassName} />
        <button
          type="submit"
          className="w-full shrink-0 rounded-none bg-white py-2.5 text-[14px] font-medium text-black cursor-pointer"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
