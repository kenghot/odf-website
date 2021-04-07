import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { ILocationModel } from "../../../components/address/LocationModel";
import { AttachedFile } from "../../../components/common";
import { IOrgListModel } from "../../admin/organization/OrgListModel";
import { IDonationAllowanceModel } from "../DonationAllowanceModel";
import DonationFormDonatorInfo from "./DonationFormDonatorInfo";
import DonationInfoFormDetails from "./DonationInfoFormDetails";

interface ISponsorFormBody extends WithTranslation {
  donationAllowance: IDonationAllowanceModel;
  locationStore: ILocationModel;
  orgList: IOrgListModel;
}
@observer
class DonatorFormBody extends React.Component<ISponsorFormBody> {
  public render() {
    const { t, donationAllowance, orgList } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          label={t("module.donation.DonatorFormBody.sponsorInfo")}
          control={DonationFormDonatorInfo}
          idCardItem={donationAllowance.idCard}
          donator={donationAllowance.donator}
        />
        <Form.Field
          label={t("module.donation.DonatorFormBody.donationInfo")}
          width={16}
          control={DonationInfoFormDetails}
          donationAllowance={donationAllowance}
          orgList={orgList}
        />
        <Form.Input
          fluid
          label={t("module.donation.DonatorFormBody.note")}
          placeholder={t("module.donation.DonatorFormBody.placeholderNote")}
          value={donationAllowance.note}
          onChange={(event: any, data: any) =>
            this.onChangeInputField("note", data.value)
          }
        />
        {donationAllowance.id ? (
          <Form.Field
            label={t("module.donation.DonatorFormBody.attachedFile")}
            mode="edit"
            control={AttachedFile}
            multiple={true}
            addFiles={donationAllowance.addFiles}
            removeFile={(index?: number) => this.onRemoveFile(index!)}
            fieldName="donationAllowance.attachedFiles"
            files={donationAllowance.fileList}
          />
        ) : null}
        {this.renderButton()}
      </React.Fragment>
    );
  }
  private renderButton() {
    const { donationAllowance, t } = this.props;
    return (
      <div style={styles.buttonRow}>
        {donationAllowance.id ? (
          <Link to={`/donation/allowances`}>
            <Button color="grey" floated="left" basic>
              {t("module.donation.DonatorFormBody.cancelEditing")}
            </Button>
          </Link>
        ) : null}
        {
          <Button color="blue" floated="right" type="submit">
            {donationAllowance.id
              ? t("module.donation.DonatorFormBody.buttonSubmit")
              : t("module.donation.DonatorFormBody.buttonSubmitCreate")}
          </Button>
        }
      </div>
    );
  }
  private onRemoveFile = async (index: number) => {
    const { donationAllowance } = this.props;
    try {
      await donationAllowance.removeFile(index);
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { donationAllowance } = this.props;
    donationAllowance.setField({ fieldname, value });
  };
}

const styles: any = {
  formButton: {
    marginTop: 23,
  },
  buttom: {
    marginTop: 23,
  },
  buttonRow: {
    paddingTop: 25,
    display: "flow-root",
  },
};

export default withTranslation()(DonatorFormBody);
