import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb, Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { LocationModel } from "../components/address";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import { AgreementModel } from "../modules/loan/agreement/AgreementModel";
import { AgreementFormCreate } from "../modules/loan/agreement/components";
import { RequestListModel } from "../modules/loan/request/RequestListModel";

interface IAgreementFormCreatePage extends WithTranslation {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AgreementFormCreatePage extends React.Component<
  IAgreementFormCreatePage
> {
  private orgList = OrgListModel.create({});
  private agreement = AgreementModel.create({});
  private requestList = RequestListModel.create({});
  public locationStore = LocationModel.create({});

  public async componentDidMount() {
    await this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
    await this.agreement.setAgreementItems();
    await this.requestList.setField({
      fieldname: "filterRequestType",
      value: this.agreement.agreementType
    });
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
        <AlertMessage
          messageobj={this.agreement.alert}
          float={true}
          timeout={3000}
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
        <ErrorMessage errorobj={this.agreement.error} float timeout={10000} />
        <AgreementFormCreate
          agreement={this.agreement}
          locationStore={this.locationStore}
          requestList={this.requestList}
          orgList={this.orgList}
        />
      </Container>
    );
  }
}

export default withTranslation()(AgreementFormCreatePage);
