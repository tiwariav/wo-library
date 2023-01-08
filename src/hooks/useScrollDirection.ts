import { useEffect, useRef, useState } from "react";

function scrollDirection(lastScrollRef, callback) {
  const currentScroll = window.pageYOffset;
  const lastScroll = lastScrollRef.current;
  callback(currentScroll - lastScroll > 0 ? "down" : "up");
  lastScrollRef.current = currentScroll;
}

export default function useScrollDirection() {
  const [direction, setDirection] = useState("");
  const scrollRef = useRef(0);

  function handleScroll() {
    scrollDirection(scrollRef, setDirection);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return direction;
}
