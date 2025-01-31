"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./styles.module.css";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useMobile from "../hooks/user-view-size";
import { EmblaOptionsType } from "embla-carousel";

const handleImageError = (
  errorNode: React.SyntheticEvent<HTMLImageElement>
) => {
  const targetElement = errorNode.target as HTMLElement;
  const parentDiv = targetElement.parentNode as HTMLDivElement;
  parentDiv.className = "w-0";
};

interface CarouselImageProps extends React.ComponentProps<typeof Image> {}

export function CarouselImage(props: CarouselImageProps) {
  const { className } = props;
  return (
    <div className={`${styles.embla__slide}`}>
      <Image
        unoptimized
        className={`${styles.embla__slide__img} bg-gray-100 ${className}`}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
}

function EmblaCarousel({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "single" | "multi";
}) {
  const isMobile = useMobile();
  const options: EmblaOptionsType = {
    dragFree: true,
    containScroll: "trimSnaps",
  };

  const playOptions: any[] = [Autoplay({ playOnInit: true, delay: 3000 })];
  if (isMobile === "mobile") {
    playOptions.push(Fade());
    options.containScroll = false;
  }

  const [emblaRef] = useEmblaCarousel(options, playOptions);

  const carouselType = {
    single: styles.embla,
    multi: styles.embla_multi,
  };

  return (
    <div className="flex flex-col">
      <div className={carouselType[type]}>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={`${styles.embla__container} space-x-3`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmblaCarousel;
