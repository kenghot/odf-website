import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Table } from "semantic-ui-react";
import { FormDisplay, Text } from "../../../components/common";
import { NoPermissionMessage } from "../../../components/permission";
import { currency, date_display_CE_TO_BE } from "../../../utils/format-helper";
import { hasPermissionMode } from "../../../utils/render-by-permission";
import { IDebtCollectionSueModel } from "../DebtCollectionModel";

interface IDebtCollectionSueResultView extends WithTranslation {
  debtSue: IDebtCollectionSueModel;
  editMode?: boolean;
}

@observer
class DebtCollectionSueResultView extends React.Component<
  IDebtCollectionSueResultView
> {
  public render() {
    const { t, editMode } = this.props;
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
        {hasPermissionMode(
          "DEBTCOLLECTION.LEGAL.RESULT.VIEW",
          "DEBTCOLLECTION.LEGAL.RESULT.EDIT",
          editMode
        ) ? (
          <React.Fragment>{this.renderLitigationResults()}</React.Fragment>
        ) : (
          <NoPermissionMessage />
        )}
      </Form>
    );
  }

  private renderLitigationResults = () => {
    const { debtSue, t } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths={"equal"}>
          <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.interestStartingDate"
            )}
            value={date_display_CE_TO_BE(debtSue.judgementInterestStartDate)}
          />
          <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.interestEndingDate"
            )}
            value={date_display_CE_TO_BE(debtSue.judgementInterestEndDate)}
          />
          <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.interestByCourtOrder"
            )}
            value={debtSue.judgementInterestRate || ""}
          />
        </Form.Group>
        {this.renderLitigationResultsTable()}
      </React.Fragment>
    );
  };

  private renderLitigationResultsTable = () => {
    const { debtSue, t } = this.props;
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
            <Table.Cell style={styles.borderCell} textAlign={"right"}>
              <Text shade={2}>{currency(debtSue.judgementBalance, 2)}</Text>
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
            <Table.Cell style={styles.cellUnderline} textAlign={"right"}>
              <Text shade={2}>
                {currency(debtSue.judgementInterestAmount, 2)}
              </Text>
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
            <Table.Cell style={styles.borderCell} textAlign={"right"}>
              <Text shade={2}>{currency(debtSue.lawyerFee, 2)}</Text>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.borderCell}>
              <Text shade={2}>
                {t("module.debtCollection.debtCollectionSueForm.fee")}
              </Text>
            </Table.Cell>
            <Table.Cell style={styles.borderCell} />
            <Table.Cell style={styles.borderCell} textAlign={"right"}>
              <Text shade={2}>{currency(debtSue.fee, 2)}</Text>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={styles.cellUnderlineTwoLines}>
              <Text shade={2}>
                {t("module.debtCollection.debtCollectionSueForm.otherAmount")}
              </Text>
            </Table.Cell>
            <Table.Cell style={styles.cellUnderlineTwoLines} />
            <Table.Cell
              style={styles.cellUnderlineTwoLines}
              textAlign={"right"}
            >
              <Text shade={2}>{currency(debtSue.otherExpense, 2)}</Text>
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

export default withTranslation()(DebtCollectionSueResultView);
