import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Comment, Message, Segment } from "semantic-ui-react";
import { PosShiftSummaryItem } from ".";
import { Text } from "../../../../components/common";
import { IPosShiftLogsModel } from "../../PosModel";
import { IPosShiftLogListModel } from "../../PosShiftLogListModel";

interface IPosShiftSummaryListView extends WithTranslation {
  posShiftLogList: IPosShiftLogListModel;
  fromPos?: boolean;
  scrolling?: boolean;
}

@observer
class PosShiftSummaryListView extends React.Component<
  IPosShiftSummaryListView
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
              posShiftLogList.list.map(
                (data: IPosShiftLogsModel, index: number) => {
                  return (
                    <PosShiftSummaryItem
                      posShiftLog={data}
                      key={index}
                      lastIndex={
                        this.props.posShiftLogList.list.length - 1 === index
                      }
                    />
                  );
                }
              )
            ) : (
              <Message
                icon="inbox"
                header={t("module.pos.posShiftSummaryListView.messageHeader")}
                content={t("module.pos.posShiftSummaryListView.messageContent")}
              />
            )}
            {posShiftLogList.list.length > 0 &&
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
            )}
          </Comment.Group>
        </Segment>
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
  commentGroup: {
    maxWidth: "initial"
  }
};
export default withTranslation()(PosShiftSummaryListView);
