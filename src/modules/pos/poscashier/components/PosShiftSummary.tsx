import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Message, Segment, SemanticCOLORS } from "semantic-ui-react";
import {
  PosDetailSummary,
  PosShiftSummaryHeader,
  PosShiftSummaryListEdit,
  PosShiftSummaryListView
} from ".";
import { ErrorMessage } from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { COLORS } from "../../../../constants";
import { IPosModel, IPosShiftModel } from "../../PosModel";
import { IPosShiftLogListModel } from "../../PosShiftLogListModel";

interface IPosShiftSummary extends WithTranslation {
  pos: IPosModel;
  targetPosShift?: IPosShiftModel;
  targetPosShiftLogList?: IPosShiftLogListModel;
  color?: SemanticCOLORS;
}

@inject("targetPosShift", "targetPosShiftLogList")
@observer
class PosShiftSummary extends React.Component<IPosShiftSummary> {
  public render() {
    const {
      t,
      pos,
      color,
      targetPosShift,
      targetPosShiftLogList
    } = this.props;
    return (
      <React.Fragment>
        <Loading active={targetPosShift!.loading} />
        <ErrorMessage errorobj={targetPosShift!.error} float timeout={5000} />
        <Loading active={targetPosShiftLogList!.loading} />
        <ErrorMessage
          errorobj={targetPosShiftLogList!.error}
          float
          timeout={5000}
        />
        <Segment.Group style={styles.segmentGroup}>
          <PosDetailSummary
            pos={pos}
            color={color}
            headerLabel1={t("module.pos.posShiftSummaryHeader.contentHeader")}
            headerLabel2={t("module.pos.posShiftSummaryHeader.subHeader")}
            headerColor={COLORS.teal}
            children={this.renderChildren()}
            hideHeader={pos.historyDisplay}
          />
        </Segment.Group>
      </React.Fragment>
    );
  }

  private renderChildren() {
    const { t, pos, targetPosShift, targetPosShiftLogList } = this.props;
    return targetPosShift!.id ? (
      <React.Fragment>
        <PosShiftSummaryHeader posShift={targetPosShift!} />
        {!pos.historyDisplay && pos.isOnline ? (
          <PosShiftSummaryListEdit
            fromPos
            pos={pos}
            posShiftLogList={targetPosShiftLogList!}
          />
        ) : (
            <PosShiftSummaryListView
              fromPos
              posShiftLogList={targetPosShiftLogList!}
            />
          )}
      </React.Fragment>
    ) : (
        <Segment padded basic>
          <Message
            icon="exclamation triangle"
            header={
              pos.isOnline
                ? t("module.pos.posShiftSummary.headerMessage")
                : t("module.pos.posShiftSummary.headerMessageOffline")
            }
          />
        </Segment>
      );
  }
}
const styles: any = {
  segmentGroup: {
    margin: 0,
    border: 0,
    boxShadow: "none"
  }
};
export default withTranslation()(PosShiftSummary);
