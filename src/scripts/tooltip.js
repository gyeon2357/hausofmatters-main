import gsap from 'gsap';

class Tooltip {
  constructor(gridEl) {
    this.grid = gridEl;
    this.artists = this.grid.children;
    if (this.artists.length === 0) return;
    this.tooltip = document.querySelector('.tooltip');
    this.arrow = this.tooltip.querySelector('.tooltip__row--ra svg');
    this.OFFSET_X = 20;
    this.OFFSET_Y = 0;
    this.animationConfig = {
      texts: {
        duration: 0.7,
        ease: 'expo',
      },
      tooltip: {
        duration: 0.6,
        ease: 'power4.inOut',
      },
      textsDelay: 0.4,
      hideDelay: '-=0.7',
    };
    this.rowAnimationDirections = {
      stagename: { in: { yPercent: -100 }, out: { yPercent: -100 } },
      name: { in: { yPercent: 100 }, out: { yPercent: 100 } },
      genre: { in: { yPercent: 100 }, out: { yPercent: 100 } },
      arrow: { in: { yPercent: -100 }, out: { yPercent: -100 } },
    };
    this.hoverTarget = null;
    this.isTooltipVisible = false;
    this.scaleDownTimeout;
    this.scaleDownTimeline;
    this.mouseLeaveTimeout;
    this.rowTimelines = {};
    this.arrowTimeline = null;
    this.windowWidth = window.innerWidth;

    this.xTo = gsap.quickTo(this.tooltip, 'x', { duration: 0.6, ease: 'expo' });
    this.yTo = gsap.quickTo(this.tooltip, 'y', { duration: 0.6, ease: 'expo' });

    this.tooltip.querySelectorAll('.tooltip__row').forEach(row => row.dataset.active = '0');

    this.initializeEvents();
  }

  initializeEvents() {
    this.grid.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);

