import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { LocationModel } from "../components/address";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { GuaranteeFormEdit } from "../modules/loan/guarantee/components";
import { GuaranteeModel } from "../modules/loan/guarantee/GuaranteeModel";
import { RequestListModel } from "../modules/loan/request/RequestListModel";
import { RequestModel } from "../modules/loan/request/RequestModel";

interface IGuaranteeFormEditPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class GuaranteeFormEditPage extends React.Component<IGuaranteeFormEditPage> {
  public guarantee = GuaranteeModel.create({});
  public requestList = RequestListModel.create({});
  public request = RequestModel.create({});
  public locationStore = LocationModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.guarantee.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.guarantee.getGuaranteeDetail();
      await this.locationStore.loadSubdistrict(
        this.guarantee.signLocationAddress.subDistrict
      );
      await this.locationStore.loadDistrict(
        this.guarantee.signLocationAddress.district
      );
      await this.locationStore.loadProvince(
        this.guarantee.signLocationAddress.province
      );
    }
  }

  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Loading active={this.guarantee.loading} />
        <ErrorMessage
          errorobj={this.guarantee.error}
          float={true}
          timeout={10000}
        />
        <AlertMessage
          messageobj={this.guarantee.alert}
          float={true}
          timeout={3000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/loan/guarantee"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.guaranteeDetailPage.findListGuarantees")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.guaranteeDetailPage.editGurantee")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <GuaranteeFormEdit
          guarantee={this.guarantee}
          locationStore={this.locationStore}
          requestList={this.requestList}
          request={this.request}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(GuaranteeFormEditPage));
