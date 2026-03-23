import { useRef } from "react";

export default function LookCarousel({ looks = [], onOpen }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector(".snap-start");
    el.scrollBy({ left: dir * (card?.offsetWidth ?? el.offsetWidth * 0.82), behavior: "smooth" });
  };

  if (!looks.length) return null;

  return (
    <div>
      {/* Arrow row */}
      <div className="flex justify-end gap-2 px-6 md:px-16 pb-4">
        <button
          onClick={() => scroll(-1)}
          className="w-9 h-9 border border-[#1a1706]/20 flex items-center justify-center text-[#1a1706]/50 hover:text-[#1a1706] hover:border-[#1a1706]/50 transition-all bg-transparent cursor-pointer text-sm"
          aria-label="Previous"
        >←</button>
        <button
          onClick={() => scroll(1)}
          className="w-9 h-9 border border-[#1a1706]/20 flex items-center justify-center text-[#1a1706]/50 hover:text-[#1a1706] hover:border-[#1a1706]/50 transition-all bg-transparent cursor-pointer text-sm"
          aria-label="Next"
        >→</button>
      </div>

      {/* Scroll strip — 82% wide cards on mobile so next image peeks in */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-px bg-[#1a1706]/5 border-t border-[#1a1706]/5"
      >
        {looks.map((look, i) => (
          <div key={look.id ?? i} className="snap-start flex-shrink-0 w-[82%] md:w-[31%]">
            <div
              className="group relative cursor-pointer overflow-hidden aspect-[3/4] bg-[#0a0a0a]"
              onClick={() => onOpen?.(look, i)}
            >
              <img
                src={look.thumbs?.[0] ?? look.img}
                alt={look.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-top saturate-[0.8] transition-all duration-700 group-hover:scale-[1.04] group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-[15px] pl-0.5">▶</div>
              </div>
            </div>
          </div>
        ))}
        {/* Trailing spacer so last card doesn't snap flush to edge on mobile */}
        {looks.length > 1 && <div className="flex-shrink-0 w-[4%] md:hidden" />}
      </div>
    </div>
  );
}
