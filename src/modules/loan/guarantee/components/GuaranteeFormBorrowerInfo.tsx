import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { TitleDDL } from "../../../../components/project";
import { IGuaranteeItemModel } from "../GuaranteeModel";

interface IGuaranteeFormBorrowerInfo extends WithTranslation {
  guaranteeItem: IGuaranteeItemModel;
}

@observer
class GuaranteeFormBorrowerInfo extends React.Component<
  IGuaranteeFormBorrowerInfo
> {
  public render() {
    const { t, guaranteeItem } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <TitleDDL
            placeholder={t("module.loan.guaranteeBorrowerInfo.prefix")}
            label={t("module.loan.guaranteeBorrowerInfo.prefix")}
            fluid
            width={4}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("title", data.value)
            }
            value={guaranteeItem.borrower.title}
          />
          <Form.Input
            label={t("module.loan.guaranteeBorrowerInfo.firstName")}
            placeholder={t("module.loan.guaranteeBorrowerInfo.firstName")}
            width={6}
            fluid
            onChange={(event: any, data: any) =>
              this.onChangeInputField("firstname", data.value)
            }
            value={guaranteeItem.borrower.firstname}
          />
          <Form.Input
            label={t("module.loan.guaranteeBorrowerInfo.lastNames")}
            placeholder={t("module.loan.guaranteeBorrowerInfo.lastNames")}
            width={6}
            fluid
            onChange={(event: any, data: any) =>
              this.onChangeInputField("lastname", data.value)
            }
            value={guaranteeItem.borrower.lastname}
          />
        </Form.Group>
      </Segment>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { guaranteeItem } = this.props;
    guaranteeItem.borrower.setField({ fieldname, value });
  };
}

export default withTranslation()(GuaranteeFormBorrowerInfo);
