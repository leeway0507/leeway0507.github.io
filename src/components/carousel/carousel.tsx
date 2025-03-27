"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./styles.module.css";
import Image from "next/image";

type PropType = {
  children: React.ReactElement;
};

interface CarouselImageProps extends React.ComponentProps<typeof Image> {}

export function CarouselImage(props: CarouselImageProps) {
  const { className } = props;
  return (
    <div className={`${styles.embla__slide} w-full aspect-[1.6/1] `}>
      <Image
        unoptimized
        className={`${styles.embla__slide__img} ${className}`}
        {...props}
      />
    </div>
  );
}

function EmblaCarousel({ children }: { children: React.ReactNode }) {
  const options: EmblaOptionsType = {
    loop: true,
    containScroll: "keepSnaps",
    watchSlides: false,
    watchResize: false,
  };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>{children}</div>
      </div>

      <div className="absolute -bottom-10 right-10">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      </div>
      <div className="absolute -bottom-10 right-0">
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
}

export default EmblaCarousel;
