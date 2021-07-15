import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Segment } from "semantic-ui-react";
import { SequenceDDL } from "../../../admin/sequence/components";
import { IPosModel } from "../../PosModel";

interface IPosManagementReceiptForm extends WithTranslation {
  pos: IPosModel;
}
@observer
class PosManagementReceiptForm extends React.Component<
IPosManagementReceiptForm
> {
  public render() {
    const { t, pos } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.pos.posManagementReceiptForm.contentHeader")}
          subheader={t("module.pos.posManagementReceiptForm.subHeader")}
          style={styles.header}
        />
        <Form onSubmit={this.updateForm}>
          <Form.Field
            id="receiptSequenceDDL"
            label={t("module.pos.posManagementReceiptForm.receiptSequence")}
            placeholder={t(
              "module.pos.posManagementReceiptForm.placeholderReceiptSequence"
            )}
            control={SequenceDDL}
            sequenceId={pos.receiptSequence ? pos.receiptSequence.id : ""}
            clearable
            sequence={pos.receiptSequence ? pos.receiptSequence : undefined}
            value={pos.receiptSequenceId ? pos.receiptSequenceId : ""}
            onChange={this.onChangeReceiptSequenceDDL}
            SequenceType="receipt"
            SequencePerpage="10000"
          />
          <Form.Group widths="equal" style={styles.formGroup}>
            <Form.Field />
            <Form.Button width={5} fluid floated="right" color="blue">
              {t("save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
  private onChangeReceiptSequenceDDL = async (value: any) => {
    const { pos } = this.props;
    if (value && value.id) {
      pos.setField({ fieldname: "receiptSequenceId", value: value.id });
    } else {
      pos.setField({ fieldname: "receiptSequenceId", value: "" });
    }
  };

  private updateForm = async () => {
    const { pos } = this.props;
    try {
      if (pos.id) {
        await pos.updatePosReceiptSequence();
      }
    } catch (e) {
      console.log(e);
    }
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
  },
  formGroup: {
    marginTop: 42,
    marginBottom: 0
  }
};

export default withTranslation()(PosManagementReceiptForm);
