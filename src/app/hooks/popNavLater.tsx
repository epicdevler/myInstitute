import { useEffect, useState } from "react";

export default function usePopNavLater() {
  const [shouldNavPop, setShouldNavPop] = useState(false);

  const scrollEvent = () => {
    const totalScrollH = document.documentElement.scrollHeight;
    const screenH = window.screen.height;
    const scrollPos = window.scrollY;

    const pop =
      scrollPos <= totalScrollH - (screenH + screenH / 3) &&
      scrollPos > screenH;

    setShouldNavPop(pop);
  };

  useEffect(() => {
    scrollEvent();
    window.addEventListener("scroll", scrollEvent);
  }, []);

  return {shouldNavPop};
}
