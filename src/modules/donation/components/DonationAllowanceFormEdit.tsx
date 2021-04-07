import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { DonationnAllowanceHeader, DonatorFormBody } from ".";
import { ILocationModel } from "../../../components/address/LocationModel";
import { IOrgListModel } from "../../admin/organization/OrgListModel";
import { IDonationAllowanceModel } from "../DonationAllowanceModel";

interface IDonationAllowanceFormEdit extends WithTranslation {
  donationAllowance: IDonationAllowanceModel;
  locationStore: ILocationModel;
  orgList: IOrgListModel;
}
@observer
class DonationAllowanceFormEdit extends React.Component<IDonationAllowanceFormEdit> {
  public render() {
    const { donationAllowance, locationStore, orgList } = this.props;
    return (
      <Segment padded="very">
        <DonationnAllowanceHeader
          donationAllowance={donationAllowance}
          disableEditBtn
        />
        <Form onSubmit={this.updateForm}>
          <DonatorFormBody
            orgList={orgList}
            locationStore={locationStore}
            donationAllowance={donationAllowance}
          />
        </Form>
      </Segment>
    );
  }

  private updateForm = async () => {
    const { donationAllowance } = this.props;
    try {
      if (!donationAllowance.organization.id) {
        const errorMessage = {
          code: "",
          name: "",
          message: "กรุณาระบุหน่วยงานที่นำเข้าข้อมูล",
          technical_stack: "",
        };
        donationAllowance.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      await donationAllowance.updateDonationAllowance();
    } catch (e) {
      console.log(e);
    }
  };
}

export default withTranslation()(DonationAllowanceFormEdit);
