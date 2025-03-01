import React from "react";

export function GridBackgroundDemo() {
  return (
    <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.1] bg-grid-black/[0.8] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}