import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { RequestFormTab } from "../modules/loan/request/components";
import { IRequestModel } from "../modules/loan/request/RequestModel";

interface IRequestFormCreatePage extends WithTranslation {
  appStore?: IAppModel;
  requestCreate: IRequestModel;
}

@inject("appStore", "requestCreate")
@observer
class RequestFormCreatePage extends React.Component<IRequestFormCreatePage> {
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "loanNoneTabHeader" });
  }
  public componentWillUnmount() {
    this.props.requestCreate.resetAll();
  }
  public render() {
    const { requestCreate, t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Breadcrumb id="request-create-page" size={"large"} style={styles.breadcrumb}>
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
              {t("page.requestDetailPage.createRequestForm")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <RequestFormTab mode="createMode" request={requestCreate} />
        <Loading active={requestCreate!.loading} />
        <ErrorMessage errorobj={requestCreate.error} float timeout={10000} />
        <AlertMessage
          messageobj={requestCreate.alert}
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

export default withTranslation()(RequestFormCreatePage);
