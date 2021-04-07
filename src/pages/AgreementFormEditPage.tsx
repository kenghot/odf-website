import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";

import { LocationModel } from "../components/address";
import { AgreementModel } from "../modules/loan/agreement/AgreementModel";
import { AgreementFormEdit } from "../modules/loan/agreement/components";
import { RequestListModel } from "../modules/loan/request/RequestListModel";

interface IAgreementFormEditPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AgreementFormEditPage extends React.Component<IAgreementFormEditPage> {
  private agreement = AgreementModel.create({});
  public locationStore = LocationModel.create({});
  public locationStoreTest = LocationModel.create({});

  private requestList = RequestListModel.create({});
  public async componentDidMount() {
    const id = this.props.location.state || this.props.match.params.id;
    await this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
    await this.agreement.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.agreement.getAgreementDetail();
      await this.locationStore.loadSubdistrict(
        this.agreement.signLocationAddress.subDistrict
      );
      await this.locationStore.loadDistrict(
        this.agreement.signLocationAddress.district
      );
      await this.locationStore.loadProvince(
        this.agreement.signLocationAddress.province
      );
      await this.requestList.setField({
        fieldname: "filterRequestType",
        value: this.agreement.agreementType
      });
    }
  }

  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
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
              {t("page.agreementDetailPage.editAgreement")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <AgreementFormEdit
          agreement={this.agreement}
          locationStore={this.locationStore}
          requestList={this.requestList}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(AgreementFormEditPage));
