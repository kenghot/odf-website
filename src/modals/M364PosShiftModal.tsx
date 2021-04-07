import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Modal, Segment } from "semantic-ui-react";
import { AlertMessage, ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { COLORS } from "../constants";
import {
  PosShiftSummaryHeader,
  PosShiftSummaryListView
} from "../modules/pos/poscashier/components";
import { PosShiftModel } from "../modules/pos/PosModel";
import { PosShiftLogListModel } from "../modules/pos/PosShiftLogListModel";

interface IM364PosShiftModal extends WithTranslation {
  trigger?: any;
  id?: string;
}

@observer
class M364PosShiftModal extends React.Component<IM364PosShiftModal> {
  public state = {
    open: false
  };
  public posShift = PosShiftModel.create({});
  public posShiftLogList = PosShiftLogListModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.posShift.resetAll();
  };
  public open = async () => {
    this.setState({ open: true });
    if (this.props.id) {
      await this.posShift.setField({ fieldname: "id", value: this.props.id });
      await this.posShift.getPosShiftDetail();
      await this.posShiftLogList.setField({
        fieldname: "posShiftId",
        value: this.props.id
      });
      await this.posShiftLogList.load_data();
    }
  };
  public render() {
    const { t, trigger } = this.props;
    const { open } = this.state;

    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M364PosShiftModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <AlertMessage
            messageobj={this.posShift.alert}
            float={true}
            timeout={3000}
          />
          <Loading active={this.posShift.loading} />
          <ErrorMessage
            errorobj={this.posShift.error}
            float={true}
            timeout={10000}
          />
          {this.renderContent()}
        </Modal.Content>
      </Modal>
    );
  }

  private renderContent() {
    const { t } = this.props;
    return (
      <Segment.Group>
        <Segment style={styles.segment}>
          <Header size="medium">
            <Header.Content style={styles.header}>
              {t("module.pos.posShiftSummaryHeader.contentHeader")}
              <Header.Subheader style={styles.header}>
                {t("module.pos.posShiftSummaryHeader.subHeader")}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <PosShiftSummaryHeader posShift={this.posShift} />
        <PosShiftSummaryListView posShiftLogList={this.posShiftLogList} />
      </Segment.Group>
    );
  }
}
const styles: any = {
  segment: {
    background: COLORS.teal
  },
  header: {
    color: COLORS.white
  }
};

export default withTranslation()(M364PosShiftModal);
