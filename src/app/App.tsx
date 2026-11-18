import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Heart, Instagram, Send, Phone, Volume2, VolumeX } from 'lucide-react';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { translations } from './translations';

export default function App() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterDismissed, setLetterDismissed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [secondCarouselIndex, setSecondCarouselIndex] = useState(0);
  const [thirdCarouselIndex, setThirdCarouselIndex] = useState(0);
  const [allImagesIndex, setAllImagesIndex] = useState(0);

  const allWeddingImages = [
    '/IMG_0007.JPG',
    '/IMG_9985.JPG',
    '/IMG_0012.JPG',
    '/IMG_8130.JPG',
    '/IMG_8131.JPG',
    '/IMG_8020.JPG',
    '/Picsart_26-11-16_00-13-40-333.jpg',
    '/Picsart_26-11-16_00-13-10-715.jpg',
    '/Picsart_26-11-16_00-12-57-739.jpg',
    '/Picsart_26-11-16_00-12-44-914.jpg',
    '/Picsart_26-11-16_00-12-28-128.jpg',
    '/IMG_9990.JPG',
  ];
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
  const musicPlayerRef = useRef<HTMLIFrameElement>(null);
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [timeLeft, setTimeLeft] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [married, setMarried] = useState(false);

  const galleryImages = [
    '/IMG_0007.JPG',
    '/IMG_9985.JPG',
    '/IMG_0012.JPG',
  ];

  const additionalImages = [
    '/IMG_8130.JPG',
    '/IMG_8131.JPG',
    '/IMG_8020.JPG',
  ];

  const cherished_moments = [
    '/Picsart_26-11-16_00-13-40-333.jpg',
    '/Picsart_26-11-16_00-13-10-715.jpg',
    '/Picsart_26-11-16_00-12-57-739.jpg',
    '/Picsart_26-11-16_00-12-44-914.jpg',
    '/Picsart_26-11-16_00-12-28-128.jpg',
  ];

  // Auto-slide gallery every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  // Auto-slide second carousel every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSecondCarouselIndex((prev) => (prev + 1) % additionalImages.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  // Auto-slide third carousel every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setThirdCarouselIndex((prev) => (prev + 1) % cherished_moments.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (!envelopeOpen) return;

    const playMusic = () => {
      musicPlayerRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        'https://www.youtube.com',
      );
    };

    playMusic();
    setAudioPlaying(true);
    
    // Stop music after approximately 4.5 minutes (270 seconds)
    const stopTimer = window.setTimeout(() => {
      musicPlayerRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }),
        'https://www.youtube.com',
      );
      setAudioPlaying(false);
    }, 270000);
    
    return () => window.clearTimeout(stopTimer);
  }, [envelopeOpen]);

  useEffect(() => {
    if (!envelopeOpen || letterDismissed) return;

    const timer = window.setTimeout(() => setLetterDismissed(true), 6000);
    return () => window.clearTimeout(timer);
  }, [envelopeOpen, letterDismissed]);

  const toggleAudio = () => {
    const command = audioPlaying ? 'pauseVideo' : 'playVideo';
    musicPlayerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      'https://www.youtube.com',
    );
    setAudioPlaying((isPlaying) => !isPlaying);
  };

  useEffect(() => {
    const weddingDate = new Date('2026-11-28T09:00:00').getTime();
    const MS_DAY = 1000 * 60 * 60 * 24;
    const MS_YEAR = MS_DAY * 365.25;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance > 0) {
        setMarried(false);
        setTimeLeft({
          years: 0,
          days: Math.floor(distance / MS_DAY),
          hours: Math.floor((distance % MS_DAY) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setMarried(true);
        const elapsed = Math.abs(distance);
        const years = Math.floor(elapsed / MS_YEAR);
        const remainder = elapsed % MS_YEAR;
        setTimeLeft({
          years,
          days: Math.floor(remainder / MS_DAY),
          hours: Math.floor((remainder % MS_DAY) / (1000 * 60 * 60)),
          minutes: Math.floor((remainder % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((remainder % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <iframe
        ref={musicPlayerRef}
        title="Wedding music"
        src="https://www.youtube.com/embed/maybbefABYo?enablejsapi=1&autoplay=0&controls=0&modestbranding=1&fs=0"
        allow="autoplay; encrypted-media"
        className="pointer-events-none fixed h-px w-px opacity-0"
      />
      <AnimatePresence>
        {!envelopeOpen && (
          <DigitalEnvelope
            key="envelope"
            onOpenComplete={() => setEnvelopeOpen(true)}
            lang={lang}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {envelopeOpen && !letterDismissed && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-[#eee6d9] px-4 py-6 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setLetterDismissed(true)}
          >
          <div className="relative my-auto w-full max-w-[530px] overflow-hidden rounded-[2rem] border border-[#c9ad78]/70 bg-[#f8f1e5] px-6 pb-9 pt-9 text-center shadow-[0_24px_70px_rgba(74,54,30,.25)] sm:px-12">
            <span
              role="button"
              tabIndex={0}
              aria-label={audioPlaying ? 'Mute music' : 'Unmute music'}
              title={audioPlaying ? 'Mute music' : 'Unmute music'}
              onClick={(event) => {
                event.stopPropagation();
                toggleAudio();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  toggleAudio();
                }
              }}
              className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9ad78] bg-[#fffaf1]/90 text-[#765536] shadow-sm transition hover:scale-105"
            >
              {audioPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </span>
            <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-[#c9ad78]/65" />
            <p
              className="relative text-4xl leading-[1.08] text-[#65462d] drop-shadow-[0_1px_1px_rgba(175,137,72,.25)] sm:text-5xl"
              style={{ fontFamily: 'Great Vibes, cursive', fontWeight: 400 }}
            >
              We are
              <br />
              getting married
            </p>
            <div className="relative mx-auto mt-6 h-[min(48vh,380px)] w-[88%] overflow-hidden rounded-t-[48%] rounded-b-[1.75rem] border-[5px] border-[#f1e2c6] bg-[#d7c2a0] p-1 shadow-[0_14px_28px_rgba(75,52,28,.22)]">
              <img src="/image.png" alt="King and Nebi" className="h-full w-full rounded-t-[46%] rounded-b-[1.3rem] object-cover object-center" draggable={false} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4d321f]/20 to-transparent" />
            </div>
            <div className="relative mx-auto mt-5 flex items-center justify-center gap-3 text-[#b7893f]">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#b7893f]" />
              <span className="text-sm">✦</span>
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#b7893f]" />
            </div>
            <h1
              className="relative mt-2 whitespace-nowrap text-[clamp(3rem,12vw,5.2rem)] leading-none text-[#3d2c20] drop-shadow-[0_2px_1px_rgba(181,142,83,.25)]"
              style={{ fontFamily: 'Great Vibes, cursive', fontWeight: 400 }}
            >
              King <span className="px-1 text-[#b7893f]">&amp;</span> Nebi
            </h1>
            <p
              className="relative mt-6 text-[10px] font-medium uppercase tracking-[0.34em] text-[#6d5237] sm:text-xs"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Saturday · November 28 · 2026
            </p>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
      {envelopeOpen && letterDismissed && (
        <div className="min-h-screen bg-[#F8F7F5]">
          <button
            type="button"
            aria-label={audioPlaying ? 'Pause music' : 'Play music'}
            title={audioPlaying ? 'Pause music' : 'Play music'}
            onClick={toggleAudio}
            className="fixed left-5 top-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-black/25 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black/40"
          >
            {audioPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          {/* Hero Section */}
          <section id="home" className="relative w-full h-screen overflow-hidden">
            <div
              className="absolute inset-0 scale-110"
              style={{
                backgroundImage: `url('/DSC06698.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 52%',
                filter: 'blur(8px) brightness(0.45)',
              }}
            />
            <img
              src="/DSC06698.jpg"
              alt="King and Nebi"
              className="absolute inset-0 h-full w-full object-cover object-[center_52%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60" />
            <span className="absolute right-5 top-5 z-10 rounded-full bg-[#f7f1e7]/90 px-5 py-2 text-xs font-semibold tracking-[0.18em] text-[#2d4a38] shadow-lg">
              EN
            </span>
            <div className="absolute inset-x-0 top-[25%] z-10 px-6 text-[#fffaf2]">
              <div className="mx-auto max-w-xl rounded-2xl bg-black/10 px-4 py-4 text-center backdrop-blur-[1px]">
                <p
                  className="mb-5 text-3xl text-[#b7893f] drop-shadow-[0_2px_5px_rgba(0,0,0,.8)] sm:text-4xl"
                  style={{ fontFamily: 'Great Vibes, cursive' }}
                >
                  Save the date
                </p>
                <div className="mx-auto mb-5 h-px w-20 bg-[#2d4a38] shadow-[0_1px_4px_rgba(0,0,0,.7)]" />
                <h1
                  className="leading-none text-[#fffaf2] drop-shadow-[0_3px_8px_rgba(0,0,0,.85)]"
                  style={{ fontFamily: 'Great Vibes, cursive', fontSize: 'clamp(3.2rem, 14vw, 6rem)' }}
                >
                  King <span className="text-[#b7893f]">&amp;</span> Nebi
                </h1>
                <p
                  className="mt-5 text-[11px] font-medium uppercase tracking-[0.34em] text-[#fffaf2] drop-shadow-[0_2px_5px_rgba(0,0,0,.85)] sm:text-sm"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  November 28, 2026
                </p>
              </div>
            </div>
            <a
              href="#events"
              aria-label="Scroll to wedding details"
              className="absolute bottom-8 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-[#2d4a38]/80 bg-black/25 text-[#fffaf2] shadow-[0_4px_18px_rgba(0,0,0,.35)] backdrop-blur-sm transition hover:scale-110 hover:bg-black/40"
            >
              <span className="animate-bounce text-2xl leading-none">⌄</span>
            </a>
          </section>

          {/* Invitation Section */}
          <section id="story" className="bg-[#f2eee5] px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className="text-5xl font-bold leading-none text-[#2d4a38] sm:text-7xl"
                style={{ fontFamily: 'Great Vibes, cursive' }}
              >
                Invitation
              </h2>
              <div
                className="relative mx-auto mt-12 max-w-2xl px-8 py-12 text-left shadow-[0_18px_35px_rgba(67,57,38,.16)] sm:px-14 sm:py-16"
                style={{
                  backgroundColor: '#f8f5eb',
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(181,166,135,.13) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(181,166,135,.1) 0 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,.5), transparent 55%)',
                  backgroundSize: '9px 9px, 13px 13px, auto',
                  clipPath: 'polygon(1% 2%, 4% 1%, 8% 2%, 13% 1%, 19% 2%, 25% 1%, 32% 2%, 39% 1%, 47% 2%, 55% 1%, 63% 2%, 71% 1%, 79% 2%, 87% 1%, 94% 2%, 99% 1%, 98% 12%, 99% 24%, 98% 37%, 99% 51%, 98% 64%, 99% 77%, 98% 89%, 99% 98%, 91% 97%, 83% 98%, 74% 97%, 65% 98%, 56% 97%, 47% 98%, 38% 97%, 29% 98%, 20% 97%, 11% 98%, 2% 97%, 3% 86%, 2% 73%, 3% 60%, 2% 47%, 3% 34%, 2% 20%)',
                }}
              >
                <p className="font-serif text-lg italic leading-9 text-[#2d4a38] sm:text-xl">
                  With grateful hearts, we invite you to celebrate the beginning of our life together. Your love, prayers, and presence mean so much to us as we begin this beautiful journey as husband and wife on November 28, 2026.
                </p>
                <p
                  className="mt-10 text-right text-4xl text-[#b7893f] sm:text-5xl"
                  style={{ fontFamily: 'Great Vibes, cursive' }}
                >
                  King <span className="text-[#b7893f]">&amp;</span> Nebi
                </p>
              </div>
            </div>
          </section>

          {/* Countdown Section */}
          <section className="relative overflow-hidden border-b border-[#d9d4c6] bg-[#f2eee5] px-5 py-24 sm:px-8 sm:py-32">
            <div className="relative mx-auto max-w-3xl text-center text-[#2d4a38]">
              <h2 className="text-6xl leading-none sm:text-8xl" style={{ fontFamily: 'Great Vibes, cursive' }}>
                {lang === 'en' ? 'Countdown' : 'ቆጠራ'}
              </h2>
              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.42em] text-[#b7893f] sm:text-xs">
                Until November 28, 2026
              </p>
              <div className="mx-auto mt-10 max-w-2xl overflow-hidden border border-[#d9d4c6] bg-[#e8e4da] p-2 shadow-[0_14px_30px_rgba(67,57,38,.14)] sm:p-3">
                <img
                  src="/Picsart_26-11-16_00-12-57-739.jpg"
                  alt="The couple holding hands in their wedding attire"
                  className="h-52 w-full object-cover object-center sm:h-72"
                  draggable={false}
                />
              </div>
              <div className="mx-auto mt-10 grid max-w-xl grid-cols-4 gap-3 sm:gap-8">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-4xl font-light sm:text-6xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {String(value).padStart(2, '0')}
                    </div>
                    <div className="mt-3 text-[9px] uppercase tracking-[0.28em] text-[#b7893f] sm:text-[10px]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Scripture Section */}
          <section className="relative overflow-hidden bg-[#294438] px-5 py-16 sm:px-8 sm:py-24">
            <div
              className="mx-auto max-w-3xl border border-[#d9d4c6]/50 px-7 py-10 text-center shadow-[0_18px_35px_rgba(20,30,24,.28)] sm:px-14 sm:py-14"
              style={{
                backgroundColor: '#f4efe3',
                backgroundImage:
                  'radial-gradient(circle at 15% 20%, rgba(181,166,135,.16) 0 1px, transparent 1px), radial-gradient(circle at 80% 75%, rgba(181,166,135,.12) 0 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,.55), transparent 60%)',
                backgroundSize: '9px 9px, 13px 13px, auto',
              }}
            >
              <div className="mb-5 text-5xl leading-none text-[#ae8c52]/60" aria-hidden="true">
                "
              </div>
              <p className="font-serif text-lg italic leading-9 text-[#4c352a] sm:text-2xl sm:leading-10">
                Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.
              </p>
              <p className="mt-7 text-xs font-medium uppercase tracking-[0.24em] text-[#708477]">
                Proverbs 3:5–6
              </p>
            </div>
          </section>

          {/* Calendar Section */}
          <section id="events" className="py-20 px-6 relative bg-[#f2eee5]">
            <div className="relative z-10 max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-2xl p-12 text-center relative">
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-[#b7893f]/40"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src="/image.png"
                      alt="King and Nebi"
                      className="w-full h-full object-cover object-center"
                      draggable={false}
                    />
                  </div>
                </div>

                <h2 className="text-3xl text-[#3d2c20] mb-6" style={{ fontFamily: 'Great Vibes, cursive' }}>
                  King & Nebi
                </h2>

                <p className="text-xs tracking-widest uppercase text-[#2d4a38] font-semibold mb-4">
                  November 2026
                </p>

                <div className="text-xs">
                  <div className="grid grid-cols-7 gap-3 mb-4 pb-4 border-b border-[#b7893f]/20">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-[#b7893f] font-semibold h-6 flex items-center justify-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: 30 }, (_, index) => {
                      const day = index + 1;
                      return (
                        <div
                          key={day}
                          className={`h-8 flex items-center justify-center rounded-full transition-all text-sm relative ${
                            day === 28
                              ? 'text-white'
                              : 'text-[#2d4a38]'
                          }`}
                        >
                          {day === 28 ? (
                            <>
                              <span className="text-[#b7893f] font-semibold">28</span>
                              <Heart className="w-3 h-3 text-[#b7893f] absolute -top-2 -right-1" fill="#b7893f" />
                            </>
                          ) : (
                            day
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-3xl text-[#b7893f] font-light mt-8 pt-6 border-t border-[#b7893f]/20" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  9:00 LT
                </p>
              </div>
            </div>
          </section>

          {/* Wedding Collection Gallery */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl text-center mb-12 font-light" style={{ fontFamily: 'Great Vibes, cursive', color: '#b7893f' }}>
                Our complete wedding collection
              </h2>

              <div className="relative mb-8">
                <div className="absolute -top-8 -left-8 w-12 h-12 rounded-full bg-[#b7893f]/20"></div>
                <div className="absolute -bottom-8 right-12 w-8 h-8 rounded-full bg-[#b7893f]/15"></div>
                <div className="absolute top-20 -right-6 w-6 h-6 rounded-full bg-[#b7893f]/10"></div>

                <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-100 to-gray-50 border-4 border-[#b7893f]/20">
                  <motion.img
                    key={allImagesIndex}
                    src={allWeddingImages[allImagesIndex]}
                    alt={`Wedding photo ${allImagesIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                <button
                  onClick={() => setAllImagesIndex((prev) => (prev - 1 + allWeddingImages.length) % allWeddingImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-[#b7893f] text-xl transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={() => setAllImagesIndex((prev) => (prev + 1) % allWeddingImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-[#b7893f] text-xl transition-all"
                >
                  ›
                </button>
              </div>

              <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {allWeddingImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setAllImagesIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === allImagesIndex
                        ? 'bg-[#b7893f] w-8'
                        : 'bg-[#b7893f]/30 hover:bg-[#b7893f]/60 w-2'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 px-4">
                {allWeddingImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setAllImagesIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === allImagesIndex
                        ? 'border-[#b7893f] scale-105'
                        : 'border-gray-300 hover:border-[#b7893f]'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Location Map */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl text-center mb-8 text-[#2d4a38] font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  St. Matthew's Anglican Church
              </h2>

              <div className="rounded-2xl overflow-hidden shadow-lg h-96 mb-8">
                <iframe
                  title="St. Matthew's Anglican Church"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=38.770%2C9.037%2C38.800%2C9.057&amp;layer=mapnik&amp;marker=9.047%2C38.786"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://www.google.com/maps/dir/St+Matthew's+Anglican+Church,+2QM9%2B8G2,+Queen+Elizabeth+II+St,+Addis+Ababa/2RJP%2B3VQ,+Addis+Ababa/@9.0228373,38.782195,14z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x164b8587dd322b6d:0xc606347394ac5af2!2m2!1d38.7687604!2d9.0332722!1m5!1m1!1s0x164b85cef5ab402d:0x80880fad045b264d!2m2!1d38.8372344!2d9.0302125?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#b7893f] text-white rounded-full hover:bg-[#a07835] transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </section>

          {/* Gallery Sections */}
          <section id="gallery" className="py-20 px-6 bg-[#F8F7F5]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl text-center mb-12 font-light" style={{ fontFamily: 'Great Vibes, cursive', color: '#b7893f' }}>
                Early memories
              </h2>

              <div className="relative max-w-2xl mx-auto">
                <div className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50">
                  <motion.div
                    className="absolute w-64 h-80 md:w-72 md:h-96 z-20 shadow-2xl overflow-hidden rounded-2xl border-8 border-white cursor-pointer"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={galleryImages[currentImageIndex]}
                      alt={`Memory ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>

                  <div className="absolute w-56 h-72 md:w-64 md:h-80 z-10 transform -rotate-12 -translate-x-16 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
                  <div className="absolute w-56 h-72 md:w-64 md:h-80 z-10 transform rotate-12 translate-x-16 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
                </div>

                <div className="flex justify-center gap-3 mt-8">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`transition-all ${
                        index === currentImageIndex
                          ? 'bg-[#b7893f] w-8 h-2 rounded-full'
                          : 'bg-[#b7893f]/30 hover:bg-[#b7893f]/60 w-2 h-2 rounded-full'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Before Moments Gallery */}
          <section className="py-20 px-6 bg-[#F8F7F5]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl text-center mb-12 font-light" style={{ fontFamily: 'Great Vibes, cursive', color: '#b7893f' }}>
                Before moments
              </h2>

              <div className="relative max-w-2xl mx-auto">
                <div className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50">
                  <motion.div
                    className="absolute w-64 h-80 md:w-72 md:h-96 z-20 shadow-2xl overflow-hidden rounded-2xl border-8 border-white"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={additionalImages[secondCarouselIndex]}
                      alt={`Wedding moment ${secondCarouselIndex + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>

                  <div className="absolute w-56 h-72 md:w-64 md:h-80 z-10 transform -rotate-12 -translate-x-16 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
                  <div className="absolute w-56 h-72 md:w-64 md:h-80 z-10 transform rotate-12 translate-x-16 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
                </div>

                <div className="flex justify-center gap-3 mt-8">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setSecondCarouselIndex(index)}
                      className={`transition-all ${
                        index === secondCarouselIndex
                          ? 'bg-[#b7893f] w-8 h-2 rounded-full'
                          : 'bg-[#b7893f]/30 hover:bg-[#b7893f]/60 w-2 h-2 rounded-full'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Cherished Moments Gallery */}
          <section className="py-20 px-6 bg-[#F8F7F5]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl text-center mb-12 font-light" style={{ fontFamily: 'Great Vibes, cursive', color: '#b7893f' }}>
                Cherished moments
              </h2>

              <div className="relative max-w-2xl mx-auto">
                <div className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50">
                  <motion.div
                    className="absolute w-64 h-80 md:w-72 md:h-96 z-20 shadow-2xl overflow-hidden rounded-2xl border-8 border-white"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={cherished_moments[thirdCarouselIndex]}
                      alt={`Cherished moment ${thirdCarouselIndex + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>

                  <div className="absolute w-56 h-72 md:w-64 md:h-80 z-10 transform -rotate-12 -translate-x-16 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
                  <div className="absolute w-56 h-72 md:w-64 md:h-80 z-10 transform rotate-12 translate-x-16 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
                </div>

                <div className="flex justify-center gap-3 mt-8 flex-wrap justify-center">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <button
                      key={index}
                      onClick={() => setThirdCarouselIndex(index)}
                      className={`transition-all ${
                        index === thirdCarouselIndex
                          ? 'bg-[#b7893f] w-8 h-2 rounded-full'
                          : 'bg-[#b7893f]/30 hover:bg-[#b7893f]/60 w-2 h-2 rounded-full'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#1a3a2e] py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <p className="text-[#b7893f] mb-4 leading-relaxed text-2xl sm:text-3xl" style={{ fontFamily: 'serif' }}>
                  "Faithful is He who calls you, and He also will do it."
                </p>
                <p className="text-lg text-white font-semibold">1 Thessalonians 5:24</p>
              </div>

              <h2 className="text-white mb-6 font-bold" style={{ fontFamily: 'Great Vibes, cursive', fontSize: '3rem' }}>
                <div>King Getachew</div>
                <div className="text-[#b7893f]">&amp;</div>
                <div>Nebiyat Zelalem</div>
              </h2>
            </div>
          </footer>
        </div>
      )}

      <AnimatePresence>
        {fullscreenImageIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImageIndex(null)}
          >
            <button
              onClick={() => setFullscreenImageIndex(null)}
              className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors"
              aria-label="Close image"
            >
              ✕
            </button>

            <motion.img
              src={additionalImages[fullscreenImageIndex]}
              alt="Fullscreen view"
              className="max-w-4xl max-h-[90vh] object-contain rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
