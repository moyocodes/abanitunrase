import { useState, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { SectionEditButton, SectionPanel } from "@/components/AdminBar";

const AUTO_SPEED = 1.4; // px per frame at 60fps
const GAP = 16;

function getCardW() {
  if (typeof window === "undefined") return 460;
  return window.innerWidth < 768 ? window.innerWidth * 0.76 : window.innerWidth * 0.36;
}

function Strip({ items, onOpen, onRemove }) {
  const xRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartClientX = useRef(0);
  const dragStartX = useRef(0);
  const lastClientX = useRef(0);
  const velRef = useRef(0);
  const [, tick] = useState(0);

  const cardW = getCardW();
  const stride = cardW + GAP;
  const totalW = stride * items.length;

  // Wrap x so it always loops seamlessly
  const wrap = (x) => {
    if (!totalW) return 0;
    let v = x % totalW;
    if (v > 0) v -= totalW;
    return v;
  };

  useAnimationFrame((_, delta) => {
    if (!items.length) return;
    const dt = Math.min(delta, 50) / 16.7;

    if (draggingRef.current) {
      // During drag, just ensure wrap and re-render
      xRef.current = wrap(xRef.current);
    } else {
      // Apply momentum decay then auto-scroll
      if (Math.abs(velRef.current) > 0.1) {
        xRef.current += velRef.current * dt;
        velRef.current *= 0.88;
      } else {
        velRef.current = 0;
        xRef.current -= AUTO_SPEED * dt;
      }
      xRef.current = wrap(xRef.current);
    }

    tick(v => v + 1);
  });

  const onPointerDown = useCallback((e) => {
    draggingRef.current = true;
    dragStartClientX.current = e.clientX;
    lastClientX.current = e.clientX;
    dragStartX.current = xRef.current;
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStartClientX.current;
    velRef.current = e.clientX - lastClientX.current;
    lastClientX.current = e.clientX;
    xRef.current = dragStartX.current + delta;
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.style.cursor = "grab";
    // Convert drag velocity into momentum (negative = moving left = auto direction)
    velRef.current = velRef.current * 0.6;
  }, []);

  const onClickCapture = useCallback((e) => {
    // Suppress click if it was a drag
    const travelled = Math.abs(e.clientX - dragStartClientX.current);
    if (travelled > 6) e.stopPropagation();
  }, []);

  if (!items.length) return null;

  // Render 3 repetitions so there's always off-screen content on both sides
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden py-6 cursor-grab select-none pb-28"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <div
        className="flex"
        style={{
          gap: GAP,
          transform: `translateX(${xRef.current}px)`,
          willChange: "transform",
        }}
      >
        {repeated.map((item, i) => {
          const origIdx = i % items.length;
          return (
            <div
              key={`${item.url}-${i}`}
              className="flex-shrink-0 relative overflow-hidden group bg-[#181510]"
              style={{
                width: cardW,
                height: Math.round(cardW * 1.15),
              }}
              onClick={() => item.type === "image" && onOpen(origIdx)}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  muted loop autoPlay playsInline preload="metadata"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none"
                />
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

              {item.type === "video" && (
                <div className="absolute top-3 left-3 font-mono text-[7px] tracking-[0.22em] uppercase text-white/60 border border-white/20 px-2 py-1 bg-black/35 backdrop-blur-sm pointer-events-none">
                  ▶ Video
                </div>
              )}

              <button
                onClick={e => { e.stopPropagation(); onRemove(origIdx, e); }}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 border border-white/15 text-white/60 hover:bg-black/80 hover:text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10"
                title="Remove"
              >
                ✕
              </button>

              <div className="absolute bottom-3 left-3 font-mono text-[7px] tracking-[0.28em] uppercase text-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {String(origIdx + 1).padStart(2, "0")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Gallery({ items, onAdd, onRemove, onClear, onOpen, dragOver, setDragOver }) {
  const handleFiles = (files) => {
    if (files?.length) onAdd(files);
  };

  return (
    <section
      id="collage"
      className="bg-[#0e0d08] relative overflow-hidden"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
    >
      <SectionEditButton panelId="gallery" />
      <SectionPanel panelId="gallery" title="The Archive">
        <p className="font-['Outfit'] text-[13px] text-[#1a1706]/55 leading-relaxed">
          Drag &amp; drop files onto the section, or use the "+ Add to archive" button. Hover a card to remove it.
        </p>
      </SectionPanel>
      {dragOver && (
        <div className="absolute inset-0 z-50 bg-[#0e0d08]/90 flex items-center justify-center pointer-events-none">
          <div className="font-mono text-[9px] tracking-[0.44em] uppercase text-white/30">Drop to archive</div>
        </div>
      )}

      {/* Header */}
      <motion.div
        className="px-6 md:px-16 pt-20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.06]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <div>
          <div className="font-mono text-[8px] tracking-[0.44em] uppercase text-white/25 flex items-center gap-3 mb-5">
            <span className="block w-7 h-px bg-white/15" />
            The Archive
          </div>
          <h2 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(36px,5vw,68px)] leading-none tracking-tight font-normal">
            Work &amp; Process.
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-4 md:pb-1">
          <p className="font-['Outfit'] text-white/35 text-[clamp(13px,1.2vw,15px)] leading-relaxed font-light md:text-right max-w-xs">
            Moments from the styling house — fittings, arrivals, and the quiet work between.
          </p>
          <div className="flex items-center gap-4">
            <label
              htmlFor="collage-file-input"
              className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/35 border border-white/12 px-5 py-2.5 hover:border-white/35 hover:text-white/65 transition-colors cursor-pointer"
            >
              + Add to archive
            </label>
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="font-mono text-[8px] tracking-[0.26em] uppercase text-white/18 border-b border-white/10 pb-px hover:text-white/40 transition-colors bg-transparent cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <input
        type="file" id="collage-file-input" multiple
        accept="image/*,video/mp4,video/quicktime,.mov"
        className="hidden"
        onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
      />

      {items.length === 0 ? (
        <motion.div
          className="px-6 md:px-16 py-28 flex flex-col items-center text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="w-px h-12 bg-white/10 mb-6" />
          <div className="font-['Cormorant_Garamond'] italic text-white/18 text-3xl mb-3">The archive is empty.</div>
          <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/12 mb-8">
            Add images &amp; videos above · drag &amp; drop anywhere
          </div>
          <label
            htmlFor="collage-file-input"
            className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 border border-white/12 px-6 py-3 hover:border-white/30 hover:text-white/55 transition-colors cursor-pointer"
          >
            + Add first item →
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <Strip items={items} onOpen={onOpen} onRemove={onRemove} />
          <div className="px-6 md:px-16 py-4 flex items-center justify-between border-t border-white/[0.06]">
            <div className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/18">
              {items.length} item{items.length !== 1 ? "s" : ""} · drag to browse
            </div>
            <div className="flex gap-1.5 items-center">
              {items.slice(0, 10).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white/18" />
              ))}
              {items.length > 10 && <span className="font-mono text-[7px] text-white/12 ml-1">+{items.length - 10}</span>}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
