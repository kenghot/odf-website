import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { PermissionControl } from "../components/permission";
import {
  SearchForm,
  UploadingKTBVoucher,
  VoucherListTable
} from "../modules/finance/voucher/components";
import { IVoucherListModel } from "../modules/finance/voucher/VoucherListModel";

interface IFinancialLoanPaymentPage extends WithTranslation {
  appStore?: IAppModel;
  searchVoucherListStore?: IVoucherListModel;
}

@inject("appStore", "searchVoucherListStore")
@observer
class FinancialLoanPaymentPage extends React.Component<
  IFinancialLoanPaymentPage
> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "finance"
    });
    await this.props.searchVoucherListStore!.onSeachVoucherList();
  }
  public componentWillUnmount() {
    this.props.searchVoucherListStore!.resetFilter();
  }
  public render() {
    const { searchVoucherListStore } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <SearchForm voucherListStore={searchVoucherListStore!} />
        <VoucherListTable voucherListStore={searchVoucherListStore!} />
        <PermissionControl codes={["VOUCHER.SUBMIT.KTB.RESULT"]}>
          <UploadingKTBVoucher voucherListStore={searchVoucherListStore!} />
        </PermissionControl>
        <Loading active={searchVoucherListStore!.loading} />
        <ErrorMessage
          errorobj={searchVoucherListStore!.error}
          float
          timeout={10000}
        />
        <AlertMessage
          messageobj={searchVoucherListStore!.alert}
          float={true}
          timeout={3000}
        />
      </Container>
    );
  }
}

export default withTranslation()(FinancialLoanPaymentPage);
