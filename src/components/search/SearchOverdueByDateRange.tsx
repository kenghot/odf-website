import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { SegmentSizeProp } from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import { DateInput } from "../../components/common/input";
import FiscalYearDDL from "../project/year/FiscalYearDDL";

interface ISearchOverdueByDateRange extends WithTranslation {
  onChangeInputField: (fieldName: string, value: any) => void;
  size?: SegmentSizeProp;
  idInputFieldNameStartDate?: string;
  inputFieldNameStartDate: string;
  valueFieldNameStartDate: string;
  idInputFieldNameEndDate: string;
  inputFieldNameEndDate: string;
  valueFieldNameEndDate: string;
  filterFiscalYear?: string;
  onChangeFiscalYearDDL?: () => void;
  clearable?: boolean;
}

@observer
class SearchOverdueByDateRange extends React.Component<
  ISearchOverdueByDateRange
> {
  public render() {
    const {
      t,
      size,
      onChangeInputField,
      idInputFieldNameStartDate,
      inputFieldNameStartDate,
      valueFieldNameStartDate,
      idInputFieldNameEndDate,
      inputFieldNameEndDate,
      valueFieldNameEndDate,
      onChangeFiscalYearDDL,
      filterFiscalYear,
      clearable
    } = this.props;
    return (
      <Segment padded size={size}>
        <Form.Group widths="equal">
          <Form.Field
            id={idInputFieldNameStartDate || inputFieldNameStartDate}
            label={t("module.loan.searchForm.start")}
            control={DateInput}
            value={valueFieldNameStartDate}
            fieldName={inputFieldNameStartDate}
            onChangeInputField={onChangeInputField}
            clearable={clearable}
          />
          <Form.Field
            id={idInputFieldNameEndDate || inputFieldNameEndDate}
            label={t("module.loan.searchForm.to")}
            control={DateInput}
            value={valueFieldNameEndDate}
            fieldName={inputFieldNameEndDate}
            onChangeInputField={onChangeInputField}
            clearable={clearable}
          />
          {filterFiscalYear === undefined ? null : (
            <Form.Field
              label={t("module.loan.searchForm.fiscalYear")}
              placeholder={t("module.loan.searchForm.specifyFiscalYear")}
              control={FiscalYearDDL}
              onChange={onChangeFiscalYearDDL}
              value={filterFiscalYear}
            />
          )}
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(SearchOverdueByDateRange);
