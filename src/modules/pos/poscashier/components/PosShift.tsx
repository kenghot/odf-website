import { observer, inject } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Breadcrumb, Button, Icon, Segment } from "semantic-ui-react";
import { PosShiftControl, PosShiftHistoryTable } from ".";
import { Text } from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { PosRequestReceipt } from "../../../receiptcontrol/components";
import { IPosModel, IPosShiftModel } from "../../PosModel";
import { IPosShiftListModel } from "../../PosShiftListModel";
import { IPosShiftLogListModel } from "../../PosShiftLogListModel";

interface IPosShift extends WithTranslation {
  pos: IPosModel;
  posShiftList: IPosShiftListModel;
  targetPosShift?: IPosShiftModel;
  targetPosShiftLogList?: IPosShiftLogListModel;
}

@inject("targetPosShift", "targetPosShiftLogList")
@observer
class PosShift extends React.Component<IPosShift> {
  public async componentDidMount() {
    const {
      pos,
      targetPosShift,
      targetPosShiftLogList,
    } = this.props;
    try {
      if (pos.isOnline) {
        if (pos.lastestPosShift) {
          this.setTargetPOSShift(pos.lastestPosShift.id);
        }
      } else {
        await targetPosShift!.resetAll();
        await targetPosShiftLogList!.resetAll();
      }
    } catch (e) {
      console.log(e);
    }
  }
  public render() {
    const { pos } = this.props;
    return (
      <React.Fragment>
        {pos.historyDisplay
          ? this.renderPOSShiftHistory()
          : this.renderPOSInfo()}
      </React.Fragment>
    );
  }

  private renderPOSInfo() {
    const { t, pos } = this.props;
    return (
      <React.Fragment>
        <PermissionControl codes={["POS.RECEIPTCONTROLS.REQUEST"]}>
          <PosRequestReceipt fluid pos={pos} fromPos />
        </PermissionControl>
        <PermissionControl codes={["POS.USAGE.CONTROL.SHIFT"]}>
          <PosShiftControl pos={pos} />
        </PermissionControl>

        <PermissionControl codes={["POS.SHIFTHISTORY.VIEW"]}>
          <Segment basic textAlign="center" style={styles.segment}>
            <Button
              fluid
              color="blue"
              size="large"
              onClick={() => this.onShowPOSShiftHistory()}
            >
              <Icon name="calendar alternate outline" style={styles.icon} />
              {t("module.pos.posShift.buttonClose")}
            </Button>
          </Segment>
        </PermissionControl>
      </React.Fragment>
    );
  }
  private renderPOSShiftHistory() {
    const {
      t,
      pos,
      posShiftList,
    } = this.props;
    return (
      <React.Fragment>
        <Breadcrumb size={"large"}>
          <Breadcrumb.Section onClick={() => this.onHidePOSShiftHistory()}>
            <Text shade={3}>{t("module.pos.posShift.breadcrumb")}</Text>
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section>
            <Text shade={5} size="big">
              {t("module.pos.posShift.breadcrumbSection")}
            </Text>
          </Breadcrumb.Section>
        </Breadcrumb>
        <PosShiftHistoryTable
          pos={pos}
          posShiftList={posShiftList}
        />
      </React.Fragment>
    );
  }

  private onShowPOSShiftHistory = async () => {
    const { posShiftList, targetPosShift, targetPosShiftLogList, pos } = this.props;
    try {
      await posShiftList.load_data(pos.id);
      await pos.setField({ fieldname: "historyDisplay", value: true });
      if (posShiftList && posShiftList.total > 0) {
        this.setTargetPOSShift(posShiftList.list[0].id);
      }
      else {
        await targetPosShift!.resetAll();
        await targetPosShiftLogList!.resetAll();
      }
    } catch (error) {
      console.log(error);
    }
  };
  private onHidePOSShiftHistory = async () => {
    const { targetPosShift, targetPosShiftLogList, pos } = this.props;
    try {
      await pos.setField({ fieldname: "historyDisplay", value: false });
      if (pos.isOnline && pos.lastestPosShift) {
        this.setTargetPOSShift(pos.lastestPosShift.id);
      } else {
        await targetPosShift!.resetAll();
        await targetPosShiftLogList!.resetAll();
      }
    } catch (error) {
      console.log(error);
    }
  };
  private setTargetPOSShift = async (posShiftId: number) => {
    const { targetPosShift, targetPosShiftLogList } = this.props;
    await targetPosShift!.setField({
      fieldname: "id",
      value: posShiftId
    });
    await targetPosShift!.getPosShiftDetail();
    await targetPosShiftLogList!.setField({
      fieldname: "posShiftId",
      value: posShiftId
    });
    await targetPosShiftLogList!.load_data();

  }
}

const styles: any = {
  icon: {
    marginRight: 7
  },
  segment: {
    paddingLeft: 0,
    paddingRight: 0
  }
};

export default withTranslation()(PosShift);
