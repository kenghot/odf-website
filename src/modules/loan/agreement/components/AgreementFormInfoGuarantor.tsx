import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { TitleDDL } from "../../../../components/project";
import { IAgreementItemModel } from "../AgreementModel";

interface IAgreementFormInfoGuarantor extends WithTranslation {
  agreementItem: IAgreementItemModel;
}

@observer
class AgreementFormInfoGuarantor extends React.Component<
  IAgreementFormInfoGuarantor
> {
  public render() {
    const { t, agreementItem } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <TitleDDL
            placeholder={t("module.loan.agreementGuarantorInfo.title")}
            label={t("module.loan.agreementGuarantorInfo.specifyNamePrefix")}
            fluid
            width={4}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("title", data.value)
            }
            value={agreementItem.guarantor.title}
          />
          <Form.Input
            label={t("module.loan.agreementGuarantorInfo.firstname")}
            placeholder={t("module.loan.agreementGuarantorInfo.specifyName")}
            required
            width={6}
            fluid
            onChange={(event: any, data: any) =>
              this.onChangeInputField("firstname", data.value)
            }
            value={agreementItem.guarantor.firstname}
          />
          <Form.Input
            label={t("module.loan.agreementGuarantorInfo.lastNames")}
            placeholder={t(
              "module.loan.agreementGuarantorInfo.specifyLastName"
            )}
            width={6}
            required
            fluid
            onChange={(event: any, data: any) =>
              this.onChangeInputField("lastname", data.value)
            }
            value={agreementItem.guarantor.lastname}
          />
        </Form.Group>
        {/* <Form.Group widths="equal">
          <Form.Input
            fluid
            label={t("module.loan.agreementGuarantorInfo.letterGuarantee")}
            placeholder={t(
              "module.loan.agreementGuarantorInfo.specifyLetterGuarantee"
            )}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("ยังไม่รู้", data.value)
            }
            value={"ยังไม่รู้"}
          />
          <Form.Button
            width={6}
            fluid
            floated="right"
            color="teal"
            style={styles.buttom}
            onClick={this.onClickCreateLetterGuarantee}
          >
            {t("module.loan.agreementGuarantorInfo.createLetterGuarantee")}
          </Form.Button>
        </Form.Group>
        <Form.Input
          fluid
          label={t("module.loan.agreementGuarantorInfo.letterGuaranteeDated")}
          placeholder="DD/MM/YYYY"
          onChange={(event: any, data: any) =>
            this.onChangeInputField("ยังไม่รู้", data.value)
          }
          value={"ยังไม่รู้"}
        /> */}
      </Segment>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { agreementItem } = this.props;
    agreementItem.guarantor.setField({ fieldname, value });
  };
  // private onClickCreateLetterGuarantee = () => {
  //   // const { agreementItem } = this.props;
  // };
}
// const styles: any = {
//   buttom: {
//     marginTop: 23
//   }
// };

export default withTranslation()(AgreementFormInfoGuarantor);
