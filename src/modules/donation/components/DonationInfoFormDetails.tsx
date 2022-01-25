import { observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { CurrencyInput, DateInput } from "../../../components/common/input";
import { OrganizationDDL } from "../../admin/organization/components";
import {
  IOrgListModel,
  OrgListModel,
} from "../../admin/organization/OrgListModel";
import { IDonationAllowanceModel } from "../DonationAllowanceModel";

interface IDonationInfoFormDetails extends WithTranslation {
  donationAllowance: IDonationAllowanceModel;
  orgList: IOrgListModel;
}

@observer
class DonationInfoFormDetails extends React.Component<IDonationInfoFormDetails> {
  private orgList = OrgListModel.create({});
  public render() {
    const { t, donationAllowance } = this.props;
    return (
      <Segment padded>
        <Form.Field
          required
          label={"หน่วยงานที่นำเข้าข้อมูล"}
          placeholder={"กรุณาเลือกหน่วยงานที่นำเข้าข้อมูล"}
          control={OrganizationDDL}
          value={donationAllowance.organization.id}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
        <Form.Input
          fluid
          label={t("module.donation.DonationInfoFormDetails.orgNameLabel")}
          placeholder={t(
            "module.donation.DonationInfoFormDetails.orgNamePlaceholder"
          )}
          onChange={(event: any, data: any) =>
            donationAllowance.setField({
              fieldname: "receiptOrganization",
              value: data.value,
            })
          }
          value={donationAllowance.receiptOrganization}
        />
        <Form.Field
          required
          label={t("module.donation.DonationInfoFormDetails.donationDate")}
          control={DateInput}
          value={donationAllowance.donationDate || undefined}
          fieldName="donationDate"
          id={"donationDate"}
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          required
          label={t("module.donation.DonationInfoFormDetails.createdDate")}
          control={DateInput}
          value={donationAllowance.receiptDate || undefined}
          fieldName="receiptDate"
          id={"receiptDate"}
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          required
          label={t("module.donation.DonationInfoFormDetails.paidAmount")}
          fluid
          control={CurrencyInput}
          id={"input-donation-paidAmount"}
          labelText={t("module.loan.guaranteeBorrowDetails.baht")}
          value={donationAllowance.paidAmount}
          fieldName="paidAmount"
          onChangeInputField={this.onChangeInputField}
        />
      </Segment>
    );
  }
  private onChangeOrganizationDDL = (value: string) => {
    const { donationAllowance } = this.props;
    if (value) {
      const found = this.orgList.list.find((element) => element.id === value);
      if (found) {
        donationAllowance.setField({
          fieldname: "organization",
          value: clone(found),
        });
      } else {
        donationAllowance.organization.resetAll();
      }
    } else {
      donationAllowance.organization.resetAll();
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { donationAllowance } = this.props;
    donationAllowance.setField({ fieldname, value });
  };
}
export default withTranslation()(DonationInfoFormDetails);
