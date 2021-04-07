import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { RequestFormTab } from "../modules/loan/request/components";
import { RequestModel } from "../modules/loan/request/RequestModel";

interface IRequestFormEditPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RequestFormEditPage extends React.Component<IRequestFormEditPage> {
  private request = RequestModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "loanNoneTabHeader" });
    const id = this.props.location.state || this.props.match.params.id;
    this.request.setField({ fieldname: "id", value: id });
    this.request.getRequestDetail();
  }
  public componentWillUnmount() {
    this.request.resetAll();
  }
  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Breadcrumb id="request-edit-page" size={"large"} style={styles.breadcrumb}>
          <Link to={"/loan/request"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.requestDetailPage.searchForListRequests")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.requestDetailPage.editRequestInfo")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <RequestFormTab mode="editMode" request={this.request} />
        <Loading active={this.request.loading} />
        <ErrorMessage errorobj={this.request.error} float timeout={10000} />
        <AlertMessage
          messageobj={this.request.alert}
          float={true}
          timeout={3000}
        />
      </React.Fragment>
    );
  }
}
const styles: any = {
  breadcrumb: {
    marginBottom: 14
  }
};
export default withTranslation()(RequestFormEditPage);
