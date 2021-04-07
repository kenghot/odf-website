import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import {
  DonationAllowancesSearchForm,
  DonationAllowanceListTable,
} from "../modules/donation/components";
import { IDonationAllowanceListModel } from "../modules/donation/DonationAllowanceListModel";

interface IDonationAllowanceListPage extends WithTranslation {
  appStore?: IAppModel;
  searchDonationAllowanceListStore?: IDonationAllowanceListModel;
}

@inject("appStore", "searchDonationAllowanceListStore")
@observer
class DonationAllowanceListPage extends React.Component<IDonationAllowanceListPage> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "donation",
    });
    await this.props.searchDonationAllowanceListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchDonationAllowanceListStore!.resetFilter();
  }
  public render() {
    const { searchDonationAllowanceListStore } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <DonationAllowancesSearchForm
          donationAllowanceListStore={searchDonationAllowanceListStore!}
        />
        <DonationAllowanceListTable
          donationAllowanceListStore={searchDonationAllowanceListStore!}
        />
        <Loading active={searchDonationAllowanceListStore!.loading} />
        <ErrorMessage
          errorobj={searchDonationAllowanceListStore!.error}
          float
          timeout={10000}
        />
        <AlertMessage
          messageobj={searchDonationAllowanceListStore!.alert}
          float={true}
          timeout={3000}
        />
      </Container>
    );
  }
}

export default withTranslation()(DonationAllowanceListPage);
