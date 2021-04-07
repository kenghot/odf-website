import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import {
  DocumentTable,
  SearchForm
} from "../modules/admin/documentcontrol/components";
import { ISequenceListModel } from "../modules/admin/sequence/SequenceListModel";

interface IDocRunningControlPage extends WithTranslation {
  appStore?: IAppModel;
  searchSequenceListStore?: ISequenceListModel;
}

@inject("appStore", "searchSequenceListStore")
@observer
class DocRunningControlPage extends React.Component<IDocRunningControlPage> {
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    this.props.searchSequenceListStore!.setField({
      fieldname: "filterSequenceType",
      value: "request"
    });
    this.props.searchSequenceListStore!.load_data();
  }
  public componentWillUnmount() {
    this.props.searchSequenceListStore!.resetFilter();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <SearchForm sequenceListStore={this.props.searchSequenceListStore!} />
        <ErrorMessage errorobj={this.props.searchSequenceListStore!.error} />
        <Loading active={this.props.searchSequenceListStore!.loading} />
        <DocumentTable
          sequenceListStore={this.props.searchSequenceListStore!}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(DocRunningControlPage);
