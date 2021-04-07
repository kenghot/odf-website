import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import {
  DonationDirectFormDonatorInfo,
  DonationDirectInfoFormDetails,
} from ".";
import { IOrgListModel } from "../../admin/organization/OrgListModel";
import { IDonationDirectModel } from "../DonationDirectModel";

interface IDonatorDirectFormBody extends WithTranslation {
  donationDirect: IDonationDirectModel;
  orgList: IOrgListModel;
}
@observer
class DonatorDirectFormBody extends React.Component<IDonatorDirectFormBody> {
  public render() {
    const { t, donationDirect, orgList } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          label={t("module.donation.DonatorFormBody.sponsorInfo")}
          control={DonationDirectFormDonatorInfo}
          donationDirect={donationDirect}
        />
        <Form.Field
          label={t("module.donation.DonatorFormBody.donationInfo")}
          width={16}
          control={DonationDirectInfoFormDetails}
          donationDirect={donationDirect}
          orgList={orgList}
        />
        {this.renderButton()}
      </React.Fragment>
    );
  }
  private renderButton() {
    const { donationDirect, t } = this.props;
    return (
      <div style={styles.buttonRow}>
        {donationDirect.id ? (
          <Link to={`/donation/directs`}>
            <Button color="grey" floated="left" basic>
              {t("module.donation.DonatorFormBody.cancelEditing")}
            </Button>
          </Link>
        ) : null}
        {
          <Button color="blue" floated="right" type="submit">
            {donationDirect.id
              ? t("module.donation.DonatorFormBody.buttonSubmit")
              : t("module.donation.DonatorFormBody.buttonSubmitCreate")}
          </Button>
        }
      </div>
    );
  }
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

export default withTranslation()(DonatorDirectFormBody);
