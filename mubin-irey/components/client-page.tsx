'use client';

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  CalendarDays,
  MapPin,
  Clock3,
  Camera,
  Flower2,
  Sparkles,
  ExternalLink,
  Mail,
} from "lucide-react";

type IntroStage = "closed" | "opening" | "opened";

function EnvelopeIntro({ stage, onOpen }: { stage: IntroStage; onOpen: () => void }) {
  const isOpening = stage === "opening";
  const isOpened = stage === "opened";
  const isActive = isOpening || isOpened;

  return (
    <>
      {/* Dark background */}
      <div
        className={`fixed inset-0 z-40 bg-[#1a0509] transition-opacity duration-700 ${
          isOpened ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Envelope — centered, fades away after open */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-[700ms] ${
          isOpened ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
      >
        {/* Outer glow ring */}
        <div
          className="relative cursor-pointer"
          style={{ filter: "drop-shadow(0 8px 32px rgba(200,163,144,0.18))" }}
          onClick={() => { if (stage === "closed") onOpen(); }}
        >
          {/* Envelope container */}
          <div className="relative w-[380px] h-[260px]" style={{ perspective: "900px" }}>

            {/* Envelope body SVG — z-index 3 */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 380 260"
              xmlns="http://www.w3.org/2000/svg"
              style={{ zIndex: 3 }}
            >
              <defs>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e0d12" />
                  <stop offset="100%" stopColor="#1a0509" />
                </linearGradient>
                <linearGradient id="leftFold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b1018" />
                  <stop offset="100%" stopColor="#2a0c10" />
                </linearGradient>
                <linearGradient id="rightFold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2a0c10" />
                  <stop offset="100%" stopColor="#3b1018" />
                </linearGradient>
                <linearGradient id="bottomFold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a1520" />
                  <stop offset="100%" stopColor="#2e0d12" />
                </linearGradient>
              </defs>

              {/* Main body */}
              <rect x="0" y="0" width="380" height="260" rx="6" fill="url(#bodyGrad)" />

              {/* Left triangle fold */}
              <polygon points="0,0 190,145 0,260" fill="url(#leftFold)" />

              {/* Right triangle fold */}
              <polygon points="380,0 190,145 380,260" fill="url(#rightFold)" />

              {/* Bottom triangle fold */}
              <polygon points="0,260 190,145 380,260" fill="url(#bottomFold)" />

              {/* Subtle border */}
              <rect x="0.5" y="0.5" width="379" height="259" rx="6" fill="none" stroke="#c8a390" strokeWidth="0.8" strokeOpacity="0.3" />

              {/* Inner fold lines for realism */}
              <line x1="0" y1="0" x2="190" y2="145" stroke="#c8a390" strokeWidth="0.4" strokeOpacity="0.15" />
              <line x1="380" y1="0" x2="190" y2="145" stroke="#c8a390" strokeWidth="0.4" strokeOpacity="0.15" />
              <line x1="0" y1="260" x2="190" y2="145" stroke="#c8a390" strokeWidth="0.4" strokeOpacity="0.15" />
              <line x1="380" y1="260" x2="190" y2="145" stroke="#c8a390" strokeWidth="0.4" strokeOpacity="0.15" />
            </svg>

            {/* Flap SVG — z-index 4 */}
            <div
              className="absolute top-0 left-0 w-[380px] h-[130px]"
              style={{
                transformOrigin: "top center",
                transform: isActive ? "rotateX(-180deg)" : "rotateX(0deg)",
                transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)",
                zIndex: 4,
              }}
            >
              <svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg" style={{ width: 380, height: 130 }}>
                <defs>
                  <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b1a26" />
                    <stop offset="100%" stopColor="#3b0d17" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 380,0 190,130" fill="url(#flapGrad)" />
                {/* Flap border line */}
                <line x1="0" y1="0" x2="190" y2="130" stroke="#c8a390" strokeWidth="0.5" strokeOpacity="0.25" />
                <line x1="380" y1="0" x2="190" y2="130" stroke="#c8a390" strokeWidth="0.5" strokeOpacity="0.25" />
              </svg>
            </div>

            {/* Wax seal — fades out when flap opens */}
            <img
              src="/wax.png"
              alt="wax seal"
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: "72px",
                width: "96px",
                zIndex: 5,
                opacity: isActive ? 0 : 1,
                transition: "opacity 0.25s ease",
                pointerEvents: "none",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
              }}
            />

            {/* Card — z-index 2, hidden behind envelope body */}
            <div
              className="absolute left-1/2 w-[300px] border border-[#ead7ca]/40 rounded-xl p-5 text-center"
              style={{
                bottom: 12,
                zIndex: 2,
                background: "linear-gradient(160deg, #fffaf7 0%, #fff4ee 100%)",
                transform: isActive
                  ? "translateX(-50%) translateY(-110px)"
                  : "translateX(-50%) translateY(0px)",
                transition: isActive
                  ? "transform 0.6s 0.55s cubic-bezier(0.34,1.1,0.64,1)"
                  : "none",
              }}
            >
              <p
                className="text-[#3b0d17] text-3xl"
                style={{ fontFamily: "'Edwardian Script ITC', Georgia, serif" }}
              >
                Mubin &amp; Irey
              </p>
              <div className="my-2 h-px bg-gradient-to-r from-transparent via-[#c8a390]/60 to-transparent" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#c8a390]">
                18 April 2026
              </p>
            </div>

          </div>
        </div>

        {/* Hint text */}
        {!isActive && (
          <p
            className="mt-8 text-[#c8a390]/70 tracking-[0.3em] text-[11px] uppercase"
            style={{ fontFamily: "serif" }}
          >
            Click to open
          </p>
        )}
      </div>
    </>
  );
}

const eventDate = new Date("2026-09-04T12:00:00+08:00");

const couple = {
  bride: "Asmahiran Binti Mohd Asri",
  groom: "Mubin Bin Che Soh",
};

const details = [
  {
    icon: CalendarDays,
    title: "Tarikh",
    value: "Jumaat, 4 September 2026",
    sub: "22 Rabiulawal 1448 H",
  },
  {
    icon: Clock3,
    title: "Masa",
    value: "12:00 PM - 5:00 PM",
    sub: "Jamuan santai hingga petang",
  },
  {
    icon: MapPin,
    title: "Lokasi",
    value: "Kampung Bendang Pak Yong, Tumpat, Kelantan",
    sub: "Majlis di kediaman keluarga",
  },
];

const schedule = [
  {
    time: "12:00 PM",
    title: "Ketibaan Pengantin",
    note: "Sambutan keluarga dan tetamu",
  },
  {
    time: "1:00 PM – 4:00 PM",
    title: "Jamuan & Sesi Santai",
    note: "Makan, berbual dan bergambar",
  },
  {
    time: "5:00 PM",
    title: "Majlis Bersurai",
    note: "Penutup dan salam perpisahan",
  },
];

function useCountdown(targetDate: Date) {
  const calculateTimeLeft = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

type PaperFrameProps = {
  children: React.ReactNode;
  className?: string;
};

function PaperFrame({ children, className = "" }: PaperFrameProps) {
  return (
    <div
      className={`relative rounded-[2rem] bg-[#fffaf7]/95 ${className}`}
    >
      <div className="absolute inset-3 rounded-[1.45rem] pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <p className="uppercase tracking-[0.35em] text-xs text-[#c8a390] mb-3">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-5xl text-[#3b0d17] leading-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm md:text-base leading-8 text-[#7d5c55]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FloralCorners() {
  return (
    <>
      <div className="absolute top-5 left-5 text-[#c8a390]/55">
        <Flower2 className="w-8 h-8" />
      </div>
      <div className="absolute bottom-5 right-5 text-[#c8a390]/55 rotate-180">
        <Flower2 className="w-8 h-8" />
      </div>
    </>
  );
}

function FullWidthDivider() {
  return (
    <div className="mx-[-1rem] md:mx-[-2rem] my-8 md:my-10">
      <div
        className="w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] h-[72px] md:h-[110px] bg-repeat-x bg-left-top"
        style={{
          backgroundImage: "url('/flower1.png')",
          backgroundSize: "auto 100%",
        }}
      />
    </div>
  );
}

export default function WeddingInviteMaroonCream() {
  const [wishes, setWishes] = useState<{ name: string; wish: string }[]>([]);
  const [wishesLoading, setWishesLoading] = useState(true);
  const [wishesError, setWishesError] = useState("");

  const [introStage, setIntroStage] = useState<IntroStage>("closed");
  const countdown = useCountdown(eventDate);
  const [activeMap, setActiveMap] = useState<"google" | "waze">("google");
  const countdownItems = useMemo(
    () => [
      { label: "Hari", value: countdown.days },
      { label: "Jam", value: countdown.hours },
      { label: "Minit", value: countdown.minutes },
      { label: "Saat", value: countdown.seconds },
    ],
    [countdown]
  );

  const loadWishes = async () => {
    try {
      setWishesLoading(true);
      setWishesError("");

      const sheetUrl =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8PYAw87bSgiUPN1flygDlaQuPn3fB7BEPVJtGuxJDSwj8JmAZHAAjN0PcDPhjceyd1JKBAORxHMAb/pub?gid=1547346854&single=true&output=csv";

      const response = await fetch(sheetUrl);
      const text = await response.text();

      const rows = text
        .split("\n")
        .map((row) =>
          row
            .split(",")
            .map((cell) => cell.replace(/^"|"$/g, "").trim())
        );

      const data = rows
        .slice(1)
        .map((row) => ({
          name: row[2] || "Tetamu",
          wish: row[4] || "",
        }))
        .filter((item) => item.wish);

      setWishes(data.reverse());
    } catch (error) {
      setWishesError("Gagal memuatkan ucapan. Sila cuba semula.");
    } finally {
      setWishesLoading(false);
    }
  };

  useEffect(() => {
    loadWishes();
  }, []);

  const handleOpenEnvelope = () => {
    setIntroStage("opening");
    setTimeout(() => {
      setIntroStage("opened");
    }, 950); // matches the scale-up delay
  };

  return (
    <div className="min-h-screen bg-[#3b0d17] overflow-x-hidden">
      <EnvelopeIntro stage={introStage} onOpen={handleOpenEnvelope} />

      <main
        className={`relative z-[46] transition-opacity duration-500 delay-[800ms] ${
          introStage === "opened" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="pt-20 md:pt-24 pb-14 px-4 md:px-8">
          <div className="mx-auto w-[92vw] max-w-[1120px] min-h-[82vh] rounded-[34px] relative overflow-hidden bg-[#fffdfb]">
            <div className="absolute inset-0">
              {/* FIXED CORNER FLOWERS */}
              <img
                src="/flower2.png"
                alt=""
                className="fixed bottom-0 right-0 z-40 w-[130px] md:w-[180px] opacity-70 pointer-events-none select-none"
              />

              <img
                src="/flower2.png"
                alt=""
                className="fixed bottom-0 left-0 z-40 w-[130px] md:w-[180px] opacity-70 pointer-events-none select-none scale-x-[-1]"
              />
            </div>

            <div className="relative px-4 md:px-8 pt-8 md:pt-10 pb-10 md:pb-14">
              <section className="pb-10 md:pb-16">
                <div className="max-w-6xl mx-auto">
                  {/* <PaperFrame className="p-4 md:p-8 lg:p-10 overflow-hidden bg-[#fffaf7]"> */}

                    <div className="gap-6 md:gap-8 items-stretch">
                      {/* <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={
                          introStage === "opened"
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 24 }
                        }
                        transition={{ duration: 0.7 }}
                        className="relative rounded-[1.8rem] overflow-hidden min-h-[430px] md:min-h-[600px]"
                      >
                      </motion.div> */}

                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={
                          introStage === "opened"
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 24 }
                        }
                        transition={{ duration: 0.7, delay: 0.08 }}
                        className="flex flex-col gap-5"
                      >

                        <PaperFrame className="p-6 md:p-7 rotate-[-1deg] bg-[#fffdfb] border border-[#efe2d8] ">
                          
                           {/* CORNER DECOR */}
                          <div className="absolute -top-6 -left-6 z-20 pointer-events-none select-none">

                          {/* Ribbon */}
                          <img
                            src="/ribbon.png"
                            alt=""
                            className="relative left-3 top-4 w-[140px] md:w-[160px] "
                          />

                          {/* Wax */}
                          <img
                            src="/wax.png"
                            alt=""
                            className="absolute top-[10px] left-[14px] w-[80px] md:w-[70px] rotate-[-8deg]"
                          />

                        </div>

                          <div className="flex items-center gap-2 text-[#3b0d17] mb-4">
                          </div>

                          <div className="flex items-center gap-2 text-[#3b0d17] mb-4">
                          </div>

                          {/* CENTERED SECTION */}
                          <div className="flex flex-col items-center text-center">
                            <img
                              src="/bismillah.svg"
                              alt="Bismillah"
                              className="w-[180px] md:w-[220px] mb-4 opacity-95"
                            />
                          </div>

                          {/* LEFT ALIGNED TEXT */}
                          <p className="text-sm md:text-base leading-8 text-[#7d5c55] text-center mt-4">
                            Dengan penuh kesyukuran ke hadrat Ilahi, kami
                          </p>

                          <div className="mt-3 flex flex-col items-center text-center text-[#7d5c55]">
                            <span className="text-sm md:text-base font-semibold tracking-wide uppercase">
                              Nama Bapa
                            </span>

                            <span className="my-1 text-sm md:text-base text-[#c8a390]">&</span>

                            <span className="text-sm md:text-base font-semibold tracking-wide uppercase">
                              Nama Ibu
                            </span>
                          </div>

                          <p className="mt-3 text-sm md:text-base leading-8 text-[#7d5c55] text-center">
                            menyusun sepuluh jari menjemput Tuan, Puan, Encik dan Cik 
                             untuk memeriahkan majlis perkahwinan anakanda kami,
                          </p>

                          <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#d9b7a5] to-transparent" />

                          <h1 className="flex flex-col items-center text-center text-3xl md:text-5xl leading-[1.2] mt-3 [font-family:'Edwardian'] text-[#5f2631]">
                            <span>{couple.groom}</span>

                            <img
                              src="/%26.svg"
                              alt="and"
                              className="w-5 md:w-8 my-2 opacity-80"
                            />

                            <span>{couple.bride}</span>
                          </h1>

                          <p className="mt-3 text-sm md:text-base leading-8 text-[#7d5c55] text-center">
                            pada 4 September 2026 bersamaan 22 Rabiulawal 1448 H di Kampung Bendang Pak Yong, Tumpat, Kelantan.
                          </p>

                          <p className="mt-3 text-sm md:text-base leading-8 text-[#7d5c55] text-center">
                            Semoga dengan kehadiran Tuan / Puan / Encik / Cik menjadi penyeri majlis dan membawa berkat sepanjang hayat mereka.                          </p>

                          <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#d9b7a5] to-transparent" />

                        </PaperFrame>
                      </motion.div>
                    </div>
                  {/* </PaperFrame> */}
                </div>
              </section>

              <section id="rsvp" className="pb-8">
                <div className="max-w-5xl mx-auto">
                  <PaperFrame className="p-6 md:p-10 bg-[linear-gradient(135deg,#3b0d17_0%,#5b1826_100%)] text-[#fff8f3] overflow-hidden">
                    <div className="absolute inset-0 opacity-20 " />
                    <div className="relative grid md:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
                      <div>
                        <p className="uppercase tracking-[0.35em] text-xs text-[#ead0c1] mb-3">
                          RSVP
                        </p>

                        <h3 className="font-serif text-3xl md:text-5xl leading-tight">
                          Sudi Kiranya Mengesahkan Kehadiran
                        </h3>

                        <p className="mt-4 leading-8 text-sm md:text-base text-[#fff4ef] max-w-xl">
                          Dengan penuh hormat, kami memohon jasa baik Tuan/Puan untuk mengesahkan kehadiran ke majlis kami. Kehadiran dan doa restu amat kami hargai.
                        </p>

                        <a
                          href="https://forms.gle/EMA5cjbf3dR231GGA"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fff8f3] text-[#3b0d17] px-5 py-3 text-sm hover:opacity-90 transition"
                        >
                          Sahkan Kehadiran <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                    </div>
                  </PaperFrame>
                </div>
              </section>

              <section className="pb-10 md:pb-16">
                <div className="max-w-5xl mx-auto">
                  <SectionHeading
                    eyebrow="Maklumat Majlis"
                    title="Seindah Kenangan, Semanis Kehadiran"
                    description="Dengan penuh kesyukuran, kami kongsikan butiran majlis untuk memudahkan kehadiran Tuan dan Puan ke hari bahagia kami."
                  />

                  <PaperFrame className="p-6 md:p-10 bg-[#fffdfb] rounded-tl-[2.5rem] rounded-tr-[5rem] rounded-br-[2rem] rounded-bl-[1.5rem] overflow-hidden">
                    
                    {/* DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-[#d9b7a5]/70 text-center gap-8 md:gap-0">
                      {details.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div key={item.title} className="md:px-8">
                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f4e5db] text-[#b98f7c]">
                              <Icon className="h-4 w-4" />
                            </div>

                            <h3 className="text-xs uppercase tracking-[0.28em] text-[#3b0d17] font-semibold">
                              {item.title}
                            </h3>

                            <p className="mt-3 text-sm md:text-base leading-7 text-[#7d5c55]">
                              {item.value}
                            </p>

                            <p className="mt-1 text-sm leading-6 text-[#c8a390]">
                              {item.sub}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* SOFT DIVIDER */}
                    <div className="my-8 md:my-10 h-px bg-gradient-to-r from-transparent via-[#d9b7a5] to-transparent" />

                    {/* COUNTDOWN */}
                    <div className="text-center">
                      <p className="uppercase tracking-[0.3em] text-xs text-[#c8a390] mb-3">
                        Countdown
                      </p>

                      <h3 className="font-serif text-3xl md:text-4xl text-[#3b0d17]">
                        Menanti Hari Bahagia
                      </h3>

                      <p className="mt-3 text-sm md:text-base leading-8 text-[#7d5c55] max-w-2xl mx-auto">
                        Semakin hampir hari yang dinanti, semoga segala urusan majlis dipermudahkan.
                      </p>

                      <div className="mt-6 grid grid-cols-4 gap-2 md:gap-4">
                        {countdownItems.map((item) => (
                          <div
                            key={item.label}
                            className="text-center"
                          >
                            <p className="font-serif text-3xl md:text-5xl text-[#3b0d17] leading-none">
                              {item.value}
                            </p>

                            <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.22em] text-[#c8a390]">
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </PaperFrame>
                </div>
              </section>

<FullWidthDivider />

<section className="pb-10 md:pb-16">
  <div className="max-w-6xl mx-auto">
    <PaperFrame className="p-6 md:p-8 bg-[#fffdfb]">
      <p className="uppercase tracking-[0.3em] text-xs text-[#c8a390] mb-4">
        Aturcara
      </p>

      <h3 className="font-serif text-3xl md:text-4xl text-[#3b0d17] mb-6">
        Perjalanan Majlis
      </h3>

      <div className="divide-y divide-[#ead7ca]">
        {schedule.map((item) => (
          <div
            key={item.time}
            className="grid grid-cols-[90px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-6 py-4 md:py-5 items-start"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-[#c8a390]">
              {item.time}
            </p>

            <div>
              <h4 className="font-serif text-2xl text-[#3b0d17]">
                {item.title}
              </h4>
              {item.note && (
                <p className="mt-1 text-[#7d5c55] leading-7">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </PaperFrame>
  </div>
</section>

<FullWidthDivider />

<section id="venue" className="pb-10 md:pb-16">
  <div className="max-w-6xl mx-auto">
    <PaperFrame className="p-6 md:p-8 bg-[#fffdfb]">
      <div className="flex items-center gap-3 mb-4 text-[#c8a390]">
        <MapPin className="w-5 h-5" />
        <p className="uppercase tracking-[0.3em] text-xs text-[#c8a390]">
          Lokasi
        </p>
      </div>

      <h3 className="font-serif text-3xl text-[#3b0d17]">
        Lokasi Majlis
      </h3>

      <p className="mt-4 text-[#7d5c55] leading-8">
        Kampung Bendang Pak Yong,
        <br />
        Tumpat, Kelantan
      </p>

      <p className="mt-4 text-sm md:text-base leading-8 text-[#7d5c55]">
        Sila pilih peta di bawah untuk panduan arah ke lokasi majlis.
      </p>

      {/* MAP TABS */}
      <div className="mt-6 rounded-[2rem] border border-[#ead7ca] bg-[#fff8f3] p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveMap("google")}
            className={`rounded-full px-4 py-3 text-sm transition ${
              activeMap === "google"
                ? "bg-[#3b0d17] text-[#fff8f3]"
                : "bg-white text-[#3b0d17] hover:bg-[#f4e5db]"
            }`}
          >
            Google Maps
          </button>

          <button
            type="button"
            onClick={() => setActiveMap("waze")}
            className={`rounded-full px-4 py-3 text-sm transition ${
              activeMap === "waze"
                ? "bg-[#3b0d17] text-[#fff8f3]"
                : "bg-white text-[#3b0d17] hover:bg-[#f4e5db]"
            }`}
          >
            Waze
          </button>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-[#ead7ca] bg-white">
          {activeMap === "google" ? (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3966.689226527842!2d102.08616699999999!3d6.1723479999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTAnMjAuNSJOIDEwMsKwMDUnMTAuMiJF!5e0!3m2!1sen!2smy!4v1747293989024!5m2!1sen!2smy"
              className="w-full h-[320px] md:h-[420px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <iframe
              src="https://embed.waze.com/iframe?zoom=16&lat=6.172276&lon=102.086377&ct=livemap&pin=1&desc=Target%20Location&navigate=yes"
              className="w-full h-[320px] md:h-[420px]"
              allowFullScreen
            />
          )}
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="https://maps.app.goo.gl/"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#3b0d17] text-[#fff8f3] px-5 py-3 text-sm hover:opacity-90 transition"
        >
          Buka Google Maps <ExternalLink className="w-4 h-4" />
        </a>

        <a
          href="https://www.waze.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm text-[#3b0d17] border border-[#ead7ca] hover:bg-[#fff8f3] transition"
        >
          Buka Waze <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </PaperFrame>
  </div>
</section>

<FullWidthDivider />

              {/* <section className="pb-10 md:pb-16">
                <div className="max-w-6xl mx-auto">
                  <SectionHeading
                    eyebrow="Gallery"
                    title="A curated frame wall, not a busy album"
                    description="Your current site already includes a gallery, countdown, venue links, and RSVP. This refresh keeps only the strongest pieces and presents them in a more refined way."
                  />
                </div>
              </section> */}

              <section id="wishes" className="pb-10 md:pb-16">
                <div className="max-w-5xl mx-auto">
                  <PaperFrame className="p-6 md:p-10 bg-transparent border border-[#ead7ca]">
                    <div className="text-center mb-8">
                      <p className="uppercase tracking-[0.35em] text-xs text-[#c8a390] mb-3">
                        Ucapan & Doa
                      </p>

                      <h3 className="font-serif text-3xl md:text-5xl text-[#3b0d17]">
                        Titipan Buat Pengantin
                      </h3>

                      <p className="mt-4 text-sm md:text-base leading-8 text-[#7d5c55] max-w-2xl mx-auto">
                        Terima kasih atas ucapan, doa dan ingatan tulus daripada keluarga serta sahabat handai.
                      </p>
                    </div>

                    <div className="flex justify-center mb-6">
                      <button
                        type="button"
                        onClick={loadWishes}
                        className="rounded-full border border-[#ead7ca] bg-[#fff8f3] px-5 py-3 text-sm text-[#3b0d17] hover:bg-[#f4e5db] transition"
                      >
                        Muat Semula Ucapan
                      </button>
                    </div>

                    {wishesLoading && (
                      <p className="text-center text-[#7d5c55]">
                        Sedang memuatkan ucapan...
                      </p>
                    )}

                    {wishesError && (
                      <p className="text-center text-[#9b2c2c]">
                        {wishesError}
                      </p>
                    )}

                    {!wishesLoading && !wishesError && wishes.length === 0 && (
                      <p className="text-center text-[#7d5c55]">
                        Belum ada ucapan buat masa ini.
                      </p>
                    )}

                   <div className="relative">
                    <div className="max-h-[420px] md:max-h-[520px] overflow-y-auto overflow-x-hidden pr-2">
                      <div className="grid md:grid-cols-2 gap-4">
                        {wishes.map((item, index) => (
                          <div
                            key={index}
                            className="rounded-[1.5rem]  p-5"
                          >
                            <p className=" leading-8 text-sm md:text-base">
                              {item.wish} — {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* TOP FADE */}
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#fffdfb] to-transparent z-10" />

                    {/* BOTTOM FADE */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fffdfb] to-transparent z-10" />

                  </div>
                  </PaperFrame>
                </div>
              </section>

              <footer className="pt-2">
                <div className="max-w-6xl mx-auto text-center">
                  {/* <div className="inline-flex items-center gap-3 rounded-full border border-[#ead7ca] bg-white/70 px-5 py-3 text-[#7d5c55] shadow-sm">
                    <Camera className="w-4 h-4 text-[#c8a390]" />
                    <span className="text-sm">
                      With love, {couple.groom.split(" ")[0]} &{" "}
                      {couple.bride.split(" ")[0]}
                    </span>
                  </div> */}
                </div>
              </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}