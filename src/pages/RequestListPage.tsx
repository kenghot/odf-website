import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Message } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { RequestTable } from "../modules/loan/request/components";
import RequestTableMessage from "../modules/loan/request/components/RequestTableMessage";
import SearchForm from "../modules/loan/request/components/SearchForm";
import { IRequestListModel } from "../modules/loan/request/RequestListModel";

interface IRequestListPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  searchRequestListStore?: IRequestListModel;
}

@inject("appStore", "searchRequestListStore")
@observer
class RequestListPage extends React.Component<IRequestListPage> {
  public state = { documentStatusPage: "" };
  public onSearchPage = (isReset?: boolean) => {
    this.setState({
      documentStatusPage: isReset
        ? ""
        : this.props.searchRequestListStore!.filterStatus
    });
    this.props.history.replace({
      ...this.props.history.location,
      state: {
        documentStatusPage: isReset
          ? ""
          : this.props.searchRequestListStore!.filterStatus
      }
    });
  };
  public handleDismiss = () => {
    this.props.searchRequestListStore!.setField({
      fieldname: "isShowMessageRequestsList",
      value: false
    });
    this.props.searchRequestListStore!.resetRequestsListMessage();
  };

  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "loan" });
    this.props.searchRequestListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchRequestListStore!.resetFilter();
    this.props.searchRequestListStore!.setField({
      fieldname: "isShowMessageRequestsList",
      value: false
    });
    this.props.searchRequestListStore!.resetRequestsListMessage();
  }
  public render() {
    const { searchRequestListStore, history } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <SearchForm
          requestlistStore={this.props.searchRequestListStore!}
          onSearchPage={this.onSearchPage}
        />
        <Loading active={this.props.searchRequestListStore!.loading} />
        <ErrorMessage
          errorobj={this.props.searchRequestListStore!.error}
          float
          timeout={10000}
        />
        {searchRequestListStore!.isShowMessageRequestsList
          ? this.renderSuccessRequestList()
          : null}
        {searchRequestListStore!.isShowMessageRequestsList
          ? this.renderFailedRequestList()
          : null}
        <RequestTable
          requestlistStore={this.props.searchRequestListStore!}
          documentStatusPage={
            history.location.state
              ? history.location.state.documentStatusPage
              : this.state.documentStatusPage
          }
        />
      </Container>
    );
  }
  private renderSuccessRequestList() {
    const { t } = this.props;
    if (this.props.searchRequestListStore!.successRequests.length) {
      return (
        <Message positive onDismiss={this.handleDismiss}>
          <Message.Header>
            {t("page.requestListPage.listOfSuccessfully")}
          </Message.Header>
          <RequestTableMessage
            staus="success"
            requestList={this.props.searchRequestListStore!.successRequests}
          />
        </Message>
      );
    } else {
      return null;
    }
  }
  private renderFailedRequestList() {
    const { t } = this.props;
    if (this.props.searchRequestListStore!.failedRequests.length === 0) {
      return null;
    } else {
      return (
        <Message negative onDismiss={this.handleDismiss}>
          <Message.Header>
            {t("page.requestListPage.listOfUnsuccessful")}
          </Message.Header>
          <RequestTableMessage
            staus="failed"
            requestList={this.props.searchRequestListStore!.failedRequests}
          />
        </Message>
      );
    }
  }
}

export default withRouter(withTranslation()(RequestListPage));
