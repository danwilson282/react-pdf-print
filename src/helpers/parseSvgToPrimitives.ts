// src/parseSvgToPrimitives.ts
import { DOMParser } from 'xmldom';

export type SvgPrimitive =
  | {
      type: 'path';
      props: { d: string; fill?: string };
    }
  | {
      type: 'g';
      props: {};
      children?: SvgPrimitive[];
    };

export interface ParsedSvg {
  viewBox: string;
  primitives: SvgPrimitive[];
}

export function parseSvgToPrimitives(svgString: string): ParsedSvg {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.getElementsByTagName('svg')[0];
  if (!svg) throw new Error('No <svg> found');

  const viewBox = svg.getAttribute('viewBox') || '0 0 100 100';

  const parseNode = (node: any): SvgPrimitive | null => {
    const name = node.nodeName;

    if (name === 'path') {
      return {
        type: 'path',
        props: {
          d: node.getAttribute('d'),
          fill: node.getAttribute('fill') || 'black',
        },
      };
    }

    if (name === 'g') {
      const children: SvgPrimitive[] = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = parseNode(node.childNodes[i]);
        if (child) children.push(child);
      }

      return {
        type: 'g',
        props: {},
        children,
      };
    }

    return null;
  };

  const primitives: SvgPrimitive[] = [];
  for (let i = 0; i < svg.childNodes.length; i++) {
    const child = parseNode(svg.childNodes[i]);
    if (child) primitives.push(child);
  }

  return { viewBox, primitives };
}
