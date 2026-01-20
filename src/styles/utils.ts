type SpaceProp = 'margin' | 'padding';

const makeSpaceProps = (base: SpaceProp) => {
  return [
    `${base}BlockStart`,
    `${base}InlineEnd`,
    `${base}BlockEnd`,
    `${base}InlineStart`,
  ] as const;
};

export const space = (cssProp: SpaceProp, cssString: string) => {
  const vals = cssString.split(' ');
  const spaceProps = makeSpaceProps(cssProp);
  const [top, right, bottom, left] = spaceProps;

  switch (vals.length) {
    case 1:
      return {
        [top]: cssString,
        [right]: cssString,
        [bottom]: cssString,
        [left]: cssString,
      };
    case 2: {
      return {
        [top]: vals[0],
        [right]: vals[1],
        [bottom]: vals[0],
        [left]: vals[1],
      };
    }
    case 3:
      return {
        [top]: vals[0],
        [right]: vals[1],
        [bottom]: vals[2],
        [left]: vals[1],
      };
    case 4:
      return {
        [top]: vals[0],
        [right]: vals[1],
        [bottom]: vals[2],
        [left]: vals[3],
      };
    default:
      console.warn(`Invalid number of values for ${cssProp}: ${cssString}`);
      return {
        cssProp: cssString,
      };
  }
};
