import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link as LinkRouterDom } from "react-router-dom";
import { Button, Grid, Header, Modal, Segment } from "semantic-ui-react";
import {
  AlertMessage,
  AttachedFile,
  ErrorMessage,
  Link,
  SubSectionContainer,
} from "../components/common";
import { Loading } from "../components/common/loading";
import { COLORS, FILES_PATH } from "../constants";
import { IAuthModel } from "../modules/auth/AuthModel";
import { IDonationAllowanceListModel } from "../modules/donation/DonationAllowanceListModel";
import { PosShiftModel } from "../modules/pos/PosModel";
import { PosShiftLogListModel } from "../modules/pos/PosShiftLogListModel";

interface IDonationInfoAttachedFileModal extends WithTranslation {
  trigger?: any;
  id?: string;
  donationAllowanceListStore: IDonationAllowanceListModel;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class DonationInfoAttachedFileModal extends React.Component<IDonationInfoAttachedFileModal> {
  public state = {
    open: false,
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
        value: this.props.id,
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
            {t("modal.DonationInfoAttachedFileModal.header")}
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
    const { t, donationAllowanceListStore } = this.props;
    return (
      <Segment basic style={{ paddingTop: 0 }}>
        <Header
          size="medium"
          content={t("modal.DonationInfoAttachedFileModal.headerFile")}
        />
        <LinkRouterDom
          target="_blank"
          to={FILES_PATH.donationTempalte}
          download
        >
          <div style={styles.link}>
            <Link shade={5}>
              {"ไฟล์ข้อมูลผู้บริจาคเบี้ยยังชีพผู้สูงอายุ.xlsx"}
            </Link>
          </div>
        </LinkRouterDom>
        <SubSectionContainer
          basic
          fluid
          stretch
          title={t("modal.DonationInfoAttachedFileModal.headerAttachedFile")}
        >
          <AttachedFile
            mode={"edit"}
            files={donationAllowanceListStore.donation_file}
            addFile={(file: File) =>
              donationAllowanceListStore.setField({
                fieldname: "donation_allowance",
                value: file,
              })
            }
            removeFile={() =>
              donationAllowanceListStore.setField({
                fieldname: "donation_allowance",
                value: undefined,
              })
            }
          />
        </SubSectionContainer>
        <Grid columns={1}>
          <Grid.Column>
            <Button
              fluid
              color={"blue"}
              type="button"
              onClick={this.onSubmitButton}
            >
              {t("modal.DonationInfoAttachedFileModal.buttonYes")}
            </Button>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
  private onSubmitButton = async () => {
    const { donationAllowanceListStore, authStore } = this.props;
    try {
      await donationAllowanceListStore.uploadDonationFile(
        authStore!.userProfile.organization
      );
    } catch (e) {
      console.log(e);
    } finally {
      this.close();
    }
  };
}
const styles: any = {
  segment: {
    background: COLORS.teal,
  },
  header: {
    color: COLORS.white,
  },
  link: {
    cursor: "pointer",
    paddingBottom: "14px",
  },
};

export default withTranslation()(DonationInfoAttachedFileModal);
