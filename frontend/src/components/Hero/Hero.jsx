import { ArrowRight } from "lucide-react";
import HeroNavbar from "../HeroNavbar/HeroNavbar";
import ShinyText from "../ShinyText/ShinyText";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-sans">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col">
        <HeroNavbar />

        {/* Top descriptor row */}
        <div className="mx-auto w-full max-w-7xl px-6 pt-4 md:px-8">
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-12">
            <p className="max-w-md text-sm text-white/80 md:text-base">
              We deliver transformative programs that empower emerging product
              designers with cutting-edge expertise and vision to thrive
              globally.
            </p>
            <p className="text-sm text-white/80 md:text-base lg:text-right">
              8000+ Talented Designers Launched !
            </p>
          </div>
        </div>

        {/* Centre hero text */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center md:px-8">
          <p className="mb-5 text-xs uppercase tracking-tight text-white/80 md:text-sm">
            Seats for Next Program Opening Soon
          </p>

          <h1
            className="text-5xl tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            style={{ lineHeight: 0.85 }}
          >
            <span className="block font-medium text-white">Become</span>
            <ShinyText
              text="Product Leader."
              speed={3}
              spread={100}
              baseColor="#64CEFB"
              shineColor="#ffffff"
              className="font-medium pb-[0.08em]"
            />
          </h1>

          <a
            href="#apply"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-900 md:px-8 md:py-4 md:text-base"
          >
            Apply for Next Enrollment
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Bottom spacer so content sits visually centred */}
        <div className="h-16 md:h-24" />
      </div>
    </section>
  );
}
