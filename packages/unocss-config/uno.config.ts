/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

// uno.config.ts

import { defineConfig, presetUno, type Rule } from "unocss";

/**
 * 4px baseline grid, 0.25rem = 4px, respects --mb-size multiplier
 */
const addScaleMultiplier = (value: string, unit?: string) =>
  `calc(var(--mb-size)*${value + (unit || "")})`;

function gridUnitToSize(value: number) {
  return addScaleMultiplier(String(value * 0.25), "rem");
}

function gridUnitToPx(value: number) {
  return value * 4;
}

const sizeArray = Array.from({ length: 100 }, (_, i) => gridUnitToSize(i));

const sizeObject = sizeArray.reduce(
  (obj: Record<string, string>, value, index) => {
    obj[String(index)] = value;
    return obj;
  },
  {},
);

/**
 *
 * @param min grid units
 * @param vmin pixels
 * @param max grid units
 * @param vmax pixels
 * @returns something the browser can parse
 */
const fancyClamp = (min: number, vmin: number, max: number, vmax: number) => {
  const minPx = gridUnitToPx(min);
  const maxPx = gridUnitToPx(max);

  const slope = (maxPx - minPx) / (vmax - vmin);

  const clampMin = gridUnitToSize(min);
  const clampVal = `${gridUnitToSize(min)} + (100vw - ${vmin}px) * ${slope}`;
  const clampMax = gridUnitToSize(max);

  // TODO: `calc` is not needed inside `clamp`
  const clamp = `clamp(${clampMin}, ${clampVal}, ${clampMax})`;

  return clamp;
};

type ThemeWithBreakpoints = {
  breakpoints: Record<string, string>;
} & Record<string, any>;

const createLerped = (ruleKey: string, cssProperty: string): Rule => {
  const breakpointKeysMatcher = "[a-z]+";
  const viewportPattern = `(?:\\d+|${breakpointKeysMatcher})`;

  const regex = new RegExp(
    `^lerp:${ruleKey}-(\\d+)@(${viewportPattern}),(\\d+)@(${viewportPattern})$`,
  );
  const rule: Rule = [
    regex,
    (match: RegExpMatchArray, ruleContext) => {
      const theme = ruleContext.theme as ThemeWithBreakpoints;
      const [_, min, vMin, max, vMax] = match;

      // Convert viewport values if they're breakpoint keys
      const resolveViewport = (viewport: string) => {
        // check if the string is a number
        if (!isNaN(parseInt(viewport))) {
          return parseInt(viewport);
        }

        if (viewport in theme.breakpoints) {
          return parseFloat(theme.breakpoints[viewport]);
        }

        return 1;
      };

      const clampedValue = fancyClamp(
        parseInt(min),
        resolveViewport(vMin),
        parseInt(max),
        resolveViewport(vMax),
      );

      /** CUSTOM COMMENT */
      return [{ [cssProperty]: clampedValue }];
    },
  ];

  return rule;
};

/**
 * TODO: there has to be a better way to do this...
 * @see https://unocss.dev/config/variants
 */
const pseudoClasses = [
  // all margins
  ["m", "margin"],
  ["mx", "margin-inline"],
  ["my", "margin-block"],
  ["mt", "margin-top"],
  ["mr", "margin-right"],
  ["mb", "margin-bottom"],
  ["ml", "margin-left"],
  ["gap", "gap"],

  // all paddings
  ["p", "padding"],
  ["px", "padding-inline"],
  ["py", "padding-block"],
  ["pt", "padding-top"],
  ["pr", "padding-right"],
  ["pb", "padding-bottom"],
  ["pl", "padding-left"],

  // sizing
  ["w", "width"],
  ["h", "height"],
  ["min-w", "min-width"],
  ["min-h", "min-height"],
  ["max-w", "max-width"],
  ["max-h", "max-height"],
  ["rounded", "border-radius"],
];

const createSpacingRules = () => {
  const rules: Rule[] = pseudoClasses.map(([tw, css]) => {
    return createLerped(tw, css);
  });
  return rules;
};

