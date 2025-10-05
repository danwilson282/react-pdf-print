// src/mathjaxToSvg.ts
import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import sharp from 'sharp';
// Setup MathJax
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mmlInput = new MathML();
const svgOutput = new SVG({ fontCache: 'none' });

const html = mathjax.document('', {
  InputJax: mmlInput,
  OutputJax: svgOutput,
});

/**
 * Convert MathML to SVG string using MathJax
 */
export function renderMathMLToSVG(mathml: string): string{
  const node = html.convert(mathml, { display: true });
  // const svg = adaptor.outerHTML(node);
  // const pngBuffer = await sharp(Buffer.from(svg))
  //   .png()
  //   .toBuffer();
  // return pngBuffer;
  return adaptor.outerHTML(node); // returns full <svg>...</svg>
}
