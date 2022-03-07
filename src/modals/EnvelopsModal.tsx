import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Form,
  Header,
  Modal,
  Radio,
  Segment,
} from "semantic-ui-react";
import { Loading } from "../components/common/loading";
import { EnvelopSize } from "../modules/donation/components";

interface IEnvelopsModal extends WithTranslation {
  trigger: any;
  onConfirm: (
    addressType: string,
    fileType: string,
    isReport: boolean,
    commonAddress: boolean,
    envelopSize: string,
    adviceOfRreceipt : boolean
  ) => void;
  disabled?: boolean;
}

class EnvelopsModal extends React.Component<IEnvelopsModal> {
  public _isMounted = false;
  public state = {
    open: false,
    loading: false,
    isReport: false,
    commonAddress: false,
    fileType: "pdf",
    envelopSize: "1",
    addressType: "idCardAddress",
    adviceOfRreceipt:false
  };
  public componentDidMount() {
    this._isMounted = true;
  }
  public componentWillUnmount() {
    this._isMounted = false;
  }
  public close = () => {
    if (this._isMounted) {
      this.setState({ open: false });
    }
  };
  public open = () => {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  };
  public render() {
    const { trigger, disabled, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={disabled ? undefined : this.open}
        size="mini"
        open={open}
        onClose={this.close}
      >
        <Header icon={"print"} content={t("modal.EnvelopsModal.header")} />
        <Modal.Content scrolling>
          <Loading active={this.state!.loading} />
          <Form>
            <Form.Field>
              <label>{"รูปแบบรายงาน"}</label>
              <Segment>
                <Checkbox
                  onChange={(event: any, data: any) =>
                    this.setState({ isReport: data.checked })
                  }
                  id={`form-input-isReport`}
                  checked={this.state.isReport}
                  label={"พิมพ์รายงานซองจดหมาย"}
                />
              </Segment>
              <Segment>
                <Checkbox
                  onChange={(event: any, data: any) =>
                    this.setState({ adviceOfRreceipt: data.checked })
                  }
                  id={`form-input-adviceOfRreceipt`}
                  checked={this.state.adviceOfRreceipt}
                  label={"ใบตอบรับ (ใบเหลือง)"}
                />
              </Segment>
            </Form.Field>
            <Form.Field>
              <label>{t("modal.EnvelopsModal.headerAddressType")}</label>
              <Segment>
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label={t(
                      "module.donation.DonationFormDonatorInfo.titleAddress"
                    )}
                    onChange={(
                      event: React.SyntheticEvent<HTMLElement>,
                      data: any
                    ) => this.setState({ addressType: "idCardAddress" })}
                    checked={this.state.addressType === "idCardAddress"}
                  />
                  <Form.Field
                    control={Radio}
                    label={t(
                      "module.donation.DonationFormDonatorInfo.labelAddress"
                    )}
                    onChange={(
                      event: React.SyntheticEvent<HTMLElement>,
                      data: any
                    ) => this.setState({ addressType: "documentDelivery" })}
                    checked={this.state.addressType === "documentDelivery"}
                  />
                </Form.Group>
                <Form.Field>
                  <label>{"กรณีพิมพ์หนึ่งซองที่อยู่เดียวกัน"}</label>
                  <Segment>
                    <Checkbox
                      onChange={(event: any, data: any) =>
                        this.setState({ commonAddress: data.checked })
                      }
                      id={`form-input-commonAddress`}
                      checked={this.state.commonAddress}
                      label={"ที่อยู่เดียวกัน"}
                    />
                  </Segment>
                </Form.Field>
              </Segment>
            </Form.Field>
            <Form.Field>
              <label>{t("modal.EnvelopsModal.headerFileType")}</label>
              <Segment disabled={this.state.isReport}>
                <Form.Group>
                  <Form.Field
                    disabled={this.state.isReport}
                    control={Radio}
                    label={"PDF"}
                    onChange={(
                      event: React.SyntheticEvent<HTMLElement>,
                      data: any
                    ) => this.setState({ fileType: "pdf" })}
                    checked={this.state.fileType === "pdf"}
                  />
                  <Form.Field
                    disabled={this.state.isReport}
                    control={Radio}
                    label={"MS Word"}
                    onChange={(
                      event: React.SyntheticEvent<HTMLElement>,
                      data: any
                    ) => this.setState({ fileType: "docx" })}
                    checked={this.state.fileType === "docx"}
                  />
                </Form.Group>
              </Segment>
            </Form.Field>
            <Form.Field
              label={"ขนาดซองจดหมาย"}
              width={16}
              disabled={this.state.adviceOfRreceipt}
              control={EnvelopSize}
              inputFieldEnvelopSize="envelopSize"
              valueFieldEnvelopSize={this.state.envelopSize}
              onChangeInputField={this.onChangeInputEnvelopSize}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="grey"
            floated="left"
            basic
            onClick={() => this.close()}
          >
            {t("modal.EnvelopsModal.buttonNo")}
          </Button>
          <Button color="teal" onClick={() => this.onConfirm()}>
            {t("modal.EnvelopsModal.buttonYes")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private onChangeInputEnvelopSize = (fieldname: string, value: any) => {
    this.setState({ envelopSize: value });
  };

  private onConfirm = async () => {
    const { onConfirm } = this.props;
    try {
      this.setState({ loading: true });
      await onConfirm(
        this.state.addressType,
        this.state.fileType,
        this.state.isReport,
        this.state.commonAddress,
        this.state.envelopSize,
        this.state.adviceOfRreceipt
      );
      this.close();
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.setState({ loading: false });
    }
  };
}

export default withTranslation()(EnvelopsModal);
