import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { LocationModel } from "../components/address";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import { GuaranteeFormCreate } from "../modules/loan/guarantee/components";
import { GuaranteeModel } from "../modules/loan/guarantee/GuaranteeModel";
import { RequestListModel } from "../modules/loan/request/RequestListModel";
import { RequestModel } from "../modules/loan/request/RequestModel";

interface IGuaranteeFormCreatePage
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class GuaranteeFormCreatePage extends React.Component<
  IGuaranteeFormCreatePage
> {
  private guarantee = GuaranteeModel.create({});
  public requestList = RequestListModel.create({});
  public request = RequestModel.create({});
  public orgList = OrgListModel.create({});
  public locationStore = LocationModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
    this.guarantee.setGuaranteeItems();
  }

  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Loading active={this.guarantee.loading} />
        <ErrorMessage
          errorobj={this.guarantee.error}
          float={true}
          timeout={10000}
        />
        <AlertMessage
          messageobj={this.guarantee.alert}
          float={true}
          timeout={3000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/loan/guarantee"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.guaranteeDetailPage.findListGuarantees")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.guaranteeDetailPage.letterGuarantee")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <GuaranteeFormCreate
          locationStore={this.locationStore}
          orgList={this.orgList}
          guarantee={this.guarantee}
          requestList={this.requestList}
          request={this.request}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(GuaranteeFormCreatePage));
