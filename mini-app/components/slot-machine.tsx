"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => getRandomFruit())
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  const spin = () => {
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid((prev) =>
        prev.map((col) => [getRandomFruit(), ...col.slice(0, 2)])
      );
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      setGrid((prev) => {
        const centerRow = prev.map((col) => col[1]);
        if (
          centerRow[0] === centerRow[1] &&
          centerRow[1] === centerRow[2]
        ) {
          setWin(true);
        }
        return prev;
      });
    }, 2000);
  };

  const rows = Array.from({ length: 3 }, (_, rowIdx) =>
    grid.map((col) => col[rowIdx])
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-4">
        {rows.flatMap((row, rowIdx) =>
          row.map((fruit, colIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={`/${fruit}.png`}
              alt={fruit}
              width={64}
              height={64}
            />
          ))
        )}
      </div>
      <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300" />
      <Button onClick={spin} disabled={spinning} className="w-full">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 text-green-600">
          You win! 🎉
          <div className="mt-2">
            <Share text={`I just won the slot machine! ${url}`} />
          </div>
        </div>
      )}
    </div>
  );
}
