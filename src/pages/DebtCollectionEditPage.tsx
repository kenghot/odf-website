import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { IAuthModel } from "../modules/auth/AuthModel";
import { DebtCollectionFormEdit } from "../modules/debtCollection/components";
import { DebtCollectionModel } from "../modules/debtCollection/DebtCollectionModel";

interface IDebtCollectionEditPage
  extends WithTranslation,
    RouteComponentProps<any> {
  appStore?: IAppModel;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class DebtCollectionEditPage extends React.Component<IDebtCollectionEditPage> {
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
      if (!this.debtCollection.deathNotification.isConfirm) {
        if (
          !this.debtCollection.deathNotification.name &&
          !this.debtCollection.deathNotification.position
        ) {
          await this.debtCollection.deathNotification.setField({
            fieldname: "name",
            value: this.props.authStore!.userProfile.fullname
          });
          await this.debtCollection.deathNotification.setField({
            fieldname: "position",
            value: this.props.authStore!.userProfile.position
          });
        }
      }
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
        <DebtCollectionFormEdit debtCollection={this.debtCollection} editMode />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(DebtCollectionEditPage));
