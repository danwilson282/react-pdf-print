// htmlToPdf.tsx
import React from "react";
import { parseDocument } from "htmlparser2";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { nodeStyles } from "../styles/nodeStyle";


/** Map DOM node -> React-PDF nodes */
function renderNode(node: any, keyPrefix = ""): React.ReactNode | null {
  if (!node) return null;

  // Handle text nodes
  if (node.type === "text") {
    const txt = (node.data || "").replace(/\s+/g, " ");
    if (!txt.trim()) return null;
    return <Text key={keyPrefix}>{txt}</Text>;
  }

  // Handle element nodes
  if (node.type === "tag") {
    const tag = node.name.toLowerCase();
    const children = (node.children || [])
      .map((c: any, i: number) => renderNode(c, `${keyPrefix}_${tag}_${i}`))
      .filter(Boolean) as React.ReactNode[];

    switch (tag) {
      case "p":
        return (
          <View key={keyPrefix} style={nodeStyles.paragraph}>
            {children}
          </View>
        );
      case "h1":
        return (
          <Text key={keyPrefix} style={nodeStyles.heading1}>
            {children}
          </Text>
        );
      case "h2":
        return (
          <Text key={keyPrefix} style={nodeStyles.heading2}>
            {children}
          </Text>
        );
      case "h3":
        return (
          <Text key={keyPrefix} style={nodeStyles.heading3}>
            {children}
          </Text>
        );
      case "strong":
      case "b":
        return (
          <Text key={keyPrefix} style={nodeStyles.strong}>
            {children}
          </Text>
        );
      case "em":
      case "i":
        return (
          <Text key={keyPrefix} style={nodeStyles.em}>
            {children}
          </Text>
        );
      case "u":
        return (
          <Text key={keyPrefix} style={nodeStyles.underline}>
            {children}
          </Text>
        );
      case "img": {
        const src = node.attribs?.src || "";
        const width = node.attribs?.width ? Number(node.attribs.width) : 20;
        const height = node.attribs?.height ? Number(node.attribs.height) : 20;
        if (!src) return null;
        return (
          <Image
            key={keyPrefix}
            src={src}
            style={{ ...nodeStyles.inlineImage, width, height }}
          />
        );
      }
      case "ul":
      case "ol": {
        const isOrdered = tag === "ol";
        const listItems = (node.children || [])
          .filter((c: any) => c.type === "tag" && c.name === "li")
          .map((li: any, idx: number) => {
            const liChildren = (li.children || [])
              .map((c: any, i: number) =>
                renderNode(c, `${keyPrefix}_li_${idx}_${i}`)
              )
              .filter(Boolean);
            const bullet = isOrdered ? `${idx + 1}. ` : "• ";
            return (
              <View key={`${keyPrefix}_li_${idx}`} style={nodeStyles.listItem}>
                <Text style={nodeStyles.listBullet}>{bullet}</Text>
                <View style={{ flex: 1 }}>{liChildren}</View>
              </View>
            );
          });
        return <View key={keyPrefix}>{listItems}</View>;
      }
      case "table": {
        const rows = (node.children || []).filter(
          (c: any) => c.type === "tag" && c.name === "tr"
        );
        const colCount = Math.max(
          ...rows.map(
            (r: any) =>
              r.children.filter(
                (c: any) => c.type === "tag" && (c.name === "td" || c.name === "th")
              ).length
          )
        );
        const colWidth = `${100 / Math.max(1, colCount)}%`;

        return (
          <View key={keyPrefix} style={nodeStyles.table}>
            {rows.map((tr: any, rIdx: number) => {
              const cells = tr.children.filter(
                (c: any) => c.type === "tag" && (c.name === "td" || c.name === "th")
              );
              return (
                <View key={`${keyPrefix}_tr_${rIdx}`} style={nodeStyles.tableRow}>
                  {cells.map((cell: any, cIdx: number) => {
                    const cellChildren = (cell.children || [])
                      .map((c: any, i: number) =>
                        renderNode(c, `${keyPrefix}_tr${rIdx}_c${cIdx}_${i}`)
                      )
                      .filter(Boolean);
                    return (
                      <View
                        key={`${keyPrefix}_c${cIdx}`}
                        style={{ ...nodeStyles.tableCol, width: colWidth }}
                      >
                        {cellChildren}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      }
      case "span":
      case "div":
      default:
        return <Text key={keyPrefix}>{children}</Text>;
    }
  }

  return null;
}

export function renderHtmlToPdfNodes(html: string): React.ReactNode[] {
  const doc = parseDocument(html, { decodeEntities: true });
  return (doc.children || [])
    .map((n: any, i: number) => renderNode(n, `root_${i}`))
    .filter(Boolean) as React.ReactNode[];
}