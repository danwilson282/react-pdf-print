import { Page, Text, View } from "@react-pdf/renderer";
import { globalStyles } from "../styles/globalStyle";
import { tocType } from "../App";

type Props = {
  tocMap: tocType
}

export const TableOfContents: React.FC<Props> = ({ tocMap }) => {
    const parseType = (type: string) => {
        const parts = type.split("_");
        const num1 = Number(parts[0]) || 0;
        const num2 = Number(parts[1]) || 0;
        const letter = parts[2] || "";
        return { num1, num2, letter };
      };
  return (
    <Page size="A4" style={globalStyles.page}>
      <Text style={globalStyles.heading}>Contents</Text>
      <Text>{JSON.stringify(tocMap,null,2)}</Text>
      <View>
      {[...tocMap]
        .sort((a, b) => {
          const aParsed = parseType(a.type);
          const bParsed = parseType(b.type);
          if (aParsed.num1 !== bParsed.num1) return aParsed.num1 - bParsed.num1;
          if (aParsed.num2 !== bParsed.num2) return aParsed.num2 - bParsed.num2;
          return aParsed.letter.localeCompare(bParsed.letter);
        })
        .map((contentItem, i) => {
          const sectionType = parseType(contentItem.type).letter;
          const sectionStyle = () => {
            switch (sectionType) {
              case 'a':
                return globalStyles.tocSectionA;
              case 'b':
                return globalStyles.tocSectionB;
              case 'c':
                return globalStyles.tocSectionC;
              default:
                return {};
            }
          }
          return (
            <View style={globalStyles.tocItem} key={i}>
              <Text style={sectionStyle()}>
                {contentItem.title}
              </Text>
              <Text style={sectionStyle()}>{contentItem.pageNumber}</Text>
            </View>

          )
        })}
      </View>
    </Page>
  );
}