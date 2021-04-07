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
import { IDonationDirectModel } from "../DonationDirectModel";

interface IDonationDirectInfoFormDetails extends WithTranslation {
  donationDirect: IDonationDirectModel;
  orgList: IOrgListModel;
}

@observer
class DonationDirectInfoFormDetails extends React.Component<IDonationDirectInfoFormDetails> {
  private orgList = OrgListModel.create({});
  public render() {
    const { t, donationDirect } = this.props;
    return (
      <Segment padded>
        <Form.Input
          fluid
          label={"โครงการที่บริจาค"}
          placeholder={"กรุณาระบุชื่อโครงการที่บริจาค"}
          value={donationDirect.name}
          onChange={(event: any, data: any) =>
            this.onChangeInputField("name", data.value)
          }
        />
        <Form.Field
          label={"วันที่แจ้งความประสงค์บริจาค"}
          control={DateInput}
          value={donationDirect.donationDate || undefined}
          fieldName="donationDate"
          id={"donationDate"}
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          label={"วันที่หน่วยงานรับเงินบริจาค"}
          control={DateInput}
          value={donationDirect.receiptDate || undefined}
          fieldName="receiptDate"
          id={"receiptDate"}
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          label={t("module.donation.DonationInfoFormDetails.paidAmount")}
          fluid
          control={CurrencyInput}
          id={"input-donation-paidAmount"}
          labelText={t("module.loan.guaranteeBorrowDetails.baht")}
          value={donationDirect.paidAmount}
          fieldName="paidAmount"
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Input
          fluid
          label={t("module.donation.DonatorFormBody.note")}
          placeholder={t("module.donation.DonatorFormBody.placeholderNote")}
          value={donationDirect.note}
          onChange={(event: any, data: any) =>
            this.onChangeInputField("note", data.value)
          }
        />
      </Segment>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { donationDirect } = this.props;
    donationDirect.setField({ fieldname, value });
  };
}
export default withTranslation()(DonationDirectInfoFormDetails);
