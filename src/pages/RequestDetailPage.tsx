import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { RequestTab } from "../modules/loan/request/components";
import { RequestModel } from "../modules/loan/request/RequestModel";

interface IRequestDetailPage extends WithTranslation, RouteComponentProps<any> {
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class RequestDetailPage extends React.Component<IRequestDetailPage> {
  private request = RequestModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
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
        <ErrorMessage errorobj={this.request.error} float timeout={10000} />
        <AlertMessage
          messageobj={this.request.alert}
          float={true}
          timeout={3000}
        />
        <Breadcrumb id="request-detail-page" size={"large"} style={styles.breadcrumb}>
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
              {t("page.requestDetailPage.requestInfo")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <Loading active={this.request!.loading} />
        <RequestTab request={this.request} />
      </React.Fragment>
    );
  }
}

const styles: any = {
  breadcrumb: {
    marginBottom: 14
  }
};

export default withRouter(withTranslation()(RequestDetailPage));
