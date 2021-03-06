import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Segment } from "semantic-ui-react";
import { ErrorMessage, Link } from "../../components/common";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";
import { ProvinceByOrgDDL } from "../admin/organization/components";
import { OrgListModel } from "../admin/organization/OrgListModel";
import { LocationModel } from "../../components/address";

export interface ISetOrganization extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class SetOrganization extends React.Component<ISetOrganization> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});
  public render() {
    const { t, onChangeStep, authStore } = this.props;
    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {"เลือก" + t("module.admin.userInfoForm.underProvince") + "ตามข้อมูลทะเบียนบ้าน"}
          <Header.Subheader>
            {"โปรดเลือกจังหวัด"}
          </Header.Subheader>
        </Header>
        <Form loading={authStore!.loading} onSubmit={this.setOrg}>
          <Form.Field
            required
            label={t("module.admin.userInfoForm.underProvince")}
            placeholder={t(
              "module.admin.searchForm.pleaseSelectProvince"
            )}
            control={ProvinceByOrgDDL}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          />


          <ErrorMessage errorobj={authStore!.error} />
          <Grid style={styles.buttonMarginStyle}>
            <Grid.Row columns="equal" verticalAlign="middle">
              <Grid.Column>
                <Link
                  size="medium"
                  hideUnderline
                  onClick={() => onChangeStep("LoginForm")}
                >
                  {t("canceled")}
                </Link>
              </Grid.Column>
              <Grid.Column>
                <Form.Button
                  id={"btn-submit-forget-password"}
                  primary
                  floated="right"
                  type="submit"
                >
                  {t("continue")}
                </Form.Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
  private setOrg = async () => {
    const { authStore, onChangeStep } = this.props;
    try {
      if (authStore!.userProfile.organization.id) {
        await authStore!.userProfile.updateUser(authStore!.userProfile.id);
        window.localStorage.removeItem("uid");
        window.localStorage.removeItem("permissions");
        await authStore!.sign_out();
        onChangeStep("LoginForm");
      } else {
        authStore!.error.setField({
          fieldname: "tigger",
          value: true
        });
        authStore!.error.setField({
          fieldname: "title",
          value: "เลือกข้อมูลไม่ถูกต้อง"
        });
        authStore!.error.setField({
          fieldname: "message",
          value: "โปรดเลือกจังหวัด"
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { authStore } = this.props;
    authStore!.userProfile.organization.setField({ fieldname: "id", value });
  };
}

const styles: any = {
  subHeader: {
    textAlign: "left"
  },
  textInputStyle: {
    marginBottom: 14
  },
  buttonMarginStyle: {
    marginTop: 21
  },
  headerSubStyle: {
    marginTop: 28,
    marginBottom: 28
  }
};

export default withTranslation()(SetOrganization);
