import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Comment,
  Icon,
  Label,
  Message,
  Segment
} from "semantic-ui-react";
import { PosShiftSummaryItem } from ".";
import { Text } from "../../../../components/common";
import { M35402CloseShiftModal } from "../../../../modals";
import { IPosModel, IPosShiftLogsModel } from "../../PosModel";
import { IPosShiftLogListModel } from "../../PosShiftLogListModel";
import { PermissionControl } from "../../../../components/permission";

interface IPosShiftSummaryListEdit extends WithTranslation {
  posShiftLogList: IPosShiftLogListModel;
  pos: IPosModel;
  fromPos?: boolean;
  scrolling?: boolean;
}

@observer
class PosShiftSummaryListEdit extends React.Component<
  IPosShiftSummaryListEdit
> {
  public render() {
    const { t, posShiftLogList, scrolling, fromPos } = this.props;
    return (
      <React.Fragment>
        <Segment style={styles.segment}>
          <Text size="small">
            {t("module.pos.posShiftSummaryListView.contentHeader")}
          </Text>
        </Segment>
        <Segment
          padded
          style={scrolling ? styles.segmentListScrolling : styles.segmentList}
        >
          <Comment.Group threaded style={styles.commentGroup}>
            {posShiftLogList.list.length > 0 ? (
              <React.Fragment>
                {posShiftLogList.list.map(
                  (data: IPosShiftLogsModel, index: number) => {
                    return (
                      <PosShiftSummaryItem
                        posShiftLog={data}
                        key={index}
                        lastIndex={
                          this.props.posShiftLogList.list.length - 1 === index
                        }
                        childrenLastIndex={
                          posShiftLogList.list.length > 0 &&
                          posShiftLogList.total > posShiftLogList.perPage ? (
                            <Comment style={styles.buttonMore}>
                              <Button
                                color="blue"
                                fluid
                                onClick={() => posShiftLogList.load_data_more()}
                              >
                                {t("module.pos.posShiftSummaryListView.button")}
                              </Button>
                            </Comment>
                          ) : (
                            <br />
                          )
                        }
                      />
                    );
                  }
                )}
                {this.renderButtonAddShiftLog()}
              </React.Fragment>
            ) : (
              <Message
                icon="inbox"
                header={t("module.pos.posShiftSummaryListView.messageHeader")}
                content={t("module.pos.posShiftSummaryListView.messageContent")}
              />
            )}
            <br />
          </Comment.Group>
        </Segment>
      </React.Fragment>
    );
  }

  private renderButtonAddShiftLog() {
    const { t, pos } = this.props;
    return (
      <React.Fragment>
        <Comment>
          <div className="avatar">
            <Label size="massive" circular color="teal">
              <Icon name="plus" style={styles.icon} />
            </Label>
          </div>
          <Comment.Content style={styles.commentContent}>
            <br />
            <br />
            <br />
            <br />
          </Comment.Content>
        </Comment>
        <PermissionControl codes={["POS.USAGE.CONTROL.SHIFT"]}>
          <Comment style={styles.buttonClose}>
            <M35402CloseShiftModal
              pos={pos}
              trigger={
                <Button color="teal" fluid>
                  {t("module.pos.posShiftControl.offline")}
                </Button>
              }
            />
          </Comment>
        </PermissionControl>
      </React.Fragment>
    );
  }
}
const styles: any = {
  segment: {
    paddingTop: 7,
    paddingBottom: 7,
    textAlign: "center"
  },
  segmentList: {
    paddingTop: 28
  },
  segmentListScrolling: {
    paddingTop: 28,
    maxHeight: 480,
    overflowY: "scroll"
  },
  buttonMore: {
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 14
  },
  buttonClose: {
    paddingTop: 28
  },
  commentContent: {
    marginLeft: 60
  },
  icon: {
    marginRight: 0
  },
  commentGroup: {
    maxWidth: "initial"
  }
};
export default withTranslation()(PosShiftSummaryListEdit);
