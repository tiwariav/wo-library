import anime from "animejs";
import { useEffect } from "react";

export const ARC_ANGLE = 180;
export const MAX_PROGRESS = 100;

export default function useProgressAnimation(
  percentage: number,
  animeId: string,
) {
  useEffect(() => {
    const animeProps = {
      delay: 1000,
      duration: 3000,
    };
    anime({
      rotateZ: [0, (ARC_ANGLE * percentage) / MAX_PROGRESS],
      targets: `#${animeId}-animeIndicator`,
      ...animeProps,
    });
    anime({
      round: 1,
      targets: `#${animeId}-animeText`,
      textContent: [0, percentage],
      ...animeProps,
      easing: "easeOutElastic(1, 2)",
    });
  }, [percentage, animeId]);
  return null;
}
