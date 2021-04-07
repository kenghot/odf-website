import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Radio,
  Segment,
  SemanticCOLORS,
  Statistic,
  TextArea,
  Input,
} from "semantic-ui-react";
import { IAppModel, IEnumItemModel } from "../../../AppModel";
import { FormDisplay } from "../../../components/common";
import { StatusBlock } from "../../../components/common/block";
import { Loading } from "../../../components/common/loading";
import { PermissionControl } from "../../../components/permission";
import FormModal from "../../../modals/FormModal";
import { date_display_CE_TO_BE } from "../../../utils";
import { currency } from "../../../utils/format-helper";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IAccountReceivableHeader extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  accountReceivableStatus: string;
  disableEditBtn?: boolean;
  hideActionButtons?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AccountReceivableHeader extends React.Component<IAccountReceivableHeader> {
  public state = { openheader: false, selected: "" };
  public componentDidMount() {
    const { accountReceivableStatus } = this.props;
    this.setState({ selected: accountReceivableStatus });
  }
  public async componentDidUpdate(prevProps: any) {
    if (this.props.accountReceivableStatus !== prevProps.accountReceivableStatus) {
      const { accountReceivableStatus } = this.props;
      this.setState({ selected: accountReceivableStatus });
    }
  }
  public render() {
    return (
      <React.Fragment>
        <Grid columns="equal">
          <Grid.Row verticalAlign="top">{this.renderTitleRow()}</Grid.Row>
          <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
          <Grid.Row>{this.renderPrintButtonRow()}</Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
  public renderTitleRow() {
    const { t, accountReceivable, disableEditBtn, appStore } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={
              disableEditBtn ? (
                <React.Fragment>
                  {t("module.accountReceivable.accountReceivableHeader.arName")}
                  <Input
                    style={styles.input}
                    size="mini"
                    placeholder={t("module.accountReceivable.accountReceivableHeader.specifyName")}
                    onChange={(event: any, data: any) =>
                      accountReceivable.setField({
                        fieldname: "name",
                        value: data.value,
                      })
                    }
                    value={accountReceivable.name}
                  />
                </React.Fragment>
              ) : (
                t("module.accountReceivable.accountReceivableHeader.accountsReceivableIDCard", {
                  idCard: accountReceivable.name || "-",
                })
              )
            }
            subheader={t("module.accountReceivable.accountReceivableHeader.accountsReceivableNo", {
              documentNumber: accountReceivable.documentNumber || "-",
            })}
          />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <StatusBlock
            label={appStore!.enumItemLabel("accountReceivableStatus", accountReceivable.status)}
            color={this.getStatusColor()}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  public renderHeaderRow() {
    const { t, accountReceivable, hideActionButtons } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.loan.agreementCardInfo.byOrganization")}
                value={accountReceivable.organization.orgName || "-"}
                width={3}
              />
              <FormDisplay
                width={3}
                title={t("module.accountReceivable.accountReceivableDetail.accountOpeningDate")}
                value={date_display_CE_TO_BE(accountReceivable.documentDate) || "-"}
              />
              <FormDisplay
                width={3}
                title={t("module.accountReceivable.accountReceivableHeader.internalReferenceNumber")}
                value={accountReceivable.internalRef || "-"}
              />
              <FormDisplay
                width={3}
                title={"Reference 1"}
                value={
                  accountReceivable.agreement.agreementItems.length > 0
                    ? accountReceivable.agreement.agreementItems[0].borrower.idCardNo
                    : "-"
                }
              />
              <FormDisplay width={3} title={"Reference 2"} value={accountReceivable.agreement.ref2ArLabel || "-"} />
              <Form.Field width={1}>
                <Icon
                  name={this.state.openheader ? "angle up" : "angle down"}
                  style={styles.button}
                  onClick={() => {
                    this.setState({ openheader: !this.state.openheader });
                  }}
                />
              </Form.Field>
            </Form.Group>
            {this.state.openheader ? (
              <Form.Group widths="equal">
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.madeBy")}
                  value={accountReceivable.createdByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.createdWhen")}
                  value={date_display_CE_TO_BE(accountReceivable.createdDate)}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.lastEditedBy")}
                  value={accountReceivable.updatedByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.editWhen")}
                  value={date_display_CE_TO_BE(accountReceivable.updatedDate) || "-"}
                />
              </Form.Group>
            ) : null}

            {hideActionButtons ? null : this.renderActionButtons()}
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
  public renderActionButtons() {
    const { accountReceivable, disableEditBtn, t } = this.props;
    return (
      <div style={styles.row}>
        <PermissionControl codes={["AR.CLOSE"]}>{this.renderAdjustButtons()}</PermissionControl>
        <PermissionControl codes={["AR.EDIT"]}>
          <Link to={`/account_receivable/edit/${accountReceivable.id}/${accountReceivable.documentNumber}`}>
            <Button floated="right" color="blue" disabled={disableEditBtn}>
              {t("module.accountReceivable.accountReceivableHeader.editAccount")}
            </Button>
          </Link>
        </PermissionControl>
      </div>
    );
  }
  public renderAdjustButtons() {
    const { accountReceivable, t, appStore } = this.props;
    const selectList = appStore!
      .enumItems("accountReceivableStatus")
      .filter((item: IEnumItemModel) => ["11", "33"].includes(item.value!.toString()));
    return (
      <FormModal
        disabled={!["11", "33"].includes(this.state.selected)}
        trigger={
          <Button basic color="red" floated="left">
            {t("module.accountReceivable.accountReceivableHeader.redBtn")}
          </Button>
        }
        title={t("module.accountReceivable.accountReceivableHeader.title")}
        buttonLabel={t("module.accountReceivable.accountReceivableHeader.confirmAccountClosing")}
        onSubmit={this.state.selected ? this.onARClose : undefined}
        style={{ display: "inline" }}
      >
        <Segment>
          <Loading active={accountReceivable.loading} />
          <Statistic style={{ textAlign: "center", display: "block" }}>
            <Statistic.Label>{t("module.accountReceivable.accountReceivableHeader.outstandingDebt")}</Statistic.Label>
            <Statistic.Value>{currency(accountReceivable.outstandingDebtBalance)}</Statistic.Value>
            <Statistic.Label>{t("module.accountReceivable.accountReceivableHeader.baht")}</Statistic.Label>
          </Statistic>
          <Form.Group>
            {selectList.map((item: any, index: number) => (
              <React.Fragment key={index}>
                <Form.Field
                  control={Radio}
                  label={item.text}
                  value={item.value}
                  onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                    this.setState({ selected: data.value })
                  }
                  checked={this.state.selected === item.value}
                />
              </React.Fragment>
            ))}
          </Form.Group>
          {this.state.selected === "11" ? (
            <Form.Field error label={t("module.accountReceivable.accountReceivableHeader.arStatusLabel")} />
          ) : null}
          <Form.Field
            control={TextArea}
            label={t("module.accountReceivable.accountReceivableHeader.textTitle")}
            value={accountReceivable.comments}
            placeholder={t("module.accountReceivable.accountReceivableHeader.textPlaceholder")}
            onChange={(event: any, data: any) => this.onChangeInputField("comments", data.value)}
          />
        </Segment>
      </FormModal>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { accountReceivable } = this.props;
    accountReceivable.setField({ fieldname, value });
  };
  public renderPrintButtonRow() {
    const { t } = this.props;
    return (
      <Grid.Column>
        <Button width={7} floated="right" color="pink" onClick={this.onPrintArPage}>
          <Icon name="print" />
          {t("module.accountReceivable.accountReceivableHeader.printAr")}
        </Button>
      </Grid.Column>
    );
  }
  private onPrintArPage = async () => {
    const { accountReceivable } = this.props;
    try {
      await accountReceivable.printForm();
    } catch (e) {
      throw e;
    }
  };
  private onARClose = async () => {
    const { accountReceivable } = this.props;
    try {
      if (this.state.selected) {
        await accountReceivable.closeAccountReceivable(this.state.selected);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  private getStatusColor(): SemanticCOLORS {
    const { accountReceivable } = this.props;
    switch (accountReceivable.status) {
      case "10":
        return "blue";
      case "20":
        return "orange";
      case "30":
        return "red";
      case "11":
        return "grey";
      case "33":
        return "grey";
      default:
        return "blue";
    }
  }
}

const styles: any = {
  icon: {
    cursor: "default",
  },
  row: {
    display: "flow-root",
  },
  input: {
    margin: "7px",
  },
};
export default withTranslation()(AccountReceivableHeader);
