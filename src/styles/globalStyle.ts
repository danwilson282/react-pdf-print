import { StyleSheet, Font } from "@react-pdf/renderer";

Font.register({ family: 'Open Sans', src: 'https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf' });

//AQA Styles
// fontSize 16
// h1 4rem
// h2 2rem
// h3 1.4 rem
// h4 1.2rem
// --aqa-neutral: #2b2438;
// --aqa-purple-primary: #371376;
// --aqa-purple-secondary: #5f4291;
// --aqa-purple-tertiary: #8771ac;
// --aqa-red: #c8194b;
// --aqa-red-60: #de7493;



export const globalStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Open Sans" },
  heading: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  tocItem: { marginBottom: 5 },
  header: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
  },
});