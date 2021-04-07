import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { AccountReceivableModel } from "../modules/accountReceivable/AccountReceivableModel";
import { AccountReceivableDetail } from "../modules/accountReceivable/components";

interface IAccountReceivableDetailPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AccountReceivableDetailPage extends React.Component<
  IAccountReceivableDetailPage
> {
  private accountReceivable = AccountReceivableModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "accountReceivable"
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.accountReceivable.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.accountReceivable.getAccountReceivableDetail();
    }
  }
  public async componentDidUpdate(prevProps: any) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.location.state || this.props.match.params.id;
      this.accountReceivable.setField({ fieldname: "id", value: id || "" });
      if (id) {
        await this.accountReceivable.getAccountReceivableDetail();
      }
    }
  }
  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Loading active={this.accountReceivable.loading} />
        <ErrorMessage
          errorobj={this.accountReceivable.error}
          float={true}
          timeout={10000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/account_receivable"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t(
                  "page.accountReceivableDetailPage.searchForAccountsReceivable"
                )}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.accountReceivableDetailPage.accountsReceivableInfo")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <AccountReceivableDetail accountReceivable={this.accountReceivable} />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(AccountReceivableDetailPage));
