import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Message } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { IAgreementListModel } from "../modules/loan/agreement/AgreementListModel";
import {
  AgreementTable,
  AgreementTableMessage,
  SearchForm
} from "../modules/loan/agreement/components";

interface IAgreementListPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  searchAgreementListStore?: IAgreementListModel;
}

@inject("appStore", "searchAgreementListStore")
@observer
class AgreementListPage extends React.Component<IAgreementListPage> {
  public state = { documentStatusPage: "" };
  public onSearchPage = (isReset?: boolean) => {
    this.setState({
      documentStatusPage: isReset
        ? ""
        : this.props.searchAgreementListStore!.filterStatus
    });
    this.props.history.replace({
      ...this.props.history.location,
      state: {
        documentStatusPage: isReset
          ? ""
          : this.props.searchAgreementListStore!.filterStatus
      }
    });
  };
  public handleDismiss = () => {
    this.props.searchAgreementListStore!.setField({
      fieldname: "isShowMessageAgreementsList",
      value: false
    });
    this.props.searchAgreementListStore!.resetAgreementListMessage();
  };
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loan"
    });
    this.props.searchAgreementListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchAgreementListStore!.resetFilter();
    this.props.searchAgreementListStore!.setField({
      fieldname: "isShowMessageAgreementsList",
      value: false
    });
    this.props.searchAgreementListStore!.resetAgreementListMessage();
  }
  public render() {
    const { searchAgreementListStore, history } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <SearchForm
          agreementListStore={this.props.searchAgreementListStore!}
          onSearchPage={this.onSearchPage}
        />
        <Loading active={this.props.searchAgreementListStore!.loading} />
        <ErrorMessage
          errorobj={this.props.searchAgreementListStore!.error}
          float
          timeout={5000}
        />
        {searchAgreementListStore!.isShowMessageAgreementsList
          ? this.renderSuccessAgreementList()
          : null}
        {searchAgreementListStore!.isShowMessageAgreementsList
          ? this.renderFailedAgreementList()
          : null}
        <AgreementTable
          agreementListStore={this.props.searchAgreementListStore!}
          documentStatusPage={
            history.location.state
              ? history.location.state.documentStatusPage
              : this.state.documentStatusPage
          }
        />
      </Container>
    );
  }
  private renderSuccessAgreementList() {
    const { t } = this.props;
    if (this.props.searchAgreementListStore!.successAgreements.length) {
      return (
        <Message positive onDismiss={this.handleDismiss}>
          <Message.Header>
            {t("page.agreementListPage.transactionsSuccessfully")}
          </Message.Header>
          <AgreementTableMessage
            staus="success"
            agreementList={
              this.props.searchAgreementListStore!.successAgreements
            }
          />
        </Message>
      );
    } else {
      return null;
    }
  }
  private renderFailedAgreementList() {
    const { t } = this.props;
    if (this.props.searchAgreementListStore!.failedAgreements.length === 0) {
      return null;
    } else {
      return (
        <Message negative onDismiss={this.handleDismiss}>
          <Message.Header>
            {t("page.agreementListPage.transactionNotSuccessful")}
          </Message.Header>
          <AgreementTableMessage
            staus="failed"
            agreementList={
              this.props.searchAgreementListStore!.failedAgreements
            }
          />
        </Message>
      );
    }
  }
}

export default withRouter(withTranslation()(AgreementListPage));
