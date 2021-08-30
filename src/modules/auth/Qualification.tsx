import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Segment, DropdownProps, Dropdown, Message } from "semantic-ui-react";
import { ErrorMessage, Link, FormDisplay } from "../../components/common";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";
import { TitleDDL } from "../../components/project";
import { IUserModel } from "../admin/user/UserModel";
import { OrganizationDDL } from "../admin/organization/components";
import { OrgListModel } from "../admin/organization/OrgListModel";
import { ResetPasswordModal } from "../../modals";
import { reduceRight } from "lodash";
import { FormFieldCheckbox } from "../../../src/components/common/formfield";


export interface IQualification extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
  fieldname?: string;
}

@inject("authStore")
@observer
class Qualification extends React.Component<IQualification> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});

  public render() {
    const { t, onChangeStep, authStore, fieldname } = this.props;

    return (
      <Segment padded="very">
        <Logo />
        <Form onSubmit={this.createUserForm}>
          <Header size="medium" textAlign="center">
            {t("คุณสมบัติของผู้กู้และผู้ค้ำ")}
          </Header>
          <Form.Group widths="equal">
            <Header size="tiny" textAlign="left" style={styles.headerSubStyle}>
              {t("ผู้ขอกู้ยืมฯ")}
              <Header.Subheader>
                {"1. มีอายุ 60 ปีบริบูรณ์ขึ้นไป"}
              </Header.Subheader>
              <Header.Subheader>
                {"2. มีความจำเป็นขอรับการสนับสนุนเงินกู้ยืมประกอบอาชีพ"}
              </Header.Subheader>
              <Header.Subheader>
                {"3. มีความสามารถในการประกอบอาชีพ"}
              </Header.Subheader>
              <Header.Subheader>
                {"4. มีสภาพร่างกายแข็งแรงประกอบอาชีพได้"}
              </Header.Subheader>
              <Header.Subheader>
                {"5. มีปัจจัยในการสนับสนุนการประกอบอาชีพ"}
              </Header.Subheader>
              <Header.Subheader>
                {"6. มีสถานที่ประกอบอาชีพอยู่จังหวัดเดียวกันกับที่ยื่นขอกู้ยืม"}
              </Header.Subheader>
              <Header.Subheader>
                {"7. ไม่เป็นผู้ค้างชำระเงินกองทุนผู้สูงอายุ"}
              </Header.Subheader>
              <Header size="tiny" textAlign="left" style={styles.headerSubStyle}>
                {t("เอกสารประกอบการยื่นคำร้อง")}
                <Header.Subheader>
                  {"1. บัตรประจำตัวประชาชน (ผู้กู้-ผู้ค้ำ)"}
                </Header.Subheader>
                <Header.Subheader>
                  {"2. ทะเบียนบ้าน (ผู้กู้-ผู้ค้ำ)"}
                </Header.Subheader>
                <Header.Subheader>
                  {"3. หนังสือรับรองเงินเดือนผู้ค้ำประกัน"}
                </Header.Subheader>
                <Header.Subheader>
                  {"4. ใบสำคัญการสมรส หรือใบสำคัญการหย่า (ถ้ามี)"}
                </Header.Subheader>
                <Header.Subheader>
                  {"5. ใบมรณะบัตรกรณีคู่สมรสเสียชีวิต (ถ้ามี)"}
                </Header.Subheader>
                <Header.Subheader>
                  {"6. ใบเปลี่ยนชื่อ สกุล (ถ้ามี)"}
                </Header.Subheader>
                <Header.Subheader>
                  {"7. ไม่เป็นผู้ค้างชำระเงินกองทุนผู้สูงอายุ"}
                </Header.Subheader>
              </Header>
            </Header>
            <Header size="tiny" textAlign="left" style={styles.headerSubStyle}>
              {t("ผู้ค้ำประกันกู้ยืมฯ")}
              <Header.Subheader>
                {"1. มีอายุไม่เกิน 59 ปีบริบูรณ์"}
              </Header.Subheader>
              <Header.Subheader>
                {"2. เป็นผู้มีรายได้หรือเงินเดือนประจำ"}
              </Header.Subheader>
              <Header.Subheader>
                {"3. มีภูมิลำเนาตามทะเบียนราษฎร์อยู่จังหวัดเดียวกันกับผู้กู้ยืม"}
              </Header.Subheader>
              <Header.Subheader>
                {"4. ไม่อยู่ระหว่างเป็นผู้กู้ยืม"}
              </Header.Subheader>
              <Header.Subheader>
                {"5. ไม่อยู่ระหว่างเป็นผู้ค่ำประกันให้กับบุคคลอื่นที่ขอกู้ยืม"}
              </Header.Subheader>
            </Header>
          </Form.Group>
          <Message color='brown'>กรณีผู้ยื่นคำร้องมีอายุ 80 ปีขึ้นไป ควรมีใบรับรองแพทย์ และรูปถ่ายเต็มตัวขณะประกอบอาชีพ</Message>

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
      if (authStore!.acceptAgree) {
        onChangeStep("Register");
      }
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { authStore } = this.props;
    authStore!.userProfile.organization.setField({ fieldname: "id", value });
  };
  private onChangeIsOnlyBirthYearInputField = (
    fieldname: string,
    value: any
  ) => {
    const { authStore } = this.props;
    authStore!.setField({ fieldname, value });
    if (value && authStore!.acceptAgree) {
      authStore!.setField({
        fieldname: "acceptAgree",
        value: true,
      });
    }
  };
}

const styles: any = {
  subHeader: {
    textAlign: 'justified'
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

export default withTranslation()(Qualification);
