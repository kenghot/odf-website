import * as jquery from "jquery";
import { Provider } from "mobx-react";
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import MainLayout from "./pages/layouts/MainLayout";
import FallBack from "./pages/layouts/partials/FallBack";
import RootStore from "./RootStore";
import { hasPermission } from "./utils/render-by-permission";
import { NoPermissionMessage } from "./components/permission";

Object.assign(global, {
  $: jquery,
  jQuery: jquery,
});

const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const UserManagmentPage = React.lazy(() => import("./pages/UserManagmentPage"));
const UserFormPage = React.lazy(() => import("./pages/UserFormPage"));
const UserDetailPage = React.lazy(() => import("./pages/UserDetailPage"));
const RoleAndPermissionPage = React.lazy(
  () => import("./pages/RoleAndPermissionPage")
);
const OrgManagmentPage = React.lazy(() => import("./pages/OrgManagmentPage"));
const OrgFormPage = React.lazy(() => import("./pages/OrgFormPage"));
const DocRunningControlPage = React.lazy(
  () => import("./pages/DocRunningControlPage")
);
const DocRunningControlFormPage = React.lazy(
  () => import("./pages/DocRunningControlFormPage")
);
const OcupationListPage = React.lazy(() => import("./pages/OcupationListPage"));
const RequestListPage = React.lazy(() => import("./pages/RequestListPage"));
const RequestFormCreatePage = React.lazy(
  () => import("./pages/RequestFormCreatePage")
);
const RequestFormEditPage = React.lazy(
  () => import("./pages/RequestFormEditPage")
);
const RequestDetailPage = React.lazy(() => import("./pages/RequestDetailPage"));
const AgreementListPage = React.lazy(() => import("./pages/AgreementListPage"));
const AgreementFormCreatePage = React.lazy(
  () => import("./pages/AgreementFormCreatePage")
);
const AgreementDetailPage = React.lazy(
  () => import("./pages/AgreementDetailPage")
);
const AgreementFormEditPage = React.lazy(
  () => import("./pages/AgreementFormEditPage")
);

const GuaranteeListPage = React.lazy(() => import("./pages/GuaranteeListPage"));
const GuaranteeFormCreatePage = React.lazy(
  () => import("./pages/GuaranteeFormCreatePage")
);
const GuaranteeFormEditPage = React.lazy(
  () => import("./pages/GuaranteeFormEditPage")
);
const GuaranteeDetailPage = React.lazy(
  () => import("./pages/GuaranteeDetailPage")
);

const AccountReceivableListPage = React.lazy(
  () => import("./pages/AccountReceivableListPage")
);
const AccountReceivableDetailPage = React.lazy(
  () => import("./pages/AccountReceivableDetailPage")
);
const AccountReceivableFormEditPage = React.lazy(
  () => import("./pages/AccountReceivableFormEditPage")
);
const FinancialLoanPaymentPage = React.lazy(
  () => import("./pages/FinancialLoanPaymentPage")
);
const DonationAnalysisPage = React.lazy(
  () => import("./pages/DonationAnalysisPage")
);
const DonationAllowanceListPage = React.lazy(
  () => import("./pages/DonationAllowanceListPage")
);
const DonationDirectPage = React.lazy(
  () => import("./pages/DonationDirectPage")
);
const DonationDirectFormEditPage = React.lazy(
  () => import("./pages/DonationDirectFormEditPage")
);
const DonationAllowanceFormCreatePage = React.lazy(
  () => import("./pages/DonationAllowanceFormCreatePage")
);
const DonationAllowanceFormEditPage = React.lazy(
  () => import("./pages/DonationAllowanceFormEditPage")
);
const DebtCollectionListPage = React.lazy(
  () => import("./pages/DebtCollectionListPage")
);
const DebtCollectionDetailPage = React.lazy(
  () => import("./pages/DebtCollectionDetailPage")
);
const DebtCollectionEditPage = React.lazy(
  () => import("./pages/DebtCollectionEditPage")
);

const AccountReceiveableReportListPage = React.lazy(
  () => import("./pages/AccountReceiveableReportListPage")
);
const ReportCounterServicePage = React.lazy(
  () => import("./pages/ReportCounterServicePage")
);

const ReportKTBPage = React.lazy(() => import("./pages/ReportKTBPage"));

const DebtCollectionReportListPage = React.lazy(
  () => import("./pages/DebtCollectionReportListPage")
);
const DebtRepaymentReportListPage = React.lazy(
  () => import("./pages/DebtRepaymentReportListPage")
);
const DonationReportListPage = React.lazy(
  () => import("./pages/DonationReportListPage")
);

