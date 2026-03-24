import { animate } from "animejs";
import { useEffect } from "react";

const ANIME_DELAY = 1000;
const ANIME_DURATION = 3000;
const ANIME_ROUND = 1;

export const ARC_ANGLE = 180;
export const MAX_PROGRESS = 100;

export default function useProgressAnimation(
  percentage: number,
  animeId: string,
) {
  useEffect(() => {
    const animeProps = {
      delay: ANIME_DELAY,
      duration: ANIME_DURATION,
    };
    animate(`#${animeId}-animeIndicator`, {
      rotateZ: [0, (ARC_ANGLE * percentage) / MAX_PROGRESS],
      ...animeProps,
    });
    animate(`#${animeId}-animeText`, {
      round: 1,
      textContent: [0, percentage],
      ...animeProps,
      ease: "outElastic(1, 2)",
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
  }, [percentage, animeId]);
  return null;
}
