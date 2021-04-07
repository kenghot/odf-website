import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Popup, Table } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { EmptyTableRow, SubSectionContainer } from "../../../components/common";
import { ARStatusIcon } from "../../../components/project";
import { dateTime_display_CE_TO_BE } from "../../../utils";
import { currency, date_display_CE_TO_BE } from "../../../utils/format-helper";
import {
  IAccountReceivableControlModel,
  IAccountReceivableModel
} from "../AccountReceivableModel";

interface IAccountReceivableControlTable
  extends WithTranslation,
    RouteComponentProps {
  accountReceivable: IAccountReceivableModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class AccountReceivableControlTable extends React.Component<
  IAccountReceivableControlTable
> {
  public render() {
    const { t } = this.props;
    return (
      <SubSectionContainer
        stretch
        fluid
        basic
        title={t(
          "module.accountReceivable.accountReceivableControlTable.title"
        )}
        style={styles.container}
      >
        <Table striped size="small" role="grid" aria-labelledby="header">
          {this.renderTableHeader()}
          {this.renderTableBody()}
        </Table>
      </SubSectionContainer>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header style={styles.tableHeader}>
        <Table.Row style={styles.tableRow}>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.asOfDate"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.sourceARTTotalPaidAmount"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.outstandingDebtBalance"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.overDueBalance"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.expectedPaidTimes"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.sourceARTLastPaidDate"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableControlTable.paidPercentage"
            )}
          </Table.HeaderCell>
          <Popup
            wide="very"
            size="tiny"
            position="left center"
            trigger={
              <Table.HeaderCell textAlign="center" singleLine>
                {t(
                  "module.accountReceivable.accountReceivableTable.repaymentStatus"
                )}
                <Icon color="teal" name="question circle" style={styles.icon} />
              </Table.HeaderCell>
            }
          >
            <Popup.Header>
              {t("module.debtCollection.debtCollectionTable.repaymentStatus")}
            </Popup.Header>
            <Popup.Content>
              {this.renderContentPopupCreditStatus()}
            </Popup.Content>
          </Popup>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderContentPopupCreditStatus() {
    const { appStore } = this.props;
    const list = appStore!.enumItems("creditStatus");
    return list.length > 0 ? (
      <List size="tiny">
        {list.map((data: any, index: number) => {
          return (
            <List.Item key={index}>
              <List horizontal>
                <List.Item>
                  <ARStatusIcon size="tiny" value={`${data.value}`} />
                </List.Item>
                <List.Item>{`${data.text}`}</List.Item>
              </List>
            </List.Item>
          );
        })}
      </List>
    ) : (
      "-"
    );
  }

  private renderTableBody() {
    const { accountReceivable, t } = this.props;
    const dataTable = accountReceivable.controls;
    return (
      <Table.Body style={styles.tableBody}>
        {dataTable.length > 0 ? (
          dataTable.map(
            (data: IAccountReceivableControlModel, index: number) => {
              return (
                <Table.Row key={index} style={styles.tableRow}>
                  <Table.Cell singleLine>
                    {this.checkEmptyText(
                      dateTime_display_CE_TO_BE(data.asOfDate, true)
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.checkEmptyText(
                      currency(data.sourceARTTotalPaidAmount, 2)
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.checkEmptyText(
                      currency(data.outstandingDebtBalance, 2)
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.checkEmptyText(currency(data.overDueBalance, 2))}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.checkEmptyText(data.expectedPaidTimes)}
                  </Table.Cell>
                  <Table.Cell>
                    {data.sourceARTLastPaidDate
                      ? date_display_CE_TO_BE(data.sourceARTLastPaidDate, true)
                      : t(
                          "module.accountReceivable.accountReceivableControlTable.notSourceARTLastPaidDate"
                        )}
                  </Table.Cell>

                  <Table.Cell textAlign="right">
                    {data.paidRatioLabel}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <ARStatusIcon value={data.status} />
                  </Table.Cell>
                </Table.Row>
              );
            }
          )
        ) : (
          <EmptyTableRow style={styles.tableRow} />
        )}
      </Table.Body>
    );
  }
  private checkEmptyText = (value: any) => {
    return value || value === 0 ? value : "-";
  };
}
const styles: any = {
  container: {
    marginTop: 7,
    display: "block"
  },
  link: {
    textDecoration: "underline",
    cursor: "pointer"
  },
  tableHeader: {
    display: "table",
    width: "100%",
    tableLayout: "fixed"
  },
  tableRow: {
    display: "table",
    width: "100%",
    tableLayout: "fixed"
  },
  tableBody: {
    display: "block",
    maxHeight: 380,
    overflow: "auto",
    width: "100%",
    tableLayout: "fixed"
  },
  icon: {
    marginRight: 0,
    marginLeft: 4
  }
};
export default withRouter(withTranslation()(AccountReceivableControlTable));
