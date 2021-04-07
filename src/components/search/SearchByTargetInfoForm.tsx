import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { SegmentSizeProp } from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";

interface ISearchByTargetInfoForm extends WithTranslation {
  onChangeInputField: (fieldName: string, value: any) => void;
  size?: SegmentSizeProp;
  inputFieldNameIdCard: string;
  inputFieldNameFirstname: string;
  inputFieldNameLastname: string;
  valueFieldNameIdCard: string;
  valueFieldNameFirstname: string;
  valueFieldNameLastname: string;
}

@observer
class SearchByTargetInfoForm extends React.Component<ISearchByTargetInfoForm> {
  public render() {
    const {
      t,
      size,
      onChangeInputField,
      inputFieldNameIdCard,
      valueFieldNameIdCard,
      inputFieldNameFirstname,
      valueFieldNameFirstname,
      inputFieldNameLastname,
      valueFieldNameLastname
    } = this.props;
    return (
      <Segment padded size={size}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label={t("module.loan.searchForm.iDCardNumber")}
            placeholder={t("module.loan.searchForm.identifyIDCardNumber")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              onChangeInputField(inputFieldNameIdCard, data.value)
            }
            value={valueFieldNameIdCard}
          />
          <Form.Input
            fluid
            label={t("module.loan.searchForm.name")}
            placeholder={t("module.loan.searchForm.specifyName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              onChangeInputField(inputFieldNameFirstname, data.value)
            }
            value={valueFieldNameFirstname}
          />
          <Form.Input
            fluid
            label={t("module.loan.searchForm.lastName")}
            placeholder={t("module.loan.searchForm.specifyLastName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              onChangeInputField(inputFieldNameLastname, data.value)
            }
            value={valueFieldNameLastname}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(SearchByTargetInfoForm);
