import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import { DonationDirectFormEdit } from "../modules/donation/components";
import { DonationDirectModel } from "../modules/donation/DonationDirectModel";

interface IDonationDirectFormEditPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationDirectFormEditPage extends React.Component<IDonationDirectFormEditPage> {
  public donationDirectStore = DonationDirectModel.create({});
  public orgList = OrgListModel.create({});

  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "donationNoneTabHeader",
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.donationDirectStore.setField({
      fieldname: "id",
      value: id || "",
    });

    if (id) {
      await this.donationDirectStore.getDonationDirectDetail();
    }
  }

  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Loading active={this.donationDirectStore.loading} />
        <ErrorMessage
          errorobj={this.donationDirectStore.error}
          float={true}
          timeout={10000}
        />
        <AlertMessage
          messageobj={this.donationDirectStore.alert}
          float={true}
          timeout={3000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/donation/directs"}>
            <Breadcrumb.Section>
              <Text shade={3}>{"ค้นหาการบริจาคเงินเข้ากองทุน"}</Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {"แก้ไขข้อมูลบริจาคเงินเข้ากองทุน"}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <DonationDirectFormEdit
          donationDirect={this.donationDirectStore}
          orgList={this.orgList}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(DonationDirectFormEditPage));
