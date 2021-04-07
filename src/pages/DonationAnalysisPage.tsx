import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";

interface IDonationAnalysisPage extends WithTranslation {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationAnalysisPage extends React.Component<IDonationAnalysisPage> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "donation",
    });
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <iframe
          src={`${process.env.REACT_APP_DOP_DOCS_ENDPOINT}/graph_pages/charts.php`}
          // frameborder="0"
          // allowfullscreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            // minHeight: "100vh",
          }}
        ></iframe>
      </Container>
    );
  }
}

export default withTranslation()(DonationAnalysisPage);
