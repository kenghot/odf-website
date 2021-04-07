import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Form,
  Grid,
  Header,
  Icon,
  List,
  Popup,
  Segment,
  Button
} from "semantic-ui-react";
import { DebtCollectionStepIcon } from ".";
import { IAppModel } from "../../../AppModel";
import { FormDisplay } from "../../../components/common";
import { PermissionControl } from "../../../components/permission";
import { ARStatusIcon } from "../../../components/project";
import { M241DebtAcknowledgementModal } from "../../../modals";
import { date_display_CE_TO_BE } from "../../../utils";
import { IDebtCollectionModel } from "../DebtCollectionModel";
import { Link } from "react-router-dom";

interface IDebtCollectionHeader extends WithTranslation {
  debtCollection: IDebtCollectionModel;
  disableEditBtn?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DebtCollectionHeader extends React.Component<IDebtCollectionHeader> {
  public state = { openheader: false };
  public render() {
    return (
      <Grid columns="equal" style={styles.header}>
        <Grid.Row verticalAlign="top">{this.renerTitleRow()}</Grid.Row>
        <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
      </Grid>
    );
  }
  private renerTitleRow() {
    const { t, debtCollection } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={t(
              "module.debtCollection.debtCollectionHeader.accountsReceivableIDCard",
              {
                idCard: debtCollection.accountReceivable.name || "-"
              }
            )}
            subheader={t(
              "module.debtCollection.debtCollectionHeader.accountsReceivableNo",
              {
                documentNumber:
                  debtCollection.accountReceivable.documentNumber || "-"
              }
            )}
          />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <DebtCollectionStepIcon
            border
            title={t("module.debtCollection.debtCollectionHeader.dunningPhase")}
            step={debtCollection.step || 0}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  private renderHeaderRow() {
    const { t, debtCollection, appStore } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form>
            <Form.Group widths="equal">
              <FormDisplay
                title={t(
                  "module.debtCollection.debtCollectionHeader.startOverdueDate"
                )}
                value={
                  date_display_CE_TO_BE(
                    debtCollection.accountReceivable.startOverdueDate,
                    true
                  ) || "-"
                }
              />
              <FormDisplay
                title={t(
                  "module.debtCollection.debtCollectionHeader.caseExpirationDate"
                )}
                value={
                  date_display_CE_TO_BE(
                    debtCollection.accountReceivable.caseExpirationDate,
                    true
                  ) || "-"
                }
              />

              <FormDisplay
                title={t(
                  "module.debtCollection.debtCollectionHeader.startDateTrackingProcess"
                )}
                value={date_display_CE_TO_BE(debtCollection.createdDate, true)}
              />

              <FormDisplay
                title={t("module.debtCollection.debtCollectionHeader.arStatus")}
                value={`${
                  debtCollection.accountReceivable.status
                } - ${appStore!.enumItemLabel(
                  "accountReceivableStatus",
                  debtCollection.accountReceivable.status
                )}`}
              />

              <Popup
                wide="very"
                size="tiny"
                trigger={
                  <Form.Field>
                    <label>
                      {t(
                        "module.debtCollection.debtCollectionHeader.controlStatus"
                      )}
                      <Icon name="question circle" style={styles.iconStatus} />
                    </label>
                    <ARStatusIcon
                      value={debtCollection.accountReceivable.control.status}
                    />
                  </Form.Field>
                }
              >
                <Popup.Header>
                  {t(
                    "module.debtCollection.debtCollectionHeader.controlStatus"
                  )}
                </Popup.Header>
                <Popup.Content>{this.renderContentPopup()}</Popup.Content>
              </Popup>
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
                  value={debtCollection.createdByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.createdWhen")}
                  value={date_display_CE_TO_BE(debtCollection.createdDate)}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.lastEditedBy")}
                  value={debtCollection.updatedByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.editWhen")}
                  value={
                    date_display_CE_TO_BE(debtCollection.updatedDate) || "-"
                  }
                />
              </Form.Group>
            ) : null}
          </Form>
          <PermissionControl codes={["DEBTCOLLECTION.DEBTACKNOWLEDGE"]}>
            {this.renderActionButtons()}
          </PermissionControl>
        </Segment>
      </Grid.Column>
    );
  }
  private renderActionButtons() {
    const { t, debtCollection, disableEditBtn } = this.props;
    return (
      <React.Fragment>
        <div style={styles.cancelBtn}>
          <M241DebtAcknowledgementModal
            debtCollection={debtCollection}
            trigger={
              <Form.Button basic color="red" type="button">
                {t("module.debtCollection.debtCollectionHeader.receiveDebt")}
              </Form.Button>
            }
          />
        </div>
        {!disableEditBtn ? (
          <PermissionControl codes={["DEBTCOLLECTION.EDIT"]}>
            <Link to={`/debtCollection/edit/${debtCollection.id}`}>
              <Button width={5} floated="right" color="blue">
                {t("module.debtCollection.debtCollectionHeader.editButton")}
              </Button>
            </Link>
          </PermissionControl>
        ) : null}
      </React.Fragment>
    );
  }

  private renderContentPopup() {
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
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  icon: {
    cursor: "default"
  },
  cancelBtn: {
    display: "inline-flex"
  },
  button: {
    cursor: "pointer"
  },
  segment: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0
  },
  m113Style: {
    display: "inline"
  },
  iconStatus: {
    marginRight: 0,
    marginLeft: 4
  }
};
export default withTranslation()(DebtCollectionHeader);
