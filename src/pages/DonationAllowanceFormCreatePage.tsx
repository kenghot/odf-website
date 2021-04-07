import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { LocationModel } from "../components/address";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import { IAuthModel } from "../modules/auth/AuthModel";
import { DonationAllowanceFormCreate } from "../modules/donation/components";
import { DonationAllowanceModel } from "../modules/donation/DonationAllowanceModel";

interface IDonationAllowanceFormCreatePage
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class DonationAllowanceFormCreatePage extends React.Component<IDonationAllowanceFormCreatePage> {
  public orgList = OrgListModel.create({});
  public locationStore = LocationModel.create({});
  public donationAllowanceStore = DonationAllowanceModel.create({});

  public async componentDidMount() {
    const { authStore } = this.props;
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "donationNoneTabHeader",
    });
    await this.orgList.setField({
      fieldname: "filterName",
      value: authStore!.userProfile.organization.orgName,
    });
    await this.orgList.load_data();
    await this.donationAllowanceStore.setField({
      fieldname: "organization",
      value: clone(authStore!.userProfile.organization),
    });
  }

  public async componentDidUpdate(prevProps: any) {
    const { authStore } = this.props;
    if (
      this.props.authStore!.userProfile.organization.id !==
      prevProps.authStore!.userProfile.organization.id
    ) {
      await this.orgList.setField({
        fieldname: "filterName",
        value: authStore!.userProfile.organization.orgName,
      });
      await this.orgList.load_data();
      await this.donationAllowanceStore.setField({
        fieldname: "organization",
        value: clone(authStore!.userProfile.organization),
      });
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
              {t("page.donationAllowanceFormCreatePage.breadcrumb2")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <DonationAllowanceFormCreate
          donationAllowance={this.donationAllowanceStore}
          locationStore={this.locationStore}
          orgList={this.orgList}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(DonationAllowanceFormCreatePage));
