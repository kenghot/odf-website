import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Image } from "semantic-ui-react";
import { IMAGES } from "../../../constants";
const { odf_logo } = IMAGES;
interface ILogo extends WithTranslation {
  ///
}
class Logo extends React.Component<ILogo> {
  public render() {
    return (
      <Header size="huge" textAlign="center">
        <Image src={odf_logo} alt="odf logo" size="big" />
        <Header.Content>
          กองทุนผู้สูงอายุ
          <Header.Subheader style={styles.subHeader}>
            กรมกิจการผู้สูงอายุ
          </Header.Subheader>
        </Header.Content>
      </Header>
    );
  }
}

const styles: any = {
  subHeader: {
    textAlign: "left",
  },
};

export default withTranslation()(Logo);
