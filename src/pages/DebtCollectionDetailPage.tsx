import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { DebtCollectionFormEdit } from "../modules/debtCollection/components";
import { DebtCollectionModel } from "../modules/debtCollection/DebtCollectionModel";

interface IDebtCollectionDetailPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DebtCollectionDetailPage extends React.Component<
  IDebtCollectionDetailPage
> {
  private debtCollection = DebtCollectionModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "debtCollection"
    });
    const id = this.props.location.state || this.props.match.params.id;
    await this.debtCollection.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.debtCollection.getDebtCollectionDetail();
    }
  }

  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Loading active={this.debtCollection.loading} />
        <ErrorMessage
          errorobj={this.debtCollection.error}
          float={true}
          timeout={10000}
        />
        <AlertMessage
          messageobj={this.debtCollection.alert}
          float={true}
          timeout={3000}
        />
        <Breadcrumb size={"large"}>
          <Link to={"/debtCollection"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t(
                  "page.debtCollectionDetailPage.searchOutstandingReceivables"
                )}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.debtCollectionDetailPage.latestDebtTrackingInfo")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <DebtCollectionFormEdit debtCollection={this.debtCollection} />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(DebtCollectionDetailPage));
