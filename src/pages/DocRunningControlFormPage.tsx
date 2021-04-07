import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import {
  DocumentControlFormCreate,
  DocumentControlFormEdit,
  DocumentManagementForm
} from "../modules/admin/documentcontrol/components";
import { SequenceModel } from "../modules/admin/sequence";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IDocRunningControlFormPage
  extends WithTranslation,
    RouteComponentProps<any> {
  authStore?: IAuthModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DocRunningControlFormPage extends React.Component<
  IDocRunningControlFormPage
> {
  private sequence = SequenceModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    const id = this.props.location.state || this.props.match.params.id;
    this.sequence.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.sequence.setField({
        fieldname: "sequenceType",
        value: this.props.match.params.sequencetype
      });
      await this.sequence.getSequenceDetail();
    }
  }
  public componentWillUnmount() {
    this.sequence.resetAll();
  }
  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Breadcrumb size={"large"}>
          <Link to={"/admin/doc_control/"}>
            <Breadcrumb.Section>
              <Text shade={3}>
                {t("page.docRunningControlFormPage.searchListManageDocument")}
              </Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t(
                "page.docRunningControlFormPage.documentNumberManagementInformation"
              )}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <Loading active={this.sequence.loading} />
        <ErrorMessage errorobj={this.sequence.error} float timeout={10000} />
        <AlertMessage
          messageobj={this.sequence.alert}
          float={true}
          timeout={3000}
        />
        {this.sequence.id ? (
          <DocumentControlFormEdit sequence={this.sequence} />
        ) : (
          <DocumentControlFormCreate sequence={this.sequence} />
        )}
        {this.sequence.id ? (
          <DocumentManagementForm sequence={this.sequence} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(DocRunningControlFormPage));
