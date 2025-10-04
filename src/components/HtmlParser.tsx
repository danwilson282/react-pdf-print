// htmlToPdf.tsx
import React from "react";
import { parseDocument } from "htmlparser2";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { nodeStyles } from "../styles/nodeStyle";
import { registerSectionType } from "../App";
import Heading from "./Heading";

export function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join("");
  }

  if (React.isValidElement(node)) {
    // ✅ Cast as ReactElement<any> to access props safely
    const element = node as React.ReactElement<any>;
    return extractTextFromReactNode(element.props.children);
  }

  return "";
}

function stringToNumberHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/** Map DOM node -> React-PDF nodes */
function renderNode(node: any, keyPrefix = "", registerSection: registerSectionType): React.ReactNode | null {
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
      .map((c: any, i: number) => renderNode(c, `${keyPrefix}_${tag}_${i}`,registerSection))
      .filter(Boolean) as React.ReactNode[];
    let subId: string | undefined, uniqueId: string;
    switch (tag) {
      
      case "a":
        const src = node.attribs.href || "";
        return (
          <Link src={src} style={nodeStyles.link}>
            {children}
          </Link>
        )
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
        subId = keyPrefix.split('_').pop()
        uniqueId = `${keyPrefix}_h3`;
        return (
          <Heading
          key={keyPrefix}
          level={"b"}
          registerSection={registerSection}
          id={stringToNumberHash(uniqueId)}
          style={nodeStyles.heading3}
          subId={subId}
        >
          {children}
        </Heading>

        );
      case "h4":
        subId = keyPrefix.split('_').pop()
        uniqueId = `${keyPrefix}_h4`;
        return (
          <Text
          key={keyPrefix}
          render={({ pageNumber }) => {
            // registerSection(textContent, pageNumber, stringToNumberHash(uniqueId), `${pageNumber}_${subId}_c`);
            return children;
          }}
          style={nodeStyles.heading4}
        />

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
                renderNode(c, `${keyPrefix}_li_${idx}_${i}`,registerSection)
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
      case "hr":
        return  <View key={keyPrefix} style={nodeStyles.hr} />
        case "table": {
          const extractRows = (nodes: any[]): any[] => {
            return nodes.flatMap((node) => {
              if (node.type === "tag") {
                if (node.name === "tr") {
                  return [node];
                }
                if (["thead", "tbody", "tfoot"].includes(node.name)) {
                  return extractRows(node.children || []);
                }
              }
              return [];
            });
          };
        
          const rows = extractRows(node.children || []);
        
          const colCount = Math.max(
            ...rows.map(
              (r: any) =>
                (r.children || []).filter(
                  (c: any) => c.type === "tag" && (c.name === "td" || c.name === "th")
                ).length
            )
          );
        
          const colWidth = `${100 / Math.max(1, colCount)}%`;
          
          return (
            <View key={keyPrefix} style={nodeStyles.table} wrap={false}>
              {rows.map((tr: any, rIdx: number) => {
                const cells = (tr.children || []).filter(
                  (c: any) => c.type === "tag" && (c.name === "td" || c.name === "th")
                );
                return (
                  <View key={`${keyPrefix}_tr_${rIdx}`} style={nodeStyles.tableRow}>
                    {cells.map((cell: any, cIdx: number) => {
                      const cellChildren = (cell.children || [])
                        .map((c: any, i: number) =>
                          renderNode(c, `${keyPrefix}_tr${rIdx}_c${cIdx}_${i}`,registerSection)
                        )
                        .filter(Boolean);
                        const isHeader = cell.name === "th";
                      return (
                        <View
                          key={`${keyPrefix}_c${cIdx}`}
                          style={{ ...nodeStyles.tableCol,
                            ...(isHeader ? nodeStyles.tableHeaderCol : nodeStyles.tableDataCol),
                             width: colWidth }}
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
        
      case "p":
      case "div": {
        const isInline = node.children.every((c: any) => {
          return (
            c.type === "text" ||
            (c.type === "tag" && ["a", "span", "strong", "b", "em", "i", "u"].includes(c.name))
          );
        });
      
        if (isInline) {
          // render inline div as Text
          const inlineChildren = node.children
            .map((c: any, i: number) => renderNode(c, `${keyPrefix}_inline_${i}`,registerSection))
            .filter(Boolean);
          return (
            <Text key={keyPrefix} style={nodeStyles.paragraph}>
              {inlineChildren}
            </Text>
          );
        } else {
          // render block div as View
          return (
            <View key={keyPrefix} style={nodeStyles.paragraph}>
              {children}
            </View>
          );
        }
      }
      
      case "span":
      default:
        return <Text key={keyPrefix}>{children}</Text>;
    }
  }

  return null;
}

export function renderHtmlToPdfNodes(html: string, registerSection: registerSectionType): React.ReactNode[] {
  const doc = parseDocument(html, { decodeEntities: true });
  return (doc.children || [])
    .map((n: any, i: number) => renderNode(n, `root_${i}`,registerSection))
    .filter(Boolean) as React.ReactNode[];
}