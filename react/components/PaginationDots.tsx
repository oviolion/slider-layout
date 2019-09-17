import React, { memo, FC } from 'react'

import { useSliderDispatch, useSliderState } from './SliderContext'

import sliderCSS from './slider.css'

const DOTS_DEFAULT_SIZE = 0.625

interface Props {
  controls: string
}

const getSelectedDot = (
  passVisibleSlides: boolean,
  currentSlide: number,
  slidesToShow: number
): number => {
  const realCurrentSlide = passVisibleSlides
    ? currentSlide + (slidesToShow - 1)
    : currentSlide
  return passVisibleSlides
    ? Math.floor(realCurrentSlide / slidesToShow)
    : realCurrentSlide
}

const getSlideIndices = (
  slidesToShow: number,
  passVisibleSlides: boolean,
  totalItems: number
): number[] =>
  slidesToShow
    ? [
        ...Array(
          passVisibleSlides ? Math.ceil(totalItems / slidesToShow) : totalItems
        ).keys(),
      ]
    : []

const PaginationDots: FC<Props> = ({ controls }) => {
  const dispatch = useSliderDispatch()
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    navigationStep,
    totalItems,
  } = useSliderState()
  const passVisibleSlides = navigationStep === slidesPerPage

  const slideIndexes = getSlideIndices(
    slidesPerPage,
    passVisibleSlides,
    totalItems
  )

  const handleDotClick = (index: number) => {
    const slideToGo = passVisibleSlides ? index * slidesPerPage : index
    const isLastDot = index === slideIndexes.length - 1
    const isExactDivision = totalItems % slidesPerPage === 0
    const overslideThreshold =
      !isExactDivision && isLastDot ? Math.floor(totalItems / slidesPerPage) : 0

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: -(slideWidth * (slideToGo - overslideThreshold)),
        currentSlide: index,
      },
    })
  }

  return (
    <div
      className={`${sliderCSS.dotsContainer} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Carousel Dots"
    >
      {slideIndexes.map(index => {
        const isActive =
          index ===
          getSelectedDot(passVisibleSlides, currentSlide, slidesPerPage)
        return (
          <div
            className={`${sliderCSS.dot} ${
              isActive ? 'bg-emphasis' : 'bg-muted-3'
            } grow dib br-100 pa2 mr2 ml2 bw0 pointer outline-0`}
            style={{
              height: `${DOTS_DEFAULT_SIZE}rem`,
              width: `${DOTS_DEFAULT_SIZE}rem`,
            }}
            key={index}
            tabIndex={index}
            onKeyDown={() => handleDotClick(index)}
            onClick={() => handleDotClick(index)}
            role="button"
            aria-controls={controls}
            aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
          />
        )
      })}
    </div>
  )
}

export default memo(PaginationDots)