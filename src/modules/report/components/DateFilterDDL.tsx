import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Grid } from "semantic-ui-react";
import { DateInput } from "../../../components/common";

interface IDateFilterDDL extends WithTranslation {
  paidDateId: string;
  paidDateValue: string;
  paidDateFieldName: string;
  monthId: string;
  monthValue: number | undefined;
  monthFieldName: string;
  onSelectedMonth: (fieldName: string, value: any) => void;
  startDocumentDateId: string;
  startDocumentDateValue: string;
  startDocumentDateFieldName: string;
  endDocumentDateId: string;
  endDocumentDateValue: string;
  endDocumentDateFieldName: string;
  onSelectedDocumentDate: (fieldName: string, value: any) => void;
}

export enum dateFilterDDLType {
  day = "day",
  month = "month",
  periods = "periods"
}

@observer
class DateFilterDDL extends React.Component<IDateFilterDDL> {
  public state = { dateFilter: dateFilterDDLType.day as dateFilterDDLType };
  public render() {
    const {
      paidDateId,
      paidDateValue,
      paidDateFieldName,
      monthId,
      monthValue,
      monthFieldName,
      onSelectedMonth,
      startDocumentDateId,
      startDocumentDateValue,
      startDocumentDateFieldName,
      onSelectedDocumentDate,
      endDocumentDateId,
      endDocumentDateValue,
      endDocumentDateFieldName,
      t
    } = this.props;

    return (
      <Grid columns={"equal"} doubling stackable>
        <Grid.Column>
          <Form.Dropdown
            fluid
            options={this.renderOptions()}
            label={t("module.report.DateFilterDDL.dateFilterLabel")}
            value={this.state.dateFilter}
            onChange={(event, data: any) => this.onSelectDateFilter(data.value)}
            selection
          />
        </Grid.Column>
        {this.state.dateFilter === dateFilterDDLType.day ? (
          <Grid.Column>
            <Form.Field
              control={DateInput}
              label={t("module.report.DateFilterDDL.date")}
              id={paidDateId}
              value={paidDateValue}
              fieldName={paidDateFieldName}
              onChangeInputField={onSelectedDocumentDate}
              fluid
              clearable
            />
          </Grid.Column>
        ) : null}
        {this.state.dateFilter === dateFilterDDLType.month ? (
          <Grid.Column>
            <Form.Field
              label={t("module.report.DateFilterDDL.month")}
              control={DateInput}
              type="month"
              formatdate="MMMM"
              value={monthValue}
              fieldName={monthFieldName}
              onChangeInputField={this.onSelectedMonth}
              id={monthId}
            />
          </Grid.Column>
        ) : null}
        {this.state.dateFilter === dateFilterDDLType.periods ? (
          <React.Fragment>
            <Grid.Column>
              <Form.Field
                control={DateInput}
                id={startDocumentDateId}
                value={startDocumentDateValue}
                label={t("module.report.DateFilterDDL.startDate")}
                fieldName={startDocumentDateFieldName}
                onChangeInputField={onSelectedDocumentDate}
                fluid
                clearable
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                control={DateInput}
                label={t("module.report.DateFilterDDL.endDate")}
                id={endDocumentDateId}
                value={endDocumentDateValue}
                fieldName={endDocumentDateFieldName}
                onChangeInputField={onSelectedDocumentDate}
                fluid
                clearable
              />
            </Grid.Column>
          </React.Fragment>
        ) : null}
      </Grid>
    );
  }

  private onSelectedMonth = (fieldName: string, value: string) => {
    const { onSelectedMonth } = this.props;
    // นำ Date string ที่ได้มาแปลงเป็น เดือน โดยข้อมูลที่ได้จะเป็นค่า 1-12
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    onSelectedMonth(fieldName, `${year}-${month}`);
  };

  private onSelectDateFilter = (value: string) => {
    const {
      monthFieldName,
      paidDateFieldName,
      startDocumentDateFieldName,
      endDocumentDateFieldName,
      onSelectedMonth,
      onSelectedDocumentDate
    } = this.props;
    onSelectedMonth(monthFieldName, undefined);
    onSelectedDocumentDate(paidDateFieldName, "");
    onSelectedDocumentDate(startDocumentDateFieldName, "");
    onSelectedDocumentDate(endDocumentDateFieldName, "");
    this.setState({ dateFilter: value });
  };

  private renderOptions = () => {
    const { t } = this.props;
    const options = [
      {
        key: 1,
        text: t("module.report.DateFilterDDL.selectDate"),
        value: dateFilterDDLType.day
      },
      {
        key: 2,
        text: t("module.report.DateFilterDDL.selectMonth"),
        value: dateFilterDDLType.month
      },
      {
        key: 3,
        text: t("module.report.DateFilterDDL.selectPeriods"),
        value: dateFilterDDLType.periods
      }
    ];
    return options;
  };
}

export default withTranslation()(DateFilterDDL);
