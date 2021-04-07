import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { DonationnDirectHeader, DonatorDirectFormBody } from ".";
import { IOrgListModel } from "../../admin/organization/OrgListModel";
import { IDonationDirectModel } from "../DonationDirectModel";

interface IDonationDirectFormEdit extends WithTranslation {
  donationDirect: IDonationDirectModel;
  orgList: IOrgListModel;
}
@observer
class DonationDirectFormEdit extends React.Component<IDonationDirectFormEdit> {
  public render() {
    const { donationDirect, orgList } = this.props;
    return (
      <Segment padded="very">
        <DonationnDirectHeader donationDirect={donationDirect} />
        <Form onSubmit={this.updateForm}>
          <DonatorDirectFormBody
            orgList={orgList}
            donationDirect={donationDirect}
          />
        </Form>
      </Segment>
    );
  }

  private updateForm = async () => {
    const { donationDirect } = this.props;
    try {
      await donationDirect.updateDonationDirect();
    } catch (e) {
      console.log(e);
    }
  };
}

export default withTranslation()(DonationDirectFormEdit);
