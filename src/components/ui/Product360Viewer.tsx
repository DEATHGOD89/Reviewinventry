"use client";

import React, { useState, useRef, useEffect } from "react";
import { RotateCw, RotateCcw, Play, Pause, ZoomIn, ZoomOut, Layers, Eye, Sparkles } from "lucide-react";

export interface Product360ViewerProps {
  productName: string;
  category: string;
  sku: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  productName,
  category,
  sku,
}) => {
  const [angle, setAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Auto-rotation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setAngle((prev) => (prev + 2) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = angle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // Map pixels to degrees (1px approx 0.8 degree)
    let newAngle = (startAngleRef.current + Math.round(deltaX * 0.8)) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Preset angle snap
  const snapToAngle = (targetAngle: number) => {
    setIsAutoRotating(false);
    setAngle(targetAngle);
  };

  // Determine active callout hotspot based on current angle
  const getActiveCallout = () => {
    if (angle >= 330 || angle <= 30) {
      return {
        label: "Front Impact Barrier",
        detail: "Continuous panoramic face shield, tested for high-velocity particle deflection.",
        tag: "0° Face Center",
      };
    } else if (angle > 30 && angle < 120) {
      return {
        label: "Side Profile & Gauntlet Seal",
        detail: "Ergonomic contouring ensures seamless integration with protective coats and collars.",
        tag: "90° Lateral Profile",
      };
    } else if (angle >= 120 && angle <= 240) {
      return {
        label: "Rear Suspension & Harness",
        detail: "Adjustable multi-point harness distributed across occipital pressure zones.",
        tag: "180° Rear View",
      };
    } else {
      return {
        label: "Ventilation Baffles & Seams",
        detail: "Indirect liquid chemical traps allow vapor exit while sealing out corrosive droplets.",
        tag: "270° Vent System",
      };
    }
  };

  const currentCallout = getActiveCallout();

  return (
    <div
      className="relative rounded-3xl bg-[#0b0b0e] text-white border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header telemetry bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-tight text-white uppercase">
            360&deg; Interactive Product Telemetry
          </span>
          <span className="text-zinc-500 font-mono">[{sku}]</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-zinc-400 text-[11px]">
          <span>Angle: <strong className="text-cyan-300">{angle}&deg;</strong></span>
          <span>Zoom: <strong className="text-white">{zoomLevel.toFixed(1)}x</strong></span>
        </div>
      </div>

      {/* Main 360 Rotation Stage */}
      <div
        className="relative aspect-[16/10] md:aspect-[21/10] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden my-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Ambient Ring Lighting */}
        <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic 360 Cylindrical Perspective Object */}
        <div
          className="relative transition-transform duration-75 flex flex-col items-center justify-center text-center pointer-events-none"
          style={{
            transform: `scale(${zoomLevel}) rotateY(${angle}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Stylized high-tech geometric 3D representation */}
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-3xl bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-700 p-3 shadow-2xl border-2 border-white/15 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-3 shadow-inner">
              <Eye className="w-10 h-10" />
            </div>

            <div className="text-base md:text-lg font-black tracking-tight text-white uppercase">
              {productName}
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-1">
              Category: {category}
            </div>

            <div className="mt-4 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
              ROTATING: {angle}&deg;
            </div>
          </div>
        </div>

        {/* Dynamic Hotspot Floating Card overlay */}
        <div className="absolute bottom-4 left-4 z-20 p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 max-w-xs shadow-xl text-left pointer-events-none">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-cyan-400 font-mono mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>{currentCallout.tag}</span>
          </div>
          <div className="text-xs font-bold text-white">{currentCallout.label}</div>
          <div className="text-[11px] text-zinc-400 leading-snug mt-1">
            {currentCallout.detail}
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
        {/* Preset Angle Snap Buttons */}
        <div className="flex items-center gap-1.5">
          {[
            { label: "Front 0°", deg: 0 },
            { label: "Side 90°", deg: 90 },
            { label: "Back 180°", deg: 180 },
            { label: "Profile 270°", deg: 270 },
          ].map((btn) => (
            <button
              key={btn.deg}
              onClick={() => snapToAngle(btn.deg)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                Math.abs(angle - btn.deg) < 15
                  ? "bg-cyan-500 text-zinc-950 shadow-md font-bold"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Scrub & Zoom Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAngle((prev) => (prev - 15 + 360) % 360)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Rotate Left 15°"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isAutoRotating
                ? "bg-cyan-400 text-zinc-950 font-bold"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotating ? "Pause 360°" : "Auto-Rotate"}</span>
          </button>

          <button
            onClick={() => setAngle((prev) => (prev + 15) % 360)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Rotate Right 15°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" />

          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.2))}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((prev) => Math.min(1.6, prev + 0.2))}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-[10px] text-zinc-500 text-center mt-3 font-mono">
        &bull; Click and drag horizontally across the canvas to scrub through 360 degrees &bull;
      </div>
    </div>
  );
};
