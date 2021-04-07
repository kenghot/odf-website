import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { GuaranteeDetail } from "../modules/loan/guarantee/components";
import { GuaranteeModel } from "../modules/loan/guarantee/GuaranteeModel";

interface IGuaranteeDetailPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class GuaranteeDetailPage extends React.Component<IGuaranteeDetailPage> {
  private guarantee = GuaranteeModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "loanNoneTabHeader"
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.guarantee.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.guarantee.getGuaranteeDetail();
    }
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
        <GuaranteeDetail guarantee={this.guarantee} />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(GuaranteeDetailPage));
