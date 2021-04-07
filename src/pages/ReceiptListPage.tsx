import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { IReceiptListModel } from "../modules/receipt/ReceiptListModel";
import {
  ReceiptTable,
  SearchForm
} from "../modules/receipt/receiptmanagement/components";

interface IReceiptListPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  receiptListStore?: IReceiptListModel;
}

@inject("appStore", "receiptListStore")
@observer
class ReceiptListPage extends React.Component<IReceiptListPage> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "pos"
    });
    this.props.receiptListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.receiptListStore!.resetAll();
  }

  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <SearchForm receiptListStore={this.props.receiptListStore!} />
        <ErrorMessage
          float
          timeout={5000}
          errorobj={this.props.receiptListStore!.error}
        />
        <Loading active={this.props.receiptListStore!.loading} />
        <ReceiptTable receiptListStore={this.props.receiptListStore!} />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(ReceiptListPage));
