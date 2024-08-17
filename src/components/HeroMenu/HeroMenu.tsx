import React from "react";
import { Hero } from "../Game/Game.tsx";

interface HeroMenuProps {
  hero: Hero;
  setHero: React.Dispatch<React.SetStateAction<Hero>>;
  title: string;
}

function HeroMenu({ hero, setHero, title }: HeroMenuProps) {
  return (
    <div>
      <h2>{title}</h2>
      <br />
      <label>
        Speed:
        <input
          type="range"
          min="1"
          max="10"
          value={hero.speed}
          onChange={(e) =>
            setHero({ ...hero, speed: parseInt(e.target.value) })
          }
        />
      </label>
      <br />
      <label>
        Fire Rate:
        <input
          type="range"
          min="100"
          max="2000"
          value={hero.fireRate}
          onChange={(e) =>
            setHero({ ...hero, fireRate: parseInt(e.target.value) })
          }
        />
      </label>
    </div>
  );
}

export default HeroMenu;