const ReceiptListPage = React.lazy(() => import("./pages/ReceiptListPage"));
const PosListPage = React.lazy(() => import("./pages/PosListPage"));
const PosManagementDetailPage = React.lazy(
  () => import("./pages/PosManagementDetailPage")
);
const PosLoginPage = React.lazy(() => import("./pages/PosLoginPage"));
const PosCashierPage = React.lazy(() => import("./pages/PosCashierPage"));
const ReceiptControlListPage = React.lazy(
  () => import("./pages/ReceiptControlListPage")
);
// const TestPage = React.lazy(() => import("./pages/TestPage"));

require("./../node_modules/semantic-ui-calendar/dist/calendar.min.js");
require("./../node_modules/semantic-ui-calendar/dist/calendar.min.css");
require("./semantic/semantic.ui.popup.js");
require("./semantic/semantic.ui.transition.js");

class App extends Component {
  public render() {
    return (
      <FallBack inverted={true}>
        <Provider {...RootStore}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <MainLayout>
                <Route
                  exact
                  path="/"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <RequestListPage {...props} />,
                      ["REQUEST.ACCESS", "REQUEST.ONLINE.ACCESS"]
                    )
                  }
                />
                {/* /////// User ////// */}
                <Route
                  exact
                  path="/admin/user_managment"
                  render={(props: any) =>
                    this.renderComponent(
                      <UserManagmentPage {...props} />,
                      "USER.ACCESS"
                    )
                  }
                />
                <Route
                  path="/admin/user_managment/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <UserFormPage {...props} />,
                      "USER.CREATE"
                    )
                  }
                />
                <Route
                  path="/admin/user_managment/edit/:id/:name"
                  render={(props: any) =>
                    this.renderComponent(
                      <UserFormPage {...props} />,
                      "USER.EDIT"
                    )
                  }
                />
                <Route
                  path="/admin/user_managment/view/:id/:name"
                  render={(props: any) =>
                    this.renderComponent(
                      <UserDetailPage {...props} />,
                      "USER.VIEW"
                    )
                  }
                />

                {/* /////// Role & Permission ////// */}
                <Route
                  path="/admin/role_permission"
                  render={(props: any) =>
                    this.renderComponent(
                      <RoleAndPermissionPage {...props} />,
                      "ROLE.ACCESS"
                    )
                  }
                />

                {/* /////// Organization ////// */}
                <Route
                  exact
                  path="/admin/org_management"
                  render={(props: any) =>
                    this.renderComponent(
                      <OrgManagmentPage {...props} />,
                      "ORG.ACCESS"
                    )
                  }
                />
                <Route
                  path="/admin/org_management/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <OrgFormPage {...props} />,
                      "ORG.CREATE"
                    )
                  }
                />
                <Route
                  path="/admin/org_management/edit/:id/:name"
                  render={(props: any) =>
                    this.renderComponent(<OrgFormPage {...props} />, "ORG.EDIT")
                  }
                />

                {/* /////// Document Control ////// */}
                <Route
                  exact
                  path="/admin/doc_control"
                  render={(props: any) =>
                    this.renderComponent(
                      <DocRunningControlPage {...props} />,
                      "DOC.ACCESS"
                    )
                  }
                />
                <Route
                  path="/admin/doc_control/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <DocRunningControlFormPage {...props} />,
                      "DOC.CREATE"
                    )
                  }
                />
                <Route
                  path="/admin/doc_control/edit/:id/:sequencetype"
                  render={(props: any) =>
                    this.renderComponent(
                      <DocRunningControlFormPage {...props} />,
                      "DOC.EDIT"
                    )
                  }
                />

                {/* /////// Ocupation List ////// */}
                <Route
                  exact
                  path="/admin/ocupation"
                  render={(props: any) =>
                    this.renderComponent(
                      <OcupationListPage {...props} />,
                      "OCCUPATION.ACCESS"
                    )
                  }
                />

                {/* /////// Request List ////// */}
                <Route
                  exact
                  path="/loan/request"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <RequestListPage {...props} />,
                      ["REQUEST.ACCESS", "REQUEST.ONLINE.ACCESS"]
                    )
                  }
                />
                <Route
                  exact
                  path="/loan/request/create"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <RequestFormCreatePage {...props} />,
                      ["REQUEST.CREATE", "REQUEST.ONLINE.CREATE"]
                    )
                  }
                />
                <Route
                  path="/loan/request/view/:id/:name"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <RequestDetailPage {...props} />,
                      ["REQUEST.VIEW", "REQUEST.ONLINE.VIEW", "DATA.ALL.EDIT"]
                    )
                  }
                />

                <Route
                  path="/loan/request/edit/:id/:name"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <RequestFormEditPage {...props} />,
                      ["REQUEST.EDIT", "REQUEST.ONLINE.EDIT", "DATA.ALL.EDIT"]
                    )
                  }
                />

                {/* /////// Agreement List ////// */}
                <Route
                  exact
                  path="/loan/agreement"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <AgreementListPage {...props} />,
                      ["AGREEMENT.ACCESS"]
                    )
                  }
                />
                <Route
                  path="/loan/agreement/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <AgreementFormCreatePage {...props} />,
                      "AGREEMENT.CREATE"
                    )
                  }
                />

                <Route
                  path="/loan/agreement/view/:id/:name"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <AgreementDetailPage {...props} />,
                      ["AGREEMENT.VIEW", "DATA.ALL.EDIT"]
                    )
                  }
                />
                <Route
                  path="/loan/agreement/edit/:id/:name"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <AgreementFormEditPage {...props} />,
                      ["AGREEMENT.EDIT", "DATA.ALL.EDIT"]
                    )
                  }
                />

                {/* /////// Guarantee List ////// */}
                <Route
                  exact
                  path="/loan/guarantee"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <GuaranteeListPage {...props} />,
                      ["GUANRANTEE.ACCESS"]
                    )
                  }
                />
                <Route
                  path="/loan/guarantee/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <GuaranteeFormCreatePage {...props} />,
                      "GUANRANTEE.CREATE"
                    )
                  }
                />
                <Route
                  path="/loan/guarantee/view/:id"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <GuaranteeDetailPage {...props} />,
                      ["GUANRANTEE.VIEW", "DATA.ALL.EDIT"]
                    )
                  }
                />
                <Route
                  path="/loan/guarantee/edit/:id"
                  render={(props: any) =>
                    this.renderComponentMorePermission(
                      <GuaranteeFormEditPage {...props} />,
                      ["GUANRANTEE.EDIT", "DATA.ALL.EDIT"]
                    )
                  }
                />

                {/* /////// AccountReceivable List ////// */}
                <Route
                  exact
                  path="/account_receivable"
                  render={(props: any) =>
                    this.renderComponent(
                      <AccountReceivableListPage {...props} />,
                      "AR.ACCESS"
                    )
                  }
                />
                <Route
                  path="/account_receivable/view/:id/:name"
                  render={(props: any) =>
                    this.renderComponent(
                      <AccountReceivableDetailPage {...props} />,
                      "AR.VIEW"
                    )
                  }
                />
                <Route
                  path="/account_receivable/edit/:id/:name"
                  render={(props: any) =>
                    this.renderComponent(
                      <AccountReceivableFormEditPage {...props} />,
                      "AR.EDIT"
                    )
                  }
                />

                {/*  Financial */}
                <Route
                  path="/finance/loan_payment"
                  render={(props: any) =>
                    this.renderComponent(
                      <FinancialLoanPaymentPage {...props} />,
                      "VOUCHER.ACCESS"
                    )
                  }
                />
                {/*  Donation */}
                <Route
                  exact
                  path="/donation/allowances"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationAllowanceListPage {...props} />,
                      "DONATE.ALLOWANCE.ACCESS"
                    )
                  }
                />
                <Route
                  path="/donation/allowances/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationAllowanceFormCreatePage {...props} />,
                      "DONATE.ALLOWANCE.ACCESS"
                    )
                  }
                />
                <Route
                  path="/donation/allowances/edit/:id/:name"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationAllowanceFormEditPage {...props} />,
                      "DONATE.ALLOWANCE.ACCESS"
                    )
                  }
                />
                <Route
                  exact
                  path="/donation/directs"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationDirectPage {...props} />,
                      "DONATE.DIRECT.ACCESS"
                    )
                  }
                />
                <Route
                  path="/donation/directs/edit/:id"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationDirectFormEditPage {...props} />,
                      "DONATE.DIRECT.ACCESS"
                    )
                  }
                />
                <Route
                  path="/donation/analysis"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationAnalysisPage {...props} />,
                      "DONATE.ANALYSIS.ACCESS"
                    )
                  }
                />

                {/*  DebtCollection */}
                <Route
                  exact
                  path="/debtCollection"
                  render={(props: any) =>
                    this.renderComponent(
                      <DebtCollectionListPage {...props} />,
                      "DEBTCOLLECTION.ACCESS"
                    )
                  }
                />
                <Route
                  path="/debtCollection/view/:id"
                  render={(props: any) =>
                    this.renderComponent(
                      <DebtCollectionDetailPage {...props} />,
                      "DEBTCOLLECTION.VIEW"
                    )
                  }
                />
                <Route
                  path="/debtCollection/edit/:id"
                  render={(props: any) =>
                    this.renderComponent(
                      <DebtCollectionEditPage {...props} />,
                      "DEBTCOLLECTION.EDIT"
                    )
                  }
                />

                {/*  Reports */}
                <Route
                  path="/reports/accountReceiveable"
                  render={(props: any) =>
                    this.renderComponent(
                      <AccountReceiveableReportListPage {...props} />,
                      "REPORT.AR.ACESS"
                    )
                  }
                />
                <Route
                  path="/reports/counterService"
                  render={(props: any) =>
                    this.renderComponent(
                      <ReportCounterServicePage {...props} />,
                      "REPORT.CS.ACCESS"
                    )
                  }
                />
                <Route
                  path="/reports/ktb"
                  render={(props: any) =>
                    this.renderComponent(
                      <ReportKTBPage {...props} />,
                      "REPORT.KTB.ACCESS"
                    )
                  }
                />
                <Route
                  path="/reports/debt_collection"
                  render={(props: any) =>
                    this.renderComponent(
                      <DebtCollectionReportListPage {...props} />,
                      "REPORT.DEBTCOLLECTION.ACCESS"
                    )
                  }
                />
                <Route
                  path="/reports/debtRepayment"
                  render={(props: any) =>
                    this.renderComponent(
                      <DebtRepaymentReportListPage {...props} />,
                      "REPORT.POS.RECIEPT.ACCESS"
                    )
                  }
                />
                <Route
                  path="/reports/donation"
                  render={(props: any) =>
                    this.renderComponent(
                      <DonationReportListPage {...props} />,
                      "REPORT.DONATE.ACCESS"
                    )
                  }
                />
                {/*  POS */}

                <Route
                  exact
                  path="/pos/receipt_payment"
                  render={(props: any) =>
                    this.renderComponent(
                      <ReceiptListPage {...props} />,
                      "POS.RECEIPTS.ACCESS"
                    )
                  }
                />
                <Route
                  exact
                  path="/pos/management"
                  render={(props: any) =>
                    this.renderComponent(
                      <PosListPage {...props} />,
                      "POS.ACCESS"
                    )
                  }
                />
                <Route
                  exact
                  path="/pos/management/create"
                  render={(props: any) =>
                    this.renderComponent(
                      <PosManagementDetailPage {...props} />,
                      "POS.CREATE"
                    )
                  }
                />
                <Route
                  exact
                  path="/pos/management/edit/:id"
                  render={(props: any) =>
                    this.renderComponent(
                      <PosManagementDetailPage {...props} />,
                      "POS.EDIT"
                    )
                  }
                />
                <Route
                  exact
                  path="/pos/cashier"
                  render={(props: any) =>
                    this.renderComponent(
                      <PosLoginPage {...props} />,
                      "POS.USAGE.ACCESS"
                    )
                  }
                />
                <Route
                  path="/pos/cashier/:id"
                  render={(props: any) =>
                    this.renderComponent(
                      <PosCashierPage {...props} />,
                      "POS.USAGE.ACCESS"
                    )
                  }
                />

                <Route
                  path="/pos/receipt_control"
                  render={(props: any) =>
                    this.renderComponent(
                      <ReceiptControlListPage {...props} />,
                      "POS.RECEIPTCONTROLS.ACCESS"
                    )
                  }
                />

                {/* <Route exact path="/test" component={TestPage} /> */}
              </MainLayout>
            </Switch>
          </BrowserRouter>
        </Provider>
      </FallBack>
    );
  }

  private renderComponent = (component: any, code: string) => {
    if (hasPermission(code)) {
      return component;
    } else {
      return <NoPermissionMessage />;
    }
  };
  private renderComponentMorePermission = (component: any, codes: string[]) => {
    if (codes.some((code: string) => hasPermission(code))) {
      return component;
    } else {
      return <NoPermissionMessage />;
    }
  };
}
export default App;
