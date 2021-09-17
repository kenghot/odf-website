import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Header, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { ILocationModel } from "../../../components/address/LocationModel";
import { IOrgListModel } from "../../admin/organization/OrgListModel";
import { IAuthModel } from "../../auth/AuthModel";
import { IDonationAllowanceModel } from "../DonationAllowanceModel";
import DonatorFormBody from "./DonatorFormBody";

interface IDonationAllowanceFormCreate
  extends WithTranslation,
  RouteComponentProps {
  locationStore: ILocationModel;
  orgList: IOrgListModel;
  donationAllowance: IDonationAllowanceModel;
  appStore?: IAppModel;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class DonationAllowanceFormCreate extends React.Component<IDonationAllowanceFormCreate> {
  public render() {
    const { t, donationAllowance, locationStore, orgList } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.donation.DonationAllowanceFormCreate.header")}
          style={styles.header}
        />
        <Form onSubmit={this.createForm}>
          <DonatorFormBody
            orgList={orgList}
            donationAllowance={donationAllowance}
            locationStore={locationStore}
          />
        </Form>
      </Segment>
    );
  }

  private createForm = async () => {
    const { donationAllowance, history } = this.props;
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
      await donationAllowance.createDonationAllowance();

      if (donationAllowance.id) {
        history.push(
          `/donation/allowances/edit/${donationAllowance.id}/${donationAllowance.posId || ""
          }`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28,
  },
  buttom: {
    marginTop: 23,
  },
};

export default withRouter(withTranslation()(DonationAllowanceFormCreate));
