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
import { FormFieldCheckbox } from "../../../src/components/common/formfield";


export interface IAcceptAgree extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
  fieldname?: string;
}

@inject("authStore")
@observer
class AcceptAgree extends React.Component<IAcceptAgree> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});

  public render() {
    const { t, onChangeStep, authStore, fieldname } = this.props;

    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="center" color='blue'>
          {t("ข้อตกลง เงื่อนไข และความยินยอมสำหรับผู้ยื่นขอกู้ยืมเงินทุนประกอบอาชีพ ผ่านช่องทางอิเล็กทรอนิกส์")}
        </Header>
        <Form onSubmit={this.createUserForm}>

          <Form.Group widths="equal">
            <Header size="tiny" textAlign="justified">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"ข้าพเจ้าขอยืนยันและรับรองว่า ข้าพเจ้ามีอายุ 60 ปีบริบูรณ์ขึ้นไป และข้อมูลใด ๆ ที่ข้าพเจ้าได้ลงทะเบียนในการยื่นขอกู้ยืมเงินทุนประกอบอาชีพผ่านช่องทางอิเล็กทรอนิกส์นี้ เป็นข้อมูลปัจจุบัน ที่มีความถูกต้อง สมบูรณ์ และเป็นจริงทุกประการ และข้าพเจ้าตกลงยินยอมให้เปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าแก่หน่วยงานของรัฐที่เกี่ยวข้อง และยินยอมให้หน่วยงานของรัฐที่ร้องขอ สอบถามใช้ข้อมูลส่วนบุคคลนี้ หากข้าพเจ้าผิดคำรับรองดังกล่าวและหรือเจ้าหน้าที่ตรวจพบว่าข้าพเจ้าปกปิดข้อมูล หรือให้ข้อมูลอันเป็นเท็จ ข้าพเจ้ายินยอมให้เจ้าหน้าที่ดำเนินการยกเลิกคำร้องที่ยื่นขอกู้ยืมเงินทุนประกอบอาชีพผ่านช่องทางอิเล็กทรอนิกส์นี้"}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <FormFieldCheckbox
                id={`form-input-is-only-birth-year-${fieldname}`}
                label_checkbox={t("ข้าพเจ้าได้อ่าน และเข้าใจข้อความตามรายละเอียดของข้อตกลง และความยินยอมข้างต้นโดยตลอดแล้ว")}
                onChangeInputField={this.onChangeIsOnlyBirthYearInputField}
                fieldName="acceptAgree"
                checked={authStore!.acceptAgree}
              />
              {/* <br />&nbsp;&nbsp;&nbsp;&nbsp;{"ข้าพเจ้าได้อ่าน และเข้าใจข้อความตามรายละเอียดของข้อตกลง และความยินยอมข้างต้นโดยตลอดแล้ว"} */}
            </Header>
          </Form.Group>

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
                  {"ยืนยัน"}
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
        onChangeStep("Qualification");
      } else {
        authStore!.error.setField({
          fieldname: "tigger",
          value: true,
        });
        authStore!.error.setField({
          fieldname: "title",
          value: "โปรดกดยอมรับ",
        });
        authStore!.error.setField({
          fieldname: "message",
          value: "โปรดกดยอมรับ ว่าคุณได้อ่าน และเข้าใจข้อความตามรายละเอียดของข้อตกลง และความยินยอมข้างต้นโดยตลอดแล้ว",
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

export default withTranslation()(AcceptAgree);
