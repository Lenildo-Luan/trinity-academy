"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

type P5SketchProps = {
  setup: (p: p5) => void;
  draw: (p: p5) => void;
  mousePressed?: (p: p5) => void;
  width?: number;
  height?: number;
  className?: string;
};

export function P5Sketch({
  setup,
  draw,
  mousePressed,
  width,
  height = 400,
  className = "",
}: P5SketchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    // Dynamically import p5 only on client side
    import("p5").then((p5Module) => {
      const P5 = p5Module.default;

      if (containerRef.current && !p5InstanceRef.current) {
        // Use container width if width prop is not provided
        const canvasWidth = width ?? containerRef.current.offsetWidth;

        const sketch = (p: p5) => {
          p.setup = () => {
            const canvas = p.createCanvas(canvasWidth, height);
            canvas.style('display', 'block');
            canvas.style('border', '1px solid #99a1af33');
            canvas.style('border-radius', '8px');
            p.clear();
            setup(p);
          };

          p.draw = () => {
            draw(p);
          };

          if (mousePressed) {
            p.mousePressed = () => {
              mousePressed(p);
            };
          }
        };

        p5InstanceRef.current = new P5(sketch, containerRef.current);
      }
    });

    // Cleanup
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [setup, draw, mousePressed, width, height]);

  return (
    <div
      ref={containerRef}
      className={`my-8 flex justify-center ${className}`}
      style={width === undefined ? { width: '100%' } : undefined}
    />
  );
}
