import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { SegmentSizeProp } from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import { DateInput } from "../../../../components/common";

interface ISearchDateRange extends WithTranslation {
  onChangeInputField: (fieldName: string, value: any) => void;
  size?: SegmentSizeProp;
  inputFieldNameStartDate: string;
  valueFieldNameStartDate: string;
  inputFieldNameEndDate: string;
  valueFieldNameEndDate: string;
}

@observer
class SearchDateRange extends React.Component<ISearchDateRange> {
  public render() {
    const {
      t,
      size,
      onChangeInputField,
      inputFieldNameStartDate,
      valueFieldNameStartDate,
      inputFieldNameEndDate,
      valueFieldNameEndDate
    } = this.props;
    return (
      <Segment padded size={size}>
        <Form.Group widths="equal">
          <Form.Field
            label={t("module.loan.searchForm.start")}
            control={DateInput}
            value={valueFieldNameStartDate}
            fieldName={inputFieldNameStartDate}
            onChangeInputField={onChangeInputField}
            id={inputFieldNameStartDate}
          />
          <Form.Field
            label={t("module.loan.searchForm.to")}
            control={DateInput}
            value={valueFieldNameEndDate}
            fieldName={inputFieldNameEndDate}
            onChangeInputField={onChangeInputField}
            id={inputFieldNameEndDate}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(SearchDateRange);
