import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb, Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { PermissionControl } from "../components/permission";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import { UserListModel } from "../modules/admin/user/UserListModel";
import {
  PosManagementPaymentRoundTable,
  PosManagementPrinter,
  PosManagementReceiptForm
} from "../modules/pos/posmanagement/components";
import PosManagementForm from "../modules/pos/posmanagement/components/PosManagementForm";
import { PosModel } from "../modules/pos/PosModel";
import { PosShiftListModel } from "../modules/pos/PosShiftListModel";
import { PosRequestReceipt } from "../modules/receiptcontrol/components";

interface IPosManagementDetailPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosManagementDetailPage extends React.Component<
  IPosManagementDetailPage
> {
  private userList = UserListModel.create({});
  private orgList = OrgListModel.create({});
  private pos = PosModel.create({});
  private posShiftList = PosShiftListModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "pos"
    });
    const id = this.props.match.params.id;
    this.pos.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.pos.getPosDetail();
      await this.orgList.setField({
        fieldname: "filterName",
        value: this.pos.organization.orgName
      });
      if (this.pos.organizationId) {
        await this.userList.setFieldFilterOrg(
          this.pos.organizationId,
          this.pos.manager.firstname
        );
        await this.userList.load_data_pos();
      }
      await this.posShiftList.load_data(this.pos.id);
      await this.orgList.load_data()
    }
  }
  public componentWillUnmount() {
    this.pos.resetAll();
    this.userList.resetAll();
    this.orgList.resetAll();
    this.posShiftList.resetAll();
  }
  public render() {
    const { t } = this.props;
    return (
      <Container>
        <Loading active={this.pos.loading} />
        <ErrorMessage errorobj={this.pos.error} float={true} timeout={10000} />
        <AlertMessage messageobj={this.pos.alert} float={true} timeout={3000} />
        <Breadcrumb size={"large"}>
          <Link to={"/pos/management"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.posManagementDetailPage.breadcrumb1")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.posManagementDetailPage.breadcrumb2")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <PosManagementForm
          orgList={this.orgList}
          userList={this.userList}
          pos={this.pos}
        />
        {this.pos.id ? (
          <React.Fragment>
            <PermissionControl codes={["POS.RECEIPTCONTROLS.REQUEST"]}>
              <PosRequestReceipt pos={this.pos} />
            </PermissionControl>
            <PermissionControl codes={["POS.EDIT.PRINTERSETTING"]}>
              <PosManagementPrinter pos={this.pos} />
            </PermissionControl>
            <PermissionControl codes={["POS.EDIT.DOCUMENTSEQ"]}>
              <PosManagementReceiptForm pos={this.pos} />
            </PermissionControl>
            <PosManagementPaymentRoundTable
              posId={this.pos.id}
              posShiftList={this.posShiftList}
            />
          </React.Fragment>
        ) : null}
      </Container>
    );
  }
}

export default withRouter(withTranslation()(PosManagementDetailPage));
