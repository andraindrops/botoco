"use client";

import Image from "next/image";

import { cn } from "@/_lib/utils";

export default function Component({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {}) {
  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* <section className="grid gap-8">
        <h2 className="font-black text-xl">
          Do your daily tasks with a mini AI agent
        </h2>
        <div className="grid">
          <p className="font-thin text-lg text-slate-900">
            A mini AI agent powered by the Plan-ReAct approach, which
            transparently plans its tasks step-by-step.
          </p>
        </div>
      </section> */}
      <section className="grid gap-8">
        <div className="w-full">
          <Image
            src="/key.png"
            alt="Key image"
            width={1200}
            height={630}
            className="block"
          />
          {/* <iframe
            className="h-full w-full border-0"
            src="https://www.youtube.com/embed/ztLA-GkNBFM?si=mEc5SM4PoosugC3a"
            title="Botoco introduction"
            allowFullScreen
            loading="lazy"
          /> */}
        </div>
      </section>
    </div>
  );
}
