import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Segment, DropdownProps, Dropdown } from "semantic-ui-react";
import { ErrorMessage, Link, FormDisplay } from "../../components/common";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";
import { TitleDDL } from "../../components/project";
import { IUserModel } from "../admin/user/UserModel";
import { OrganizationDDL } from "../admin/organization/components";
import { OrgListModel } from "../admin/organization/OrgListModel";
import { ResetPasswordModal } from "../../modals";
import { reduceRight } from "lodash";



export interface IRegister extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
  fieldname?: string;
}

@inject("authStore")
@observer
class Register extends React.Component<IRegister> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});

  public render() {
    const { t, onChangeStep, authStore, fieldname } = this.props;
    const subjectsTitle = [
      { text: 'นาย', value: 'นาย' },
      { text: 'นางสาว', value: 'นางสาว' },
      { text: 'นาง', value: 'นาง' }
    ];
    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {t("page.loginPage.registerBorrower")}
          <Header.Subheader>
            {t("page.loginPage.registerRequestData")}
          </Header.Subheader>
        </Header>

        <Form onSubmit={this.createUserForm}>
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

          <Form.Group widths="equal">
            <Form.Select
              id="form-input-ddl-title1"
              search
              fluid
              placeholder={t("module.admin.userInfoForm.prefix")}
              label={t("module.admin.userInfoForm.title")}
              onChange={(event: any, data: any) =>
                authStore!.userProfile.setField({
                  fieldname: "title",
                  value: data.value
                })
              }
              options={subjectsTitle}
              value={authStore!.userProfile.title}
            />
            <Form.Input
              required
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
              required
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
            required
            label={t("module.admin.userInfoForm.underDepartment")}
            placeholder={t(
              "module.admin.userInfoForm.underDepartment"
            )}
            control={OrganizationDDL}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          /> */}
          <Form.Input
            required
            id="form-input-telephone"
            fluid
            label={t("module.admin.userInfoForm.telephoneNumber")}
            placeholder={t("module.admin.userInfoForm.telephoneNumber")}
            onChange={(event: any, data: any) => {
              if (isNaN(data.value)) {
                return;
              }
              authStore!.userProfile.setField({
                fieldname: "telephone",
                value: data.value
              });
            }}
            value={authStore!.userProfile.telephone}
          />
          {/* <Form.Input
            id="form-input-confirmotpSms"
            fluid
            label={t("page.loginPage.confirmOtpSms")}
            placeholder={t("page.loginPage.confirmOtpSms")}
            onChange={(event: any, data: any) =>
              authStore!.setField({
                fieldname: "otpSms",
                value: data.value
              })
            }
            value={authStore!.otpSms}
          /> */}
          <FormDisplay
            title={t(
              "page.loginPage.usernameBorrower"
            ) + "(" + t("หมายเลขบัตรประชาชน 13 หลัก") + ")"}
            value={authStore!.idCardNo}
          />
          {/* <ResetPasswordModal
            user={authStore!.userProfile}
            trigger={
              <Form.Button
                id="form-button-new-password"
                fluid
                floated="right"
                type="button"
              >
                {t("page.loginPage.setPassword")}
              </Form.Button>
            }
          /> */}
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
                {/* {
                  authStore!.userProfile.password ? */}
                <Form.Button
                  id={"btn-submit-forget-password"}
                  primary
                  floated="right"
                  type="submit"
                >
                  {t("continue")}
                </Form.Button>
                {/* :
                    null
                } */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }

  private createUserForm = async () => {
    const { authStore, onChangeStep } = this.props;
    try {
      await authStore!.checkUser();
      if (authStore!.idCardNo.length == 13) {
        authStore!.setField({
          fieldname: "otpSms",
          value: authStore!.isRandomOtpNumber
        })
        //console.log(authStore!.otpSms)
        await authStore!.generatorOtpSmsSend();
        onChangeStep("VerifyIdentityForm");
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

export default withTranslation()(Register);
