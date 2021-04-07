import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Segment, Tab } from "semantic-ui-react";
import {
  AccountReceivableAcknowledgementEdit,
  AccountReceivableAcknowledgementView,
  AccountReceivableBorrowerInfo,
  AccountReceivableGuarantorInfo,
  AccountReceivableLoanEdit,
  AccountReceivableLoanView
} from ".";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IAccountReceivableBorrowerGuarantorInfo extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  editMode?: boolean;
  activeIndexTab?: number;
}

@observer
class AccountReceivableBorrowerGuarantorInfo extends React.Component<
  IAccountReceivableBorrowerGuarantorInfo
> {
  public state = {
    activeIndex: 0
  };
  public componentDidMount() {
    const { activeIndexTab } = this.props;
    if (activeIndexTab) {
      this.setState({ activeIndex: activeIndexTab });
    }
  }

  public handleTabChange = (e: any, data: any) =>
    this.setState({ activeIndex: data.activeIndex });

  public render() {
    const { activeIndex } = this.state;
    const { accountReceivable } = this.props;
    const idRenender = accountReceivable.id;
    const subDistrictRenenderB =
      accountReceivable.borrowerContactAddress.subDistrict;
    const districtRenenderB = accountReceivable.borrowerContactAddress.district;
    const provinceRenenderB = accountReceivable.borrowerContactAddress.province;

    const subDistrictRenenderG =
      accountReceivable.guarantorContactAddress.subDistrict;
    const districtRenenderG =
      accountReceivable.guarantorContactAddress.district;
    const provinceRenenderG =
      accountReceivable.guarantorContactAddress.province;

    return (
      <Tab
        panes={this.getPanes()}
        activeIndex={activeIndex}
        onTabChange={this.handleTabChange}
        menu={{
          tabular: true,
          attached: true,
          fluid: true,
          widths: accountReceivable.debtAcknowledgement.isAcknowledge ? 4 : 3
        }}
      />
    );
  }

  private getPanes = () => {
    const { editMode, t, accountReceivable } = this.props;
    const panes = [];
    if (accountReceivable.debtAcknowledgement.isAcknowledge) {
      panes.push({
        menuItem: t("module.loan.agreementDetail.debt"),
        render: () => (
          <Tab.Pane>
            <Segment padded basic>
              {editMode ? (
                <AccountReceivableAcknowledgementEdit
                  debtAcknowledgement={accountReceivable.debtAcknowledgement}
                  accountReceivable={accountReceivable}
                />
              ) : (
                <AccountReceivableAcknowledgementView
                  debtAcknowledgement={accountReceivable.debtAcknowledgement}
                />
              )}
            </Segment>
          </Tab.Pane>
        )
      });
    }
    panes.push({
      menuItem: t(
        "module.accountReceivable.accountReceivableDetail.receivables"
      ),
      render: () => (
        <Tab.Pane>
          <AccountReceivableBorrowerInfo
            accountReceivable={accountReceivable}
            id={accountReceivable.id}
            subDistrict={accountReceivable.borrowerContactAddress.subDistrict}
            district={accountReceivable.borrowerContactAddress.district}
            province={accountReceivable.borrowerContactAddress.province}
            editMode={editMode}
          />
        </Tab.Pane>
      )
    });
    panes.push({
      menuItem: t(
        "module.accountReceivable.accountReceivableDetail.guarantorInformation"
      ),
      render: () => (
        <Tab.Pane>
          <AccountReceivableGuarantorInfo
            accountReceivable={accountReceivable}
            id={accountReceivable.id}
            subDistrict={accountReceivable.guarantorContactAddress.subDistrict}
            district={accountReceivable.guarantorContactAddress.district}
            province={accountReceivable.guarantorContactAddress.province}
            editMode={editMode}
          />
        </Tab.Pane>
      )
    });
    panes.push({
      menuItem: t(
        "module.accountReceivable.accountReceivableDetail.contractualLoanInfo"
      ),
      render: () => (
        <Tab.Pane>
          <Segment padded basic>
            {editMode ? (
              <AccountReceivableLoanEdit
                accountReceivable={accountReceivable}
              />
            ) : (
              <AccountReceivableLoanView
                accountReceivable={accountReceivable}
              />
            )}
          </Segment>
        </Tab.Pane>
      )
    });
    return panes;
  };
}

export default withTranslation()(AccountReceivableBorrowerGuarantorInfo);
