import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import {
  AttachedFile,
  SubSectionContainer
} from "../../../../components/common";
import { IVoucherListModel } from "../VoucherListModel";

interface IUploadingKTBVoucher extends WithTranslation {
  //
  voucherListStore: IVoucherListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class UploadingKTBVoucher extends React.Component<IUploadingKTBVoucher> {
  public state = { open: false };
  public open = () => this.setState({ open: true });
  public close = () => this.setState({ open: false });
  public render() {
    const { voucherListStore, t } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.finance.UploadingKTBVoucher.uploadingFromKTB")}
          subheader={t(
            "module.finance.UploadingKTBVoucher.uploadingFromKTBDescription"
          )}
          style={styles.header}
        />
        <SubSectionContainer
          basic
          fluid
          stretch
          title={t("module.finance.UploadingKTBVoucher.paymentFromKTB")}
        >
          <AttachedFile
            mode={"edit"}
            files={voucherListStore.ktb_file}
            addFile={(file: File) =>
              voucherListStore.setField({
                fieldname: "ktbFile",
                value: file
              })
            }
            removeFile={() =>
              voucherListStore.setField({
                fieldname: "ktbFile",
                value: undefined
              })
            }
          />
        </SubSectionContainer>

        <Grid columns={"equal"}>
          <Grid.Column textAlign={"right"}>
            <Button color={"blue"} type="button" onClick={this.onSubmitButton}>
              {t("module.finance.UploadingKTBVoucher.importPayment")}
            </Button>
            {/* {this.renderButtonUpdateVoucherWithKTBFile()} */}
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
  private onSubmitButton = async () => {
    const { voucherListStore } = this.props;
    try {
      await voucherListStore.updateVoucherByKTBFile();
      await voucherListStore.resetFilter();
      await voucherListStore.onSeachVoucherList();
    } catch (e) {
      console.log(e);
    } finally {
      this.close();
    }
  };
  //   private renderbuttonupdatevoucherwithktbfile() {
  //     const { voucherliststore, t } = this.props;
  //     return (
  //       <modal
  //         open={this.state.open}
  //         onopen={this.open}
  //         onclose={this.close}
  //         trigger={
  //           <button
  //             // disabled={voucherliststore.statusmenu}
  //             style={styles.button}
  //             color="blue"
  //             onclick={this.setcurrentdate}
  //           >
  //             {t("module.finance.uploadingktbvoucher.importpayment")}
  //           </button>
  //         }
  //       >
  //         <modal.content>
  //           <segment basic style={styles.segment}>
  //             <header textalign={"center"} size="large">
  //               {t("module.loan.requesttable.contractdate")}
  //             </header>
  //             <form onsubmit={this.onclickupdatevouchers}>
  //               <form.field
  //                 required
  //                 control={dateinput}
  //                 value={voucherliststore.documentdate || undefined}
  //                 fieldname="documentdate"
  //                 onchangeinputfield={this.onchangeinputfield}
  //               />
  //               {/* {this.renderrequestchecklist()} */}
  //               <form.button fluid color="purple" type="submit">
  //                 {t("module.loan.requesttable.sendcontract")}
  //               </form.button>
  //             </form>
  //           </segment>
  //         </modal.content>
  //       </modal>
  //     );
  //   }
  //   private setcurrentdate = () => {
  //     this.props.voucherliststore.setfield({
  //       fieldname: "documentdate",
  //       value: new date().toisostring().substring(0, 10)
  //     });
  //   };
  //   private onclickupdatevouchers = async () => {
  //     const { voucherliststore } = this.props;
  //     try {
  //       await voucherliststore.updatevoucherbyktbfile();
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       this.close();
  //     }
  //   };
  //   private onchangeinputfield = (fieldname: string, value: any) => {
  //     const { voucherliststore } = this.props;
  //     voucherliststore!.setfield({ fieldname, value });
  //   };
}

const styles: any = {
  formField: {
    marginTop: 23
  }
};
export default withTranslation()(UploadingKTBVoucher);
