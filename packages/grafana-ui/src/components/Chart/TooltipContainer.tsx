import React, { useState, useLayoutEffect, useRef, HTMLAttributes } from 'react';
import { stylesFactory } from '../../themes/stylesFactory';
import { css, cx } from 'emotion';
import { useTheme } from '../../themes/ThemeContext';
import useWindowSize from 'react-use/lib/useWindowSize';
import { GrafanaTheme } from '@grafana/data';

interface TooltipContainerProps extends HTMLAttributes<HTMLDivElement> {
  position: { x: number; y: number };
  offset: { x: number; y: number };
  children?: JSX.Element;
}

export const TooltipContainer: React.FC<TooltipContainerProps> = ({
  position: { x: positionX, y: positionY },
  offset: { x: offsetX, y: offsetY },
  children,
  className,
  ...otherProps
}) => {
  const theme = useTheme();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [placement, setPlacement] = useState({
    x: positionX + offsetX,
    y: positionY + offsetY,
  });

  // Make sure tooltip does not overflow window
  useLayoutEffect(() => {
    let xO = 0,
      yO = 0;
    if (tooltipRef && tooltipRef.current) {
      const measurement = tooltipRef.current.getBoundingClientRect();
      const xOverflow = width - (positionX + measurement.width);
      const yOverflow = height - (positionY + measurement.height);
      if (xOverflow < 0) {
        xO = measurement.width;
      }

      if (yOverflow < 0) {
        yO = measurement.height;
      }
    }

    setPlacement({
      x: positionX + offsetX - xO,
      y: positionY + offsetY - yO,
    });
  }, [tooltipRef, width, height, positionX, offsetX, positionY, offsetY]);

  const styles = getTooltipContainerStyles(theme);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${placement.x}px, ${placement.y}px, 0)`,
      }}
      {...otherProps}
      className={cx(styles.wrapper, className)}
    >
      {children}
    </div>
  );
};

TooltipContainer.displayName = 'TooltipContainer';

const getTooltipContainerStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    wrapper: css`
      overflow: hidden;
      background: ${theme.colors.bg2};
      /* max-width is set up based on .grafana-tooltip class that's used in dashboard */
      max-width: 800px;
      padding: ${theme.spacing.sm};
      border-radius: ${theme.border.radius.sm};
      z-index: ${theme.zIndex.tooltip};
    `,
  };
});
