import type { Metadata } from "next";
import { AuditForm } from "@/components/AuditForm";
import { ClientRoster } from "@/components/clients/ClientRoster";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { clients } from "@/lib/clients";
import { sitePublished, siteUpdated } from "@/lib/site-dates";

export const metadata: Metadata = {
  title: "Clients - PIXELUP LABS",
  description:
    "Explore the companies PixelUp Labs has partnered with across brand, website, and product design.",
  alternates: { canonical: "/clients" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.pixeluplabs.com/clients/#webpage",
  url: "https://www.pixeluplabs.com/clients/",
  name: "Clients - PIXELUP LABS",
  description:
    "Companies PixelUp Labs has partnered with across brand, website, and product design.",
  datePublished: sitePublished,
  dateModified: siteUpdated.clients,
  isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
  about: { "@id": "https://www.pixeluplabs.com/#organization" },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: clients.length,
    itemListElement: clients.map((client, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        name: client.name,
      },
    })),
  },
};

export default function ClientsPage() {
  return (
    <div className="relative">
      <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <LeftNav
          sticky
          balanceHero
          variant="clients"
          showTrustedStrip={false}
          heading="We help ambitious companies look ready for what comes next"
          subheading={
            <>
              From focused brand systems to full product and website engagements,
              every partnership is built to make the company easier to trust.
            </>
          }
        />
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <main className="flex min-w-0 flex-1 flex-col gap-8">
          <ClientRoster clients={clients} />
          <AuditForm />
          <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
