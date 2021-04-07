import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import {
  DonationDirectListTable,
  DonationDirectsSearchForm,
} from "../modules/donation/components";
import { IDonationDirectListModel } from "../modules/donation/DonationDirectListModel";

interface IDonationDirectPage extends WithTranslation {
  appStore?: IAppModel;
  searchDonationDirectListStore?: IDonationDirectListModel;
}

@inject("appStore", "searchDonationDirectListStore")
@observer
class DonationDirectPage extends React.Component<IDonationDirectPage> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "donation",
    });
    await this.props.searchDonationDirectListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchDonationDirectListStore!.resetFilter();
  }
  public render() {
    const { searchDonationDirectListStore } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <DonationDirectsSearchForm
          donationDirectListStore={searchDonationDirectListStore!}
        />
        <DonationDirectListTable
          donationDirectListStore={searchDonationDirectListStore!}
        />
        <Loading active={searchDonationDirectListStore!.loading} />
        <ErrorMessage
          errorobj={searchDonationDirectListStore!.error}
          float
          timeout={10000}
        />
        <AlertMessage
          messageobj={searchDonationDirectListStore!.alert}
          float={true}
          timeout={3000}
        />
      </Container>
    );
  }
}

export default withTranslation()(DonationDirectPage);
