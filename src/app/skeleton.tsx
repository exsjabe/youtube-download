import type {ClassNameProps, Palette} from 'props';
import {Fragment} from 'react';
import type {ReactElement} from 'react';
import {DaisyUIColorMap} from '../constants';

type SkeletonProps = {
  background?: Palette;
  count?: number;
  width?: string;
  height?: string;
  largeWidth?: string;
  largeHeight?: string;
  inline?: boolean;
  highlight?: Palette;
} & ClassNameProps;

export const Skeleton = ({
  inline = false,
  count = 1,
  width = '100%',
  height = '100%',
  largeHeight,
  largeWidth,
  background = 'base-100',
  highlight = 'base-300',
  className,
}: SkeletonProps) => {
  const elements: ReactElement[] = [];
  const style: Record<string, string> = {
    '--highlight-color': DaisyUIColorMap[highlight],
    '--base-color': DaisyUIColorMap[background],
    height: height,
    width: width,
    '--large-width': largeWidth ?? width,
    '--large-height': largeHeight ?? height,
  };

  for (let i = 0; i < count; i++) {
    const skeletonSpan = (
      <span
        key={i}
        style={style}
        className={`react-loading-skeleton ${className ?? ''}`}
      >
        &zwnj;
      </span>
    );

    if (inline) {
      elements.push(skeletonSpan);
    } else {
      // Without the <br />, the skeleton lines will all run together if
      // `width` is specified
      elements.push(
        <Fragment key={i}>
          {skeletonSpan}
          <br />
        </Fragment>
      );
    }
  }

  return (
    <span aria-live="polite" aria-busy={true} className="h-fit w-fit">
      {elements}
    </span>
  );
};
