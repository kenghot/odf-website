import { observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Segment } from "semantic-ui-react";
import { LocationModel } from "../../../../components/address";
import { IDCardModel } from "../../../../components/idcard";
import { SequenceDDL } from "../../sequence/components";
import { IOrgModel } from "../OrgModel";

interface IManageDocumentForm extends WithTranslation {
  org: IOrgModel;
}
@observer
class ManageDocumentForm extends React.Component<IManageDocumentForm> {
  public locationStore = LocationModel.create({});
  public idCard = IDCardModel.create({});
  public render() {
    const { t, org } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t(
            "module.admin.manageDocumentForm.currentDocumentNumberManager"
          )}
          subheader={t(
            "module.admin.manageDocumentForm.pleaseSpecifyNumberManager"
          )}
          style={styles.header}
        />
        <Form>
          <Form.Field
            id="org-request-sequence-ddl"
            label={t("module.admin.manageDocumentForm.petitionDocument")}
            placeholder={t(
              "module.admin.manageDocumentForm.specifyRequestDocument"
            )}
            control={SequenceDDL}
            sequenceId={org.requestSequence ? org.requestSequence.id : ""}
            sequence={org.requestSequence ? org.requestSequence : undefined}
            value={org.requestSequence ? org.requestSequence.id : ""}
            onChange={this.onChangeRequestSequenceDDL}
            SequenceType="request"
          />
          <Form.Field
            id="org-request-sequence-ddl"
            label={t("module.admin.manageDocumentForm.petitionOnlineDocument")}
            placeholder={t(
              "module.admin.manageDocumentForm.specifyRequestOnlineDocument"
            )}
            control={SequenceDDL}
            sequenceId={org.requestOnlineSequence ? org.requestOnlineSequence.id : ""}
            sequence={org.requestOnlineSequence ? org.requestOnlineSequence : undefined}
            value={org.requestOnlineSequence ? org.requestOnlineSequence.id : ""}
            onChange={this.onChangeRequestOnlineSequenceDDL}
            SequenceType="requestOnline"
          />
          <Form.Field
            id="org-agreement-sequence-ddl"
            label={t("module.admin.manageDocumentForm.contractDocuments")}
            placeholder={t(
              "module.admin.manageDocumentForm.specifyContractDocument"
            )}
            control={SequenceDDL}
            sequenceId={org.agreementSequence ? org.agreementSequence.id : ""}
            sequence={org.agreementSequence ? org.agreementSequence : undefined}
            value={org.agreementSequence ? org.agreementSequence.id : ""}
            onChange={this.onChangeAgreementSequenceDDL}
            SequenceType="agreement"
          />
          <Form.Field
            id="org-voucher-sequence-ddl"
            label={t("module.admin.manageDocumentForm.receipt")}
            placeholder={t("module.admin.manageDocumentForm.specifyReceipt")}
            control={SequenceDDL}
            sequenceId={org.voucherSequence ? org.voucherSequence.id : ""}
            sequence={org.voucherSequence ? org.voucherSequence : undefined}
            value={org.voucherSequence ? org.voucherSequence.id : ""}
            onChange={this.onChangeVoucherSequenceDDL}
            SequenceType="voucher"
          />

          <Form.Group widths="equal">
            <Form.Field />
            <Form.Button
              id="form-button-submit-manage-document-form"
              width={5}
              fluid
              floated="right"
              color="blue"
              onClick={this.updateForm}
            >
              {t("module.admin.manageDocumentForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  private updateForm = async () => {
    const { org } = this.props;
    try {
      if (org.id) {
        await org.updateManageDocumentOrg();
      }
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeRequestSequenceDDL = async (value: any) => {
    const { org } = this.props;
    org.setField({ fieldname: "requestSequence", value: clone(value) });
  };
  private onChangeRequestOnlineSequenceDDL = async (value: any) => {
    const { org } = this.props;
    org.setField({ fieldname: "requestOnlineSequence", value: clone(value) });
  };
  private onChangeAgreementSequenceDDL = async (value: any) => {
    const { org } = this.props;
    org.setField({ fieldname: "agreementSequence", value: clone(value) });
  };
  private onChangeVoucherSequenceDDL = async (value: any) => {
    const { org } = this.props;
    org.setField({ fieldname: "voucherSequence", value: clone(value) });
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withTranslation()(ManageDocumentForm);