export default defineConfig({
  presets: [presetUno()],
  rules: createSpacingRules(),
  extendTheme: (theme) => {
    return {
      ...theme,
      breakpoints: {
        xs: "380px",
        // @ts-ignore
        ...theme.breakpoints,
      },
    };
  },
  theme: {
    spacing: sizeObject,
    // would be nice if there was a single property to define all sizing,
    // like spacing, but for now we have to define each property separately
    blockSize: sizeObject,
    inlineSize: sizeObject,
    width: sizeObject,
    height: sizeObject,
    minWidth: sizeObject,
    minHeight: sizeObject,
    // TODO: see why max-width is not working
    maxWidth: sizeObject,
    maxHeight: sizeObject,
    borderRadius: sizeObject,
    // prettier-ignore
    fontSize: {
      ...sizeObject,
      'xs':   [addScaleMultiplier('0.75', "rem"),   addScaleMultiplier('1', "rem")],
      'sm':   [addScaleMultiplier('0.875', "rem"),  addScaleMultiplier('1.25', "rem")],
      'base': [addScaleMultiplier('1', "rem"),      addScaleMultiplier('1.5', "rem")],
      'lg':   [addScaleMultiplier('1.125', "rem"),  addScaleMultiplier('1.75', "rem")],
      'xl':   [addScaleMultiplier('1.25', "rem"),   addScaleMultiplier('1.75', "rem")],
      '2xl':  [addScaleMultiplier('1.5', "rem"),    addScaleMultiplier('2', "rem")],
      '3xl':  [addScaleMultiplier('1.875', "rem"),  addScaleMultiplier('2.25', "rem")],
      '4xl':  [addScaleMultiplier('2.25', "rem"),   addScaleMultiplier('2.5', "rem")],
      '5xl':  [addScaleMultiplier('3', "rem"),      addScaleMultiplier('1')],
      '6xl':  [addScaleMultiplier('3.75', "rem"),   addScaleMultiplier('1')],
      '7xl':  [addScaleMultiplier('4.5', "rem"),    addScaleMultiplier('1')],
      '8xl':  [addScaleMultiplier('6', "rem"),      addScaleMultiplier('1')],
      '9xl':  [addScaleMultiplier('8', "rem"),      addScaleMultiplier('1')],
    },
    colors: {
      accent: {
        "50": "#edf9ff",
        "100": "#d6efff",
        "200": "#b5e5ff",
        "300": "#83d6ff",
        "400": "#48bdff",
        "500": "#1e9bff",
        "600": "#067cff",
        "700": "#0062f2",
        "800": "#084fc5",
        "900": "#0d469b",
        "950": "#0e2b5d",
      },
      error: {
        "50": "#fff1f3",
        "100": "#ffe4e9",
        "200": "#fecdd5",
        "300": "#fda4b3",
        "400": "#fb7189",
        "500": "#f43f5e",
        "600": "#e11d3f",
        "700": "#be122f",
        "800": "#9f122a",
        "900": "#881327",
        "950": "#4c0511",
      },
      success: {
        "50": "#ecfdf7",
        "100": "#d1faec",
        "200": "#a7f3da",
        "300": "#6ee7bf",
        "400": "#34d39e",
        "500": "#10b981",
        "600": "#059666",
        "700": "#047852",
        "800": "#065f42",
        "900": "#064e36",
        "950": "#022c1e",
      },
    },
  },
  // extendTheme: (theme) => {
  //   // prettier-ignore
  //   theme.fontSize = {
  //     'xs':   [size('0.75', "rem"),   size('1', "rem")],
  //     'sm':   [size('0.875', "rem"),  size('1.25', "rem")],
  //     'base': [size('1', "rem"),      size('1.5', "rem")],
  //     'lg':   [size('1.125', "rem"),  size('1.75', "rem")],
  //     'xl':   [size('1.25', "rem"),   size('1.75', "rem")],
  //     '2xl':  [size('1.5', "rem"),    size('2', "rem")],
  //     '3xl':  [size('1.875', "rem"),  size('2.25', "rem")],
  //     '4xl':  [size('2.25', "rem"),   size('2.5', "rem")],
  //     '5xl':  [size('3', "rem"),      size('1')],
  //     '6xl':  [size('3.75', "rem"),   size('1')],
  //     '7xl':  [size('4.5', "rem"),    size('1')],
  //     '8xl':  [size('6', "rem"),      size('1')],
  //     '9xl':  [size('8', "rem"),      size('1')],
  //   }
  // },
});

// 'xs':   [size('0.75', "rem"),   size('1', "rem")],
// 'sm':   [size('0.875', "rem"),  size('1.25', "rem")],
// 'base': [size('1', "rem"),      size('1.5', "rem")],
// 'lg':   [size('1.125', "rem"),  size('1.75', "rem")],
// 'xl':   [size('1.25', "rem"),   size('1.75', "rem")],
// '2xl':  [size('1.5', "rem"),    size('2', "rem")],
// '3xl':  [size('1.875', "rem"),  size('2.25', "rem")],
// '4xl':  [size('2.25', "rem"),   size('2.5', "rem")],
// '5xl':  [size('3', "rem"),      size('1')],
// '6xl':  [size('3.75', "rem"),   size('1')],
// '7xl':  [size('4.5', "rem"),    size('1')],
// '8xl':  [size('6', "rem"),      size('1')],
// '9xl':  [size('8', "rem"),      size('1')],

const clampWithCss = (min: number, vmin: number, max: number, vmax: number) => {
  /*
  --min-width: 10;
  --max-width: 30;
  --min-viewport: 300;
  --max-viewport: 500;

  --slope: calc(
    (var(--max-width) - var(--min-width)) /
      (var(--max-viewport) - var(--min-viewport))
  );

  width: clamp(
    var(--min-width) * 1px,
    var(--min-width) * 1px + (100vw - var(--min-viewport) * 1px) * var(--slope),
    var(--max-width) * 1px
  );
  */

  return [
    {
      "--min-width": `${min}`,
      "--max-width": `${max}`,
      "--min-viewport": `${vmin}`,
      "--max-viewport": `${vmax}`,
      "--slope": `calc((var(--max-width) - var(--min-width)) / (var(--max-viewport) - var(--min-viewport)));`,
      "padding-inline": `clamp(
          var(--min-width) * 1px,
          var(--min-width) * 1px + (100vw - var(--min-viewport) * 1px) * var(--slope),
          var(--max-width) * 1px
        );`,
    },
  ];
};
