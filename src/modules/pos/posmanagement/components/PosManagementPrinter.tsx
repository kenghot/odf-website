import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";
import { ReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";
import { connectPrinter } from "../../Receipt";
import { ErrorMessage } from "../../../../components/common";

interface IPosManagementPrinter extends WithTranslation {
  pos: IPosModel;
}
@observer
class PosManagementPrinter extends React.Component<IPosManagementPrinter> {
  private receiptTemp = ReceiptModel.create({});
  public render() {
    const { t, pos } = this.props;
    return (
      <Segment padded="very">
        <ErrorMessage
          errorobj={this.receiptTemp.error}
          float={true}
          timeout={10000}
        />
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Header
                size="medium"
                content={t("module.pos.posManagementPrinter.content")}
                subheader={t("module.pos.posManagementPrinter.subheader")}
                style={styles.header}
              />
            </Grid.Column>
            <Grid.Column>
              <Button
                color="teal"
                floated="right"
                type="button"
                icon="print"
                content={t("module.pos.posManagementPrinter.checkPrinter")}
                onClick={this.onCheckPrinter}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Form onSubmit={this.updateForm}>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label={"IP address"}
              placeholder={t("module.pos.posManagementPrinter.printerIP")}
              onChange={(event: any, data: any) =>
                pos.setField({
                  fieldname: "printerIP",
                  value: data.value
                })
              }
              value={pos.printerIP}
            />
            <Form.Input
              fluid
              label={t("module.pos.posManagementPrinter.printerPort")}
              placeholder={t("module.pos.posManagementPrinter.placeholderPort")}
              onChange={(event: any, data: any) =>
                pos.setField({
                  fieldname: "printerPort",
                  value: data.value
                })
              }
              value={pos.printerPort}
            />
          </Form.Group>
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

  private updateForm = async () => {
    const { pos } = this.props;
    try {
      if (pos.id) {
        await pos.updatePosPrinterIP();
      }
    } catch (e) {
      console.log(e);
    }
  };
  private onCheckPrinter = async () => {
    const { pos } = this.props;
    try {
      await pos.setField({ fieldname: "loading", value: true });
      await connectPrinter(pos, this.receiptTemp);
      await pos.error.setField({ fieldname: "tigger", value: false });
      await pos.alert.setAlertMessage("เครื่องพิมพ์สามารถใช้งานได้ค่ะ", "");
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      await pos.setField({ fieldname: "loading", value: false });
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

export default withTranslation()(PosManagementPrinter);
