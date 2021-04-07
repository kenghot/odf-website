import { observer, inject } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Comment, Grid, Label, List } from "semantic-ui-react";
import { Text } from "../../../../components/common";
import {
  currency,
  dateTime_display_CE_TO_BE
} from "../../../../utils/format-helper";
import { IPosShiftLogsModel } from "../../PosModel";
import { IAppModel } from "../../../../AppModel";

interface IPosShiftSummaryItem extends WithTranslation {
  lastIndex?: boolean;
  posShiftLog: IPosShiftLogsModel;
  childrenLastIndex?: any;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosShiftSummaryItem extends React.Component<IPosShiftSummaryItem> {
  public render() {
    const { t, lastIndex, posShiftLog, childrenLastIndex } = this.props;
    return (
      <Comment>
        <div className="avatar">
          <Label
            size="massive"
            circular
            color={posShiftLog.userColor || undefined}
          >
            {posShiftLog.createByLabel}
          </Label>
        </div>
        <Comment.Content style={styles.commentContent}>
          <Grid>
            <Grid.Row columns="equal">
              <Grid.Column width={4} verticalAlign="top">
                <Text shade={2}>{this.renderActionLabel()}</Text>
              </Grid.Column>
              <Grid.Column>
                <List>
                  <List.Item>{posShiftLog.createdByName || "-"}</List.Item>
                  <List.Item>
                    <Text size="small">
                      {dateTime_display_CE_TO_BE(posShiftLog.createdDate)}
                    </Text>
                  </List.Item>
                  {this.renderNote()}
                </List>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {["SWAPMNG", "LOGOUT", "LOGIN", ""].includes(
                  posShiftLog.action
                ) ? null : (
                  <List>
                    <List.Item>{posShiftLog.actionLabelCol4}</List.Item>
                    <List.Item>
                      {currency(posShiftLog.expectedDrawerAmount)}
                    </List.Item>
                  </List>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Comment.Content>
        {lastIndex ? null : (
          <Comment.Group style={styles.commentGroup}></Comment.Group>
        )}
        {lastIndex && childrenLastIndex ? (
          <Comment.Group style={styles.commentGroup}>
            {childrenLastIndex}
          </Comment.Group>
        ) : null}
      </Comment>
    );
  }

  private renderNote() {
    const { t, posShiftLog } = this.props;
    if (posShiftLog.note) {
      if (posShiftLog.refType && posShiftLog.refId) {
        return (
          <List.Item>
            <Text size="small" shade={2}>
              {t("module.pos.posShiftSummaryItem.note")}
              <Text style={styles.link} size="small" shade={5} underline>
                {`#${posShiftLog.note}`}
              </Text>
            </Text>
          </List.Item>
        );
      } else {
        return (
          <List.Item>
            <Text size="small" shade={2}>
              {posShiftLog.note}
            </Text>
          </List.Item>
        );
      }
    } else {
      return null;
    }
  }

  private renderActionLabel() {
    const { appStore, posShiftLog } = this.props;
    switch (posShiftLog.action) {
      case "ADD":
        return posShiftLog.transactionAmount
          ? `+${currency(posShiftLog.transactionAmount)}`
          : "";
      case "DROP":
        return posShiftLog.transactionAmount
          ? `-${currency(posShiftLog.transactionAmount)}`
          : "";
      default:
        return appStore!.enumItemLabel("posShiftLogAction", posShiftLog.action);
    }
  }
}
const styles: any = {
  commentContent: {
    marginLeft: 60
  },
  link: {
    cursor: "pointer"
  },
  commentGroup: {
    marginLeft: 25
  }
};
export default withTranslation()(PosShiftSummaryItem);
