import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Table } from "semantic-ui-react";
import { AlertMessage, DateInput, Text } from "../../../components/common";
import { CurrencyInput } from "../../../components/common/input";
import { NoPermissionMessage } from "../../../components/permission";
import { currency } from "../../../utils/format-helper";
import { hasPermission } from "../../../utils/render-by-permission";
import { IDebtCollectionSueModel } from "../DebtCollectionModel";

interface IDebtCollectionSueResultForm extends WithTranslation {
  debtSue: IDebtCollectionSueModel;
  onUpdateDebtCollectionResultSue: () => Promise<any>;
  onCalculateJudgementInterestRate: () => Promise<any>;
}

@observer
class DebtCollectionSueResultForm extends React.Component<
  IDebtCollectionSueResultForm
> {
  public render() {
    const { t, debtSue } = this.props;
    return (
      <Form>
        <Header
          size="medium"
          content={t(
            "module.debtCollection.debtCollectionSueForm.litigationResults"
          )}
          subheader={t(
            "module.debtCollection.debtCollectionSueForm.litigationDescription"
          )}
        />
        {hasPermission("DEBTCOLLECTION.LEGAL.RESULT.EDIT") ? (
          <React.Fragment>{this.renderLitigationResults()}</React.Fragment>
        ) : (
          <NoPermissionMessage />
        )}
        <AlertMessage messageobj={debtSue.alert} float timeout={3000} />
      </Form>
    );
  }

  private renderLitigationResults = () => {
    const {
      debtSue,
      onUpdateDebtCollectionResultSue,
      onCalculateJudgementInterestRate,
      t
    } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths={"equal"}>
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.interestStartingDate"
            )}
            control={DateInput}
            value={debtSue.judgementInterestStartDate || undefined}
            fieldName="judgementInterestStartDate"
            onChangeInputField={this.onChangeInputField}
            onBlur={onCalculateJudgementInterestRate}
          />
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.interestEndingDate"
            )}
            control={DateInput}
            value={debtSue.judgementInterestEndDate || undefined}
            fieldName="judgementInterestEndDate"
            onChangeInputField={this.onChangeInputField}
            onBlur={onCalculateJudgementInterestRate}
          />
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.interestByCourtOrder"
            )}
            control={CurrencyInput}
            id={"input-debtSue-judgementInterestRate"}
            placeholder={"0%"}
            value={debtSue.judgementInterestRate}
            onChangeInputField={this.onChangeInputField}
            fieldName={"judgementInterestRate"}
            onBlur={onCalculateJudgementInterestRate}
            labelText={"%"}
          />
        </Form.Group>
        {this.renderLitigationResultsTable()}
        <Button
          content={t("module.debtCollection.debtCollectionSueForm.submit")}
          floated={"right"}
          color={"blue"}
          onClick={onUpdateDebtCollectionResultSue}
        />
        <br />
        <br />
      </React.Fragment>
    );
  };

  private renderLitigationResultsTable = () => {
    const { debtSue, onCalculateJudgementInterestRate, t } = this.props;
    return (
      <Table basic={"very"}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={styles.borderHeaderCell} />
            <Table.HeaderCell
              width={"4"}
              textAlign={"center"}
              style={styles.borderHeaderCell}
            >
              {t(
                "module.debtCollection.debtCollectionSueForm.totalAmountHasSent"
              )}
            </Table.HeaderCell>
            <Table.HeaderCell
              width={"6"}
              textAlign={"center"}
              style={styles.borderHeaderCell}
            >
              {t(
                "module.debtCollection.debtCollectionSueForm.totalAmountByCourtOrder"
              )}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell style={styles.borderCell}>
              <Text shade={2}>
                {t(
                  "module.debtCollection.debtCollectionSueForm.principleAmount"
                )}
              </Text>
            </Table.Cell>
            <Table.Cell textAlign={"right"} style={styles.borderCell}>
              <Text shade={2}>{currency(debtSue.debtAmount, 2)}</Text>
            </Table.Cell>
            <Table.Cell style={styles.borderCell}>
              <Form.Field
                control={CurrencyInput}
                id={"input-debtSue-judgementBalance"}
                value={debtSue.judgementBalance}
                onChangeInputField={this.onChangeInputField}
                fieldName={"judgementBalance"}
                onBlur={onCalculateJudgementInterestRate}
                float={"right"}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.cellUnderline}>
              <Text shade={2}>
                {t(
                  "module.debtCollection.debtCollectionSueForm.interestWithoutPercent"
                )}
              </Text>
            </Table.Cell>
            <Table.Cell textAlign={"right"} style={styles.cellUnderline}>
              <Text shade={2}>{currency(debtSue.interestAmount, 2)}</Text>
            </Table.Cell>
            <Table.Cell style={styles.cellUnderline}>
              <Form.Field
                control={CurrencyInput}
                id={"input-debtSue-judgementInterestAmount"}
                placeholder={"0%"}
                value={debtSue.judgementInterestAmount}
                onChangeInputField={this.onChangeInputField}
                fieldName={"judgementInterestAmount"}
                float={"right"}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.borderCell}>
              <Text shade={2}>
                {t("module.debtCollection.debtCollectionSueForm.totalDebt")}
              </Text>
            </Table.Cell>
            <Table.Cell textAlign={"right"} style={styles.borderCell}>
              <Text shade={2}>{currency(debtSue.totalDebtAmountView, 2)}</Text>
            </Table.Cell>
            <Table.Cell textAlign={"right"} style={styles.borderCell}>
              <Text shade={2}>
                {currency(debtSue.totalJudmentDebtAmountView, 2)}
              </Text>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.borderCell}>
              <Text shade={2}>
                {t("module.debtCollection.debtCollectionSueForm.lawyerFee")}
              </Text>
            </Table.Cell>
            <Table.Cell style={styles.borderCell} />
            <Table.Cell style={styles.borderCell}>
              <Form.Field
                control={CurrencyInput}
                id={"input-debtSue-lawyerFee"}
                value={debtSue.lawyerFee}
                onChangeInputField={this.onChangeInputField}
                fieldName={"lawyerFee"}
                float={"right"}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.borderCell}>
              <Text shade={2}>
                {t("module.debtCollection.debtCollectionSueForm.fee")}
              </Text>
            </Table.Cell>
            <Table.Cell style={styles.borderCell} />
            <Table.Cell style={styles.borderCell}>
              <Form.Field
                control={CurrencyInput}
                id={"input-debtSue-fee"}
                value={debtSue.fee}
                onChangeInputField={this.onChangeInputField}
                fieldName={"fee"}
                float={"right"}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.cellUnderlineTwoLines}>
              <Text shade={2}>
                {t("module.debtCollection.debtCollectionSueForm.otherAmount")}
              </Text>
            </Table.Cell>
            <Table.Cell style={styles.cellUnderlineTwoLines} />
            <Table.Cell style={styles.cellUnderlineTwoLines}>
              <Form.Field
                control={CurrencyInput}
                id={"input-debtSue-otherExpense"}
                value={debtSue.otherExpense}
                onChangeInputField={this.onChangeInputField}
                fieldName={"otherExpense"}
                float={"right"}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.borderCell}>
              <Text shade={2} size={"big"}>
                {t("module.debtCollection.debtCollectionSueForm.total")}
              </Text>
            </Table.Cell>
            <Table.Cell textAlign={"right"} style={styles.borderCell}>
              <Text shade={2} size={"big"}>
                {currency(debtSue.totalDebtAmountView, 2)}
              </Text>
            </Table.Cell>
            <Table.Cell textAlign={"right"} style={styles.borderCell}>
              <Text shade={2} size={"big"}>
                {currency(debtSue.totalAmountView, 2)}
              </Text>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    const { debtSue } = this.props;
    debtSue.setField({ fieldname, value });
  };
}

const styles = {
  borderHeaderCell: {
    borderBottom: 0
  },
  borderCell: {
    borderTop: 0
  },
  cellUnderline: {
    borderTop: 0,
    borderBottom: "1px solid"
  },
  cellUnderlineTwoLines: {
    borderTop: 0,
    borderBottomStyle: "double"
  }
};

export default withTranslation()(DebtCollectionSueResultForm);
