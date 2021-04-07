import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Icon, Table } from "semantic-ui-react";
import {
  InputButton,
  SubSectionContainer
} from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { currency } from "../../../../utils/format-helper";
import {
  BudgetAllocationItemsModel,
  IBudgetAllocationItemsModel,
  IRequestModel
} from "../RequestModel";

interface IBudgetAllocationItem extends WithTranslation {
  request: IRequestModel;
  readOnly?: boolean;
}
@observer
class BudgetAllocationItem extends React.Component<IBudgetAllocationItem> {
  public render() {
    const { request, readOnly, t } = this.props;
    return (
      <SubSectionContainer
        title={t("module.loan.budgetAllocationItem.costEstimate")}
        linkLabel={
          readOnly ? "" : t("module.loan.budgetAllocationItem.addItem")
        }
        iconName={readOnly ? undefined : "plus circle"}
        stretch
        fluid
        basic
        onClick={() =>
          request.addBudgetAllocationItem(BudgetAllocationItemsModel.create({}))
        }
        style={styles.container}
      >
        <Table size="small">
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </Table>
      </SubSectionContainer>
    );
  }

  private renderHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1} style={styles.headerBg} />
          <Table.HeaderCell
            width={5}
            style={styles.headerBg}
            textAlign="center"
          >
            {t("module.loan.budgetAllocationItem.list")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            style={styles.headerBg}
            textAlign="center"
          >
            {t("module.loan.budgetAllocationItem.priceUnit")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            style={styles.headerBg}
            textAlign="center"
          >
            {t("module.loan.budgetAllocationItem.number")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width={3}
            style={styles.headerBg}
            textAlign="center"
          >
            {t("module.loan.budgetAllocationItem.total")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width={1}
            style={styles.headerBg}
            textAlign="center"
          />
        </Table.Row>
      </Table.Header>
    );
  }
  private renderBody() {
    const { request, readOnly, t } = this.props;
    const dataTable: IBudgetAllocationItemsModel[] =
      request.budgetAllocationItems;
    if (request.budgetAllocationItems.length === 0 && !readOnly) {
      request.addBudgetAllocationItem(BudgetAllocationItemsModel.create({}));
      request.addBudgetAllocationItem(BudgetAllocationItemsModel.create({}));
      request.addBudgetAllocationItem(BudgetAllocationItemsModel.create({}));
    }
    return (
      <Table.Body>
        {dataTable.map((item: IBudgetAllocationItemsModel, index: number) => {
          return (
            <Table.Row key={index}>
              <Table.Cell style={styles.tableCell}>{`${index +
                1}.`}</Table.Cell>
              <Table.Cell style={styles.tableCell}>
                {/* <Form.TextArea placeholder="Value" /> */}
                <Form.Input
                  placeholder={t(
                    "module.loan.budgetAllocationItem.specifyDetails"
                  )}
                  onChange={(event: any, data: any) => {
                    item!.setField({
                      fieldname: "description",
                      value: data.value
                    });
                  }}
                  readOnly={readOnly}
                  value={item.description}
                />
              </Table.Cell>
              <Table.Cell style={styles.tableCell}>
                <Form.Field
                  id={`input-budget-allocation-items-cost-${index}`}
                  control={CurrencyInput}
                  readOnly={readOnly}
                  value={item.cost}
                  onChangeInputField={(fieldname: string, value: string) => {
                    item!.setField({
                      fieldname,
                      value
                    });
                  }}
                  fieldName={"cost"}
                />
              </Table.Cell>
              <Table.Cell style={styles.tableCell}>
                <InputButton
                  id={`input-budget-allocation-items-quality-${index}`}
                  type="number"
                  placeholder="0"
                  fieldName={"quality"}
                  value={item.quality}
                  onChangeInputField={async (fieldname: string, value: any) => {
                    await item!.setField({
                      fieldname,
                      value: +value
                    });
                    await item.setFieldSubTotal();
                  }}
                  onClickPlus={() => item.addQuality()}
                  onClickMinus={() => item.reduceQuality()}
                  readOnly={readOnly}
                />
              </Table.Cell>
              <Table.Cell style={styles.tableCell} textAlign="right">
                {t("module.loan.budgetAllocationItem.totalItemBaht", {
                  total: currency(item.totalItem)
                })}
              </Table.Cell>
              <Table.Cell style={styles.tableCell} textAlign="right">
                {readOnly ? null : (
                  <Icon
                    name={"trash alternate outline"}
                    link
                    onClick={item.onRemove}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    );
  }
  private renderFooter() {
    const { request, t } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell style={styles.headerFt} />
          <Table.HeaderCell style={styles.headerFtError}>
            {request.checkTotalBudgetAllocationItems ? (
              <Header color="red">
                {t(
                  "module.loan.budgetAllocationItem.estimatedCostLessAmountRequested"
                )}
              </Header>
            ) : null}
          </Table.HeaderCell>
          <Table.HeaderCell style={styles.headerFt} textAlign="right">
            {t("module.loan.budgetAllocationItem.totalAmount")}
          </Table.HeaderCell>
          <Table.HeaderCell
            style={styles.headerFt}
            colSpan="3"
            textAlign="right"
          >
            {t("module.loan.budgetAllocationItem.totalItemBaht", {
              total: currency(request.totalBudgetAllocationItems)
            })}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }
}
const styles: any = {
  container: {
    marginBottom: 7
  },
  headerBg: {
    background: "none",
    borderBottom: "none"
  },
  headerFtError: {
    background: "none"
  },
  headerFt: {
    background: "none"
  },
  tableCell: {
    borderTop: "none"
  }
};
export default withTranslation()(BudgetAllocationItem);
