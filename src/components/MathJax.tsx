import React, { useMemo } from 'react';
import {
  Svg,
  Path,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { SvgPrimitive } from '../helpers/parseSvgToPrimitives';
import { renderMathMLToSVG } from "../helpers/mathjaxToSvg";
import { parseSvgToPrimitives } from '../helpers/parseSvgToPrimitives';

const styles = StyleSheet.create({
  page: { padding: 20 },
  svgContainer: { marginTop: 20 },
  svgStyle: {
    width: 200,
    height: 200,
  },
});

interface Props {
  content: string;
}

export const MathJax: React.FC<Props> = ({ content }) => {
  // memoize the SVG conversion, only runs when content changes
  const { viewBox, primitives } = useMemo(() => {
    const svgString = renderMathMLToSVG(content);
    return parseSvgToPrimitives(svgString);
  }, [content]);
  
  const renderPrimitives = (prims: SvgPrimitive[]): React.ReactNode =>
    prims.map((prim, idx) => {
      if (prim.type === 'path') {
        return <Path key={idx} d={prim.props.d} fill={prim.props.fill || 'black'} />;
      }
      if (prim.type === 'g') {
        return (
          <React.Fragment key={idx}>
            {renderPrimitives(prim.children || [])}
          </React.Fragment>
        );
      }
      return null;
    });

  return (

        <View style={styles.svgContainer}>
          <Svg viewBox={viewBox} style={styles.svgStyle}>
            {renderPrimitives(primitives)}
          </Svg>
        </View>

  );
};
