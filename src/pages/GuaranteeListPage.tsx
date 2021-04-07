import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import {
  GuaranteeTable,
  SearchForm
} from "../modules/loan/guarantee/components";
import { IGuaranteeListModel } from "../modules/loan/guarantee/GuaranteeListModel";

interface IGuaranteeListPage extends WithTranslation {
  appStore?: IAppModel;
  searchGuaranteeListStore?: IGuaranteeListModel;
}

@inject("appStore", "searchGuaranteeListStore")
@observer
class GuaranteeListPage extends React.Component<IGuaranteeListPage> {
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loan"
    });
    this.props.searchGuaranteeListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchGuaranteeListStore!.resetFilter();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <SearchForm guaranteeListStore={this.props.searchGuaranteeListStore!} />
        <Loading active={this.props.searchGuaranteeListStore!.loading} />
        <ErrorMessage
          errorobj={this.props.searchGuaranteeListStore!.error}
          float
          timeout={5000}
        />
        <GuaranteeTable
          guaranteeListStore={this.props.searchGuaranteeListStore!}
        />
      </Container>
    );
  }
}

export default withTranslation()(GuaranteeListPage);
