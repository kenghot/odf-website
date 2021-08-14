import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Segment, DropdownProps } from "semantic-ui-react";
import { ErrorMessage, Link } from "../../components/common";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";
import { TitleDDL } from "../../components/project";
import { IUserModel } from "../admin/user/UserModel";
import { OrganizationDDL } from "../admin/organization/components";
import { OrgListModel } from "../admin/organization/OrgListModel";


export interface IRegister extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
  fieldname?: string;
}

@inject("authStore")
@observer
class Register extends React.Component<IRegister> {
  private orgList = OrgListModel.create({});
  public _isMounted = false;
  // public componentDidMount() {
  //   this._isMounted = true;
  //   setTimeout(() => {
  //     if (this._isMounted) {
  //       this.orgList.setField({
  //         fieldname: "filterName",
  //         value: this.props.authStore!.userProfile.organization.orgName
  //       });
  //       this.orgList.load_data();
  //     }
  //   }, 1000);
  // }
  // public componentWillUnmount() {
  //   this._isMounted = false;
  // }
  public render() {
    const { t, onChangeStep, authStore, fieldname } = this.props;
    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {t("page.loginPage.registerBorrower")}
          <Header.Subheader>
            {t("page.loginPage.registerRequestData")}
          </Header.Subheader>
        </Header>

        <Form loading={authStore!.loading} onSubmit={this.createUserForm}>
          <Form.Input
            required
            id={`form-input-id-card-${fieldname}`}
            label={t("component.idCardReader.iDCardNumber", {
              value: authStore!.idCardIsIncorrectFormat
                ? t("component.idCardReader.invalidCardNumber")
                : "",
            })}
            icon="id card"
            iconPosition="left"
            placeholder="0-0000-00000-00-0"
            width="16"
            maxLength="17"
            value={authStore!.idCardformated}
            onChange={(event, data) => {
              const dataFormated = data.value.replace(/\D/g, "");
              authStore!.setField({
                fieldname: "idCardNo",
                value: dataFormated,
              });
            }}
            error={authStore!.idCardIsIncorrectFormat}
          />
          <Form.Input
            id="form-input-username"
            required
            label={t("page.loginPage.username")}
            icon="user"
            iconPosition="left"
            placeholder={t("page.loginPage.username")}
            style={styles.textInputStyle}
            width="16"
            onChange={(event: any, data: any) =>
              authStore!.userProfile.setField({
                fieldname: "username",
                value: data.value
              })
            }
            value={authStore!.userProfile.username || ""}
          />
          <Form.Group widths="equal">
            <TitleDDL
              id="form-input-ddl-title1"
              search
              fluid
              placeholder={t("module.admin.userInfoForm.prefix")}
              label={t("module.admin.userInfoForm.title")}
              onChange={(
                event: React.SyntheticEvent<HTMLElement, Event>,
                data: DropdownProps
              ) =>
                authStore!.userProfile.setField({
                  fieldname: "title",
                  value: data.value
                })
              }
              value={authStore!.userProfile.title}
            />
            <Form.Input
              id="form-input-firstname"
              fluid
              label={t("module.admin.userInfoForm.firstName")}
              placeholder={t("module.admin.userInfoForm.firstName")}
              onChange={(event: any, data: any) =>
                authStore!.userProfile.setField({
                  fieldname: "firstname",
                  value: data.value
                })
              }
              value={authStore!.userProfile.firstname}
            />
            <Form.Input
              id="form-input-lastname"
              fluid
              label={t("module.admin.userInfoForm.lastNames")}
              placeholder={t("module.admin.userInfoForm.lastNames")}
              onChange={(event: any, data: any) =>
                authStore!.userProfile.setField({
                  fieldname: "lastname",
                  value: data.value
                })
              }
              value={authStore!.userProfile.lastname}
            />
          </Form.Group>
          {/* <Form.Field
            id="form-input-ddl-organization"
            label={t("module.admin.userInfoForm.underDepartment")}
            control={OrganizationDDL}
            value={authStore!.userProfile.organization.id}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          /> */}
          {/* <Form.Field
            label={t("module.report.public.organization")}
            control={OrganizationDDL}
            orgList={this.orgList}
            value={authStore!.userProfile.organization.id}
            onChange={this.onSelectedOrganizeDDL}
          /> */}
          <Form.Input
            id="form-input-telephone"
            fluid
            label={t("module.admin.userInfoForm.telephoneNumber")}
            placeholder={t("module.admin.userInfoForm.telephoneNumber")}
            onChange={(event: any, data: any) =>
              authStore!.userProfile.setField({
                fieldname: "telephone",
                value: data.value
              })
            }
            value={authStore!.userProfile.telephone}
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

  private createUserForm = async () => {
    const { authStore } = this.props;
    try {
      authStore!.userProfile.setField({
        fieldname: "email",
        value: "registonline"
      })
      await authStore!.userProfile.createUser();
      // authStore.push(`/admin/user_managment/edit/${user.id}/${user.username}`);

    } catch (e) {
      console.log(e);
    }
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { authStore } = this.props;
    authStore!.userProfile.organization.setField({ fieldname: "id", value });
  };
  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
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

export default withTranslation()(Register);
