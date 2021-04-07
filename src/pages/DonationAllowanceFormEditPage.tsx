import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { LocationModel } from "../components/address";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import DonationAllowanceFormEdit from "../modules/donation/components/DonationAllowanceFormEdit";
import { DonationAllowanceModel } from "../modules/donation/DonationAllowanceModel";

interface IDonationAllowanceFormEditPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationAllowanceFormEditPage extends React.Component<IDonationAllowanceFormEditPage> {
  public orgList = OrgListModel.create({});
  public locationStore = LocationModel.create({});
  public donationAllowanceStore = DonationAllowanceModel.create({});

  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "donationNoneTabHeader",
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.donationAllowanceStore.setField({
      fieldname: "id",
      value: id || "",
    });

    if (id) {
      await this.donationAllowanceStore.getDonationAllowanceDetail();
      await this.locationStore.loadSubdistrict(
        this.donationAllowanceStore.donator.idCardAddress.subDistrict
      );
      await this.locationStore.loadDistrict(
        this.donationAllowanceStore.donator.idCardAddress.district
      );
      await this.locationStore.loadProvince(
        this.donationAllowanceStore.donator.idCardAddress.province
      );
    }
  }

  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Loading active={this.donationAllowanceStore.loading} />
        <ErrorMessage
          errorobj={this.donationAllowanceStore.error}
          float={true}
          timeout={10000}
        />
        <AlertMessage
          messageobj={this.donationAllowanceStore.alert}
          float={true}
          timeout={3000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/donation/allowances"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.donationAllowanceFormCreatePage.breadcrumb1")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.donationAllowanceFormCreatePage.breadcrumb3")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <DonationAllowanceFormEdit
          donationAllowance={this.donationAllowanceStore}
          locationStore={this.locationStore}
          orgList={this.orgList}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(DonationAllowanceFormEditPage));
