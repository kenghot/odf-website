import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { IPosListModel } from "../modules/pos/PosListModel";
import { PosTable, SearchForm } from "../modules/pos/posmanagement/components";

interface IPosListPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  posListStore?: IPosListModel;
}

@inject("appStore", "posListStore")
@observer
class PosListPage extends React.Component<IPosListPage> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "pos"
    });
    this.props.posListStore!.load_data();
  }
  public componentWillUnmount() {
    this.props.posListStore!.resetAll();
  }

  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <SearchForm posListStore={this.props.posListStore!} />
        <ErrorMessage
          float
          timeout={5000}
          errorobj={this.props.posListStore!.error}
        />
        <Loading active={this.props.posListStore!.loading} />
        <PosTable posListStore={this.props.posListStore!} />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(PosListPage));
