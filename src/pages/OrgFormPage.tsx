import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb, Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage, Text } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgModel } from "../modules/admin/organization";
import {
  AuthorizedPersonForm,
  BankForm,
  DonationPersonForm,
  ManageDocumentForm,
  ManagePosForm,
  OrgInfoForm
} from "../modules/admin/organization/components";
import { hasPermission } from "../utils/render-by-permission";

interface IOrgFormPage extends WithTranslation {
  appStore?: IAppModel;
  match?: any;
  location?: any;
}

@inject("appStore")
@observer
class OrgFormPage extends React.Component<IOrgFormPage> {
  private org = OrgModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    const id = this.props.location.state || this.props.match.params.id;
    this.org.setField({ fieldname: "id", value: id || "" });
    if (id) {
      await this.org.getOrgDetail();
    }
  }
  public componentWillUnmount() {
    this.org.resetAll();
  }
  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Container>
        <Loading active={this.org.loading} />
        <ErrorMessage errorobj={this.org.error} float={true} timeout={10000} />
        <AlertMessage messageobj={this.org.alert} float={true} timeout={3000} />
        <Breadcrumb size={"large"} id="org-form-page">
          <Link to={"/admin/org_management/"}>
            <Breadcrumb.Section>
              <Text shade={3}>{t("page.orgFormPage.findOrg")}</Text>
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("page.orgFormPage.organizationInfo")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <OrgInfoForm org={this.org} />
        {this.org.id ? <AuthorizedPersonForm org={this.org} /> : null}
        {this.org.id ? <BankForm org={this.org} /> : null}
        {this.org.id && hasPermission("DOC.ACCESS") ? (
          <ManageDocumentForm org={this.org} />
        ) : null}
        {this.org.id ? <ManagePosForm org={this.org} /> : null}
        {this.org.id ? <DonationPersonForm org={this.org} /> : null}
      </Container>
    );
  }
}

export default withTranslation()(OrgFormPage);
