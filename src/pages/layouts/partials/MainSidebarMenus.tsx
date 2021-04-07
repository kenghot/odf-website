import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Grid, Header, Icon, Image, Menu } from "semantic-ui-react";
import { IMAGES } from "../../../constants";
import { hasPermission } from "../../../utils/render-by-permission";
import GroupSideMenu from "./GroupSideMenu";
import LoanShortCutMenu from "./LoanShortCutMenu";
import SideMenu from "./SideMenu";

const { odf_logo } = IMAGES;
const { garuda_logo } = IMAGES;
const { odf_w_text_logo } = IMAGES;
interface IMainSidebarMenus extends RouteComponentProps<any>, WithTranslation {
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
}
class MainSidebarMenus extends React.Component<IMainSidebarMenus, any> {
  public state = { selected: "/UserManagment" };
  public componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  public render() {
    const { expanded, t } = this.props;
    return (
      <React.Fragment>
        <Menu vertical fluid style={styles.menu} inverted>
          <Menu.Item name="toggle" link as="div" onClick={this.onToggle}>
            <Grid columns="equal">
              <Grid.Row verticalAlign="middle">
                <Grid.Column>
                  <Header
                    size="medium"
                    style={styles.toggleHeaderStyle}
                    floated="left"
                    inverted
                  >
                    <Image
                      id="image-odf_txt-logo"
                      src={odf_w_text_logo}
                      alt="odf txt logo"
                      style={{ height: 0, width: 0 }}
                    />
                    <Image
                      id="image-garuda-logo"
                      src={garuda_logo}
                      alt="garuda logo"
                      style={{ height: 0, width: 0 }}
                    />
                    <Image
                      id="image-odf-logo"
                      src={odf_logo}
                      alt="odf logo"
                      size="small"
                    />
                    {expanded ? (
                      <Header.Content>{t("olderFund")}</Header.Content>
                    ) : null}
                  </Header>
                </Grid.Column>
                {expanded ? (
                  <Grid.Column floated="right" textAlign="right" width={3}>
                    <Icon
                      name={"chevron left"}
                      style={styles.iconToggleStyle}
                      inverted
                    />
                  </Grid.Column>
                ) : null}
              </Grid.Row>
            </Grid>
          </Menu.Item>
          <GroupSideMenu
            groupName={"loan"}
            title={t("component.sidebar.loanSystem")}
            iconName="address card"
            hasPermission={[
              hasPermission("REQUEST.ACCESS"),
              hasPermission("AGREEMENT.ACCESS"),
              hasPermission("GUANRANTEE.ACCESS"),
            ].includes(true)}
            expanded={expanded}
            groupPathname="/loan/request"
            id="btn-group_loan_request"
          >
            <SideMenu
              id="btn-loan-request"
              name={"loan"}
              pathname="/loan/request"
              title={t("component.sidebar.loanRequest")}
              expanded={expanded}
              hasPermission={[hasPermission("REQUEST.ACCESS")].includes(true)}
            />
            <SideMenu
              id="btn-loan-agreement"
              name={"loan"}
              pathname="/loan/agreement"
              title={t("component.sidebar.loanContractWork")}
              expanded={expanded}
              hasPermission={[hasPermission("AGREEMENT.ACCESS")].includes(true)}
            />
            <SideMenu
              id="btn-loan-guarantee"
              name={"loan"}
              pathname="/loan/guarantee"
              title={t("component.sidebar.loanGuaranteeContractWork")}
              expanded={expanded}
              hasPermission={[hasPermission("GUANRANTEE.ACCESS")].includes(
                true
              )}
            />
            <LoanShortCutMenu expanded={expanded} />
          </GroupSideMenu>
          <SideMenu
            id="btn-account-receivable"
            name="accountReceivable"
            pathname="/account_receivable"
            title={t("component.sidebar.accountsReceivableSystem")}
            expanded={expanded}
            iconName="users"
            hasPermission={hasPermission("AR.ACCESS")}
          />
          <SideMenu
            id="btn-debt-collection"
            name="debtCollection"
            pathname="/debtCollection"
            title={t("component.sidebar.loanTrackingSystem")}
            expanded={expanded}
            iconName="crosshairs"
            hasPermission={hasPermission("DEBTCOLLECTION.ACCESS")}
          />
          <GroupSideMenu
            id="btn-group-pos-list"
            groupName={"pos"}
            title={t("component.sidebar.paymentSystem")}
            iconName="money bill alternate outline"
            hasPermission={true}
            expanded={expanded}
            groupPathname="/pos/management"
          >
            <SideMenu
              id="btn-pos-cashier"
              name="pos"
              pathname="/pos/cashier"
              title={t("component.sidebar.accessPointOfPayment")}
              expanded={expanded}
              hasPermission={hasPermission("POS.USAGE.ACCESS")}
            />
            <SideMenu
              id="btn-pos-list"
              name="pos"
              pathname="/pos/management"
              title={t("component.sidebar.paymentPoint")}
              expanded={expanded}
              hasPermission={hasPermission("POS.ACCESS")}
            />
            <SideMenu
              id="btn-pos-receipt"
              name="pos"
              pathname="/pos/receipt_payment"
              title={t("component.sidebar.paymentTransaction")}
              expanded={expanded}
              hasPermission={hasPermission("POS.RECEIPTS.ACCESS")}
            />
            <SideMenu
              id="btn-pos-receipt-control"
              name="pos"
              pathname="/pos/receipt_control"
              title={t("component.sidebar.receiptControl")}
              expanded={expanded}
              hasPermission={hasPermission("POS.RECEIPTCONTROLS.ACCESS")}
            />
          </GroupSideMenu>
          <GroupSideMenu
            id="btn-group-finance-loan-payment"
            groupName={"finance"}
            title={t("component.sidebar.financialSystem")}
            iconName="dollar sign"
            hasPermission={true}
            expanded={expanded}
            groupPathname="/finance/loan_payment"
          >
            <SideMenu
              id="btn-finance-loan-payment"
              name="finance"
              pathname="/finance/loan_payment"
              title={t("component.sidebar.loanPaymentSystem")}
              expanded={expanded}
              hasPermission={hasPermission("VOUCHER.ACCESS")}
            />
          </GroupSideMenu>
          <GroupSideMenu
            id="btn-group-donation-system"
            groupName={"donation"}
            title={t("component.sidebar.donationSystem")}
            iconName="money bill alternate"
            hasPermission={hasPermission("DONATE.ACCESS")}
            expanded={expanded}
            groupPathname="/donation/allowances"
          >
            <SideMenu
              id="btn-donation-elderly-living"
              name="donation"
              pathname="/donation/allowances"
              title={t("component.sidebar.elderlyLivingAllowanceDonation")}
              expanded={expanded}
              hasPermission={hasPermission("DONATE.ALLOWANCE.ACCESS")}
            />
            <SideMenu
              id="btn-donation-older-fund"
              name="donation"
              pathname="/donation/directs"
              title={t("component.sidebar.donateMoneyToFund")}
              expanded={expanded}
              hasPermission={hasPermission("DONATE.DIRECT.ACCESS")}
            />
            <SideMenu
              id="btn-donation-analysis"
              name="donation"
              pathname="/donation/analysis"
              title={t("component.sidebar.dataAnalysis")}
              expanded={expanded}
              hasPermission={hasPermission("DONATE.ANALYSIS.ACCESS")}
            />
          </GroupSideMenu>
          <GroupSideMenu
            id="reports"
            groupName={"reports"}
            title={t("component.sidebar.reportSystem")}
            iconName="file alternate outline"
            expanded={expanded}
            groupPathname="/reports/accountReceiveable"
            hasPermission={true}
          >
            <SideMenu
              id="reports"
              name="reports"
              pathname="/reports/accountReceiveable"
              title={t("component.sidebar.accountReceiveable")}
              expanded={expanded}
              hasPermission={hasPermission("REPORT.AR.ACESS")}
            />
            <SideMenu
              id="reports"
              name="reports"
              pathname="/reports/counterService"
              title={t("component.sidebar.counterService")}
              expanded={expanded}
              hasPermission={hasPermission("REPORT.CS.ACCESS")}
            />
            <SideMenu
              id="reports"
              name="reports"
              pathname="/reports/ktb"
              title={t("component.sidebar.ktbReport")}
              expanded={expanded}
              hasPermission={hasPermission("REPORT.KTB.ACCESS")}
            />
            <SideMenu
              id="reports"
              name="reports"
              pathname="/reports/debt_collection"
              title={t("component.sidebar.debtCollectionReport")}
              expanded={expanded}
              hasPermission={hasPermission("REPORT.DEBTCOLLECTION.ACCESS")}
            />
            <SideMenu
              id="reports"
              name="reports"
              pathname="/reports/debtRepayment"
              title={t("component.sidebar.debtRepaymentReport")}
              expanded={expanded}
              hasPermission={hasPermission("REPORT.POS.RECIEPT.ACCESS")}
            />
            <SideMenu
              id="reports"
              name="reports"
              pathname="/reports/donation"
              title={t("component.sidebar.donationReport")}
              expanded={expanded}
              hasPermission={hasPermission("REPORT.DONATE.ACCESS")}
            />
          </GroupSideMenu>
          <GroupSideMenu
            id="btn-group-admin-user-managment"
            groupName={"admin"}
            title={t("component.sidebar.managementSystem")}
            iconName="settings"
            hasPermission={true}
            expanded={expanded}
            groupPathname="/admin/user_managment"
          >
            <SideMenu
              id="btn-admin-user-managment"
              name="admin"
              pathname="/admin/user_managment"
              title={t("component.sidebar.user")}
              expanded={expanded}
              hasPermission={hasPermission("USER.ACCESS")}
            />
            <SideMenu
              id="btn-admin-role-permission"
              name="admin"
              pathname="/admin/role_permission"
              title={t("component.sidebar.userGroupsAndLicenses")}
              expanded={expanded}
              hasPermission={hasPermission("ROLE.ACCESS")}
            />
            <SideMenu
              id="btn-admin-org-management"
              name="admin"
              pathname="/admin/org_management"
              title={t("component.sidebar.agencyAuthorizedPerson")}
              expanded={expanded}
              hasPermission={hasPermission("ORG.ACCESS")}
            />
            <SideMenu
              id="btn-admin-doc-control"
              name="admin"
              pathname="/admin/doc_control"
              title={t("component.sidebar.documentNumberManagement")}
              expanded={expanded}
              hasPermission={hasPermission("DOC.ACCESS")}
            />
            <SideMenu
              id="btn-admin-ocupation"
              name="admin"
              pathname="/admin/ocupation"
              title={t("component.sidebar.occupation")}
              expanded={expanded}
              hasPermission={hasPermission("OCCUPATION.ACCESS")}
            />
          </GroupSideMenu>
        </Menu>
      </React.Fragment>
    );
  }

  private onToggle = async () => {
    this.props.onToggle(!this.props.expanded);
  };
}
const styles: any = {
  menu: { borderRadius: 0 },
  toggleHeaderStyle: {
    lineHeight: "inherit",
    margin: 0,
  },
  iconToggleStyle: {
    verticalAlign: "middle",
  },
};
export default withRouter(withTranslation()(MainSidebarMenus));
