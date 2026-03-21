import * as _anime from "animejs";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const anime: any = (_anime as any).default ?? _anime;
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
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    anime({
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      rotateZ: [0, (ARC_ANGLE * percentage) / 100],
      targets: `#${animeId}-animeIndicator`,
      ...animeProps,
    });
    anime({
      round: ANIME_ROUND,
      targets: `#${animeId}-animeText`,
      textContent: [0, percentage],
      ...animeProps,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      easing: "easeOutElastic(1, 2)",
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
  }, [percentage, animeId]);
  return null;
}
