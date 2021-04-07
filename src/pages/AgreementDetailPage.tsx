import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb, Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { AgreementModel } from "../modules/loan/agreement/AgreementModel";
import { AgreementDetail } from "../modules/loan/agreement/components";

interface IAgreementDetailPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AgreementDetailPage extends React.Component<IAgreementDetailPage> {
  private agreement = AgreementModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.agreement.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.agreement.getAgreementDetail();
    }
  }
  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <Loading active={this.agreement.loading} />
        <ErrorMessage
          errorobj={this.agreement.error}
          float={true}
          timeout={10000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/loan/agreement"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.agreementDetailPage.searchContracts")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.agreementDetailPage.contractInformation")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <AgreementDetail agreement={this.agreement} />
      </Container>
    );
  }
}

export default withRouter(withTranslation()(AgreementDetailPage));