    [...this.artists].forEach(artist => {
      artist.addEventListener('mouseenter', this.handleMouseEnter);
      artist.addEventListener('mouseleave', this.handleMouseLeave);
    });
  }

  handleMouseMove = (e) => {
    if (!this.hoverTarget) return;

    const tooltipWidth = this.tooltip.offsetWidth;
    let tooltipX;
    const tooltipY = e.clientY + this.OFFSET_Y + window.scrollY;

    if (e.clientX + this.OFFSET_X + tooltipWidth > this.windowWidth) {
      tooltipX = e.clientX - this.OFFSET_X - tooltipWidth + window.scrollX;
    } else {
      tooltipX = e.clientX + this.OFFSET_X + window.scrollX;
    }

    if (!this.isTooltipVisible) {
      if (this.scaleDownTimeline) this.scaleDownTimeline.kill();
      clearTimeout(this.scaleDownTimeout);

      gsap.set(this.tooltip, { x: tooltipX, y: tooltipY });
      gsap.fromTo(
        this.tooltip,
        { scale: 0, opacity: 1, transformOrigin: '0% 100%' },
        { ...this.animationConfig.tooltip, scale: 1 }
      );

      this.isTooltipVisible = true;
    } else {
      this.xTo(tooltipX);
      this.yTo(tooltipY);
    }

    clearTimeout(this.scaleDownTimeout);
    this.scaleDownTimeout = setTimeout(() => {
      if (!this.hoverTarget) {
        this.scaleDownTimeline = gsap.timeline();
        this.updateTooltip({ stagename: '', name: '', genre: '' }, this.scaleDownTimeline, 'out');
        this.scaleDownTimeline.to(
          this.tooltip,
          { ...this.animationConfig.tooltip, scale: 0 },
          this.animationConfig.hideDelay
        );
        this.isTooltipVisible = false;
      }
    }, 50);
  };

  handleMouseEnter = (e) => {
    clearTimeout(this.mouseLeaveTimeout);
    this.hoverTarget = e.currentTarget;

    if (this.scaleDownTimeline) this.scaleDownTimeline.kill();
    clearTimeout(this.scaleDownTimeout);

    const stageName = this.hoverTarget.dataset.stagename;
    const name = this.hoverTarget.dataset.name;
    const genre = this.hoverTarget.dataset.genre;

    const updateTimeline = gsap.timeline();
    this.updateTooltip({ stagename: stageName, name, genre }, updateTimeline, this.isTooltipVisible ? 'none' : 'in');
  };

  handleMouseLeave = () => {
    this.hoverTarget = null;

    this.mouseLeaveTimeout = setTimeout(() => {
      if (!this.hoverTarget && this.isTooltipVisible) {
        gsap.set(this.tooltip, { scale: 0, opacity: 0 });
        this.isTooltipVisible = false;
      }
    }, 50);
  };

  handleResize = () => {
    this.windowWidth = window.innerWidth;
  };

  initializeEvents() {
    this.grid.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);

    [...this.artists].forEach(artist => {
      artist.addEventListener('mouseenter', this.handleMouseEnter);
      artist.addEventListener('mouseleave', this.handleMouseLeave);
    });
  }

  destroy() {
    if (this.arrowTimeline) this.arrowTimeline.kill();
    if (this.scaleDownTimeline) this.scaleDownTimeline.kill();
    Object.values(this.rowTimelines).forEach(timeline => timeline && timeline.kill());

    clearTimeout(this.scaleDownTimeout);
    clearTimeout(this.mouseLeaveTimeout);

    this.grid.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);

    [...this.artists].forEach(artist => {
      artist.removeEventListener('mouseenter', this.handleMouseEnter);
      artist.removeEventListener('mouseleave', this.handleMouseLeave);

    });
  }

  updateTooltip(values, timeline, direction) {
    Object.entries(values).forEach(([field, newValue]) => {
      const rowSelector = `[data-field="${field}"]`;
      this.updateTextSlider(rowSelector, newValue, timeline, direction);
    });

    if ((direction === 'in' && !this.isTooltipVisible) || (direction === 'out' && this.isTooltipVisible)) {
      this.animateArrow(timeline, direction);
    }
  }

  updateTextSlider(rowSelector, newValue, timeline, direction) {
    const row = this.tooltip.querySelector(rowSelector);
    const textSliders = row.querySelectorAll('.oh__inner');

    if (textSliders.length < 2) return;

    const activeIndex = row.dataset.active === '0' ? 0 : 1;
    const inactiveIndex = activeIndex === 0 ? 1 : 0;

    const currentSlider = textSliders[activeIndex];
    const nextSlider = textSliders[inactiveIndex];

    const rowField = rowSelector.replace('[data-field="', '').replace('"]', '');
    const animationDirection = this.rowAnimationDirections[rowField] || this.rowAnimationDirections['name'];

    const clonedOutDirection = { ...animationDirection.out };
    const clonedInDirection = { ...animationDirection.in };

    if (this.rowTimelines[rowSelector] && direction !== 'out') {
      this.rowTimelines[rowSelector].kill();
    }
    this.rowTimelines[rowSelector] = gsap.timeline();

    if (direction === 'in') {
      gsap.set(currentSlider, clonedOutDirection);
      gsap.set(nextSlider, clonedInDirection);

      this.rowTimelines[rowSelector].to(currentSlider, {
        ...this.animationConfig.texts,
        ...clonedOutDirection,
      }, this.animationConfig.textsDelay);

      gsap.set(nextSlider, clonedInDirection);
      this.rowTimelines[rowSelector].to(nextSlider, {
        ...this.animationConfig.texts,
        yPercent: 0,
        onStart: () => {
          nextSlider.textContent = newValue;
        },
      }, this.animationConfig.textsDelay);
    }
    else if (direction === 'none') {
      const transitionOutDirection = {
        stagename: { yPercent: 100 },
        name: { yPercent: -100 },
        genre: { yPercent: -100 },
      }[rowField] || { yPercent: 0 };

      this.rowTimelines[rowSelector].to(currentSlider, {
        ...this.animationConfig.texts,
        ...transitionOutDirection,
      }, 0);

      gsap.set(nextSlider, clonedInDirection);
      this.rowTimelines[rowSelector].to(nextSlider, {
        ...this.animationConfig.texts,
        yPercent: 0,
        onStart: () => {
          nextSlider.textContent = newValue;
        },
      }, 0);
    }
    else if (direction === 'out') {
      this.rowTimelines[rowSelector].to(currentSlider, {
        ...clonedOutDirection,
        ...this.animationConfig.texts,
      }, 0);
    }

    row.dataset.active = inactiveIndex.toString();

    timeline.add(this.rowTimelines[rowSelector], 0);
  }

  animateArrow(timeline, direction = 'none') {
    if (!this.arrow) return;

    if (this.arrowTimeline) {
      this.arrowTimeline.kill();
    }
    this.arrowTimeline = gsap.timeline();

    const animationDirection = this.rowAnimationDirections['arrow'];

    if (direction === 'in') {
      this.arrowTimeline.fromTo(this.arrow, {
        ...animationDirection.in,
      }, {
        ...this.animationConfig.texts,
        yPercent: 0,
      }, this.animationConfig.textsDelay);
    } else if (direction === 'out') {
      this.arrowTimeline.to(this.arrow, {
        ...this.animationConfig.texts,
        ...animationDirection.out,
      }, 0);
    }

    timeline.add(this.arrowTimeline, 0);
  }
}

let tooltip;

const handlePageEvent = (type) => {
  const page = document.documentElement.getAttribute('data-page');
  if (page !== 'artists') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (type === 'load') {
    tooltip = new Tooltip(document.querySelector('[data-grid]'));
  } else if (type === 'before-swap') {
    tooltip?.destroy();
  }
};

document.addEventListener('astro:page-load', () => handlePageEvent('load'));
document.addEventListener('astro:before-swap', () => handlePageEvent('before-swap'));
