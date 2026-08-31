import gsap from "gsap";

import type { TabListIndicator } from "../../components/ui/tabs/tab-list/TabList.types";

export function animTabIndicator(
  indicatorEl: HTMLElement,
  indicator: TabListIndicator
) {
  const { left, width } = indicator;

  const tl = gsap.timeline();

  tl.to(indicatorEl, {
    left,
    width,
    duration: 0.3,
    ease: "power2.out"
  });
}

