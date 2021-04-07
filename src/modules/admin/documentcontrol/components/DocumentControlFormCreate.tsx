import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Header, Segment } from "semantic-ui-react";
import { FiscalYearDDL } from "../../../../components/project/year";
import { SEQUENCE_TYPE } from "../../../../constants/SELECTOR";
import { ISequenceModel } from "../../sequence/SequenceModel";
const statusOptions = SEQUENCE_TYPE;

interface IDocumentControlFormCreate
  extends WithTranslation,
    RouteComponentProps {
  sequence: ISequenceModel;
}
@observer
class DocumentControlFormCreate extends React.Component<
  IDocumentControlFormCreate
> {
  public render() {
    const { t, sequence } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t(
            "module.admin.documentInfoForm.documentManagementNumberInfo"
          )}
          subheader={t(
            "module.admin.documentInfoForm.forHandlingDocumentFormat"
          )}
          style={styles.header}
        />
        <Form>
          <Form.Select
            search
            fluid
            placeholder={t("module.admin.documentInfoForm.documentType")}
            label={t("module.admin.documentInfoForm.documentType")}
            options={statusOptions}
            onChange={(event, data) =>
              this.onChangeInputField("sequenceType", data.value)
            }
            value={sequence.sequenceType}
          />
          <Form.Input
            fluid
            label={t("module.admin.documentInfoForm.shortcode")}
            placeholder={t("module.admin.documentInfoForm.shortcode")}
            onChange={(event: any, data: any) =>
              sequence!.setField({
                fieldname: "prefixCode",
                value: data.value
              })
            }
            value={sequence!.prefixCode}
          />
          <Form.Field
            label={t("module.admin.documentInfoForm.fiscalYear")}
            placeholder={t("module.admin.documentInfoForm.pleaseSelect")}
            control={FiscalYearDDL}
            onChange={this.onChangeFiscalYearDDL}
            value={sequence.prefixYear}
          />
          <Form.Input
            fluid
            label={t("module.admin.documentInfoForm.numberCodeNumbers")}
            placeholder={t(
              "module.admin.documentInfoForm.specifyNumberCodeNumbers"
            )}
            onChange={(event: any, data: any) =>
              sequence!.setField({
                fieldname: "paddingSize",
                value: parseInt(data.value) || 0
              })
            }
            type="number"
            min="0"
            value={sequence!.paddingSize}
          />
          <Form.Input
            fluid
            label={t("module.admin.documentInfoForm.codeCharactercode")}
            placeholder={t(
              "module.admin.documentInfoForm.specifyNumberCodeNumbers"
            )}
            onChange={(event: any, data: any) =>
              sequence!.setField({
                fieldname: "paddingChar",
                value: data.value
              })
            }
            value={sequence!.paddingChar}
          />
          <Form.Input
            fluid
            label={t("module.admin.documentInfoForm.latestDocumentOrder")}
            placeholder={t(
              "module.admin.documentInfoForm.specifyOrderWhichDocument"
            )}
            onChange={(event: any, data: any) =>
              sequence!.setField({
                fieldname: "sequenceNumber",
                value: parseInt(data.value) || 0
              })
            }
            type="number"
            min="0"
            value={sequence!.sequenceNumber}
          />
          <Form.Group widths="equal">
            <Form.Field />
            <Form.Button
              width={5}
              fluid
              floated="right"
              color="blue"
              onClick={this.createForm}
            >
              {t("module.admin.documentInfoForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
  private createForm = async () => {
    const { sequence, history } = this.props;
    try {
      await sequence!.createSequence();
      if (sequence.id) {
        history.push(
          `/admin/doc_control/edit/${sequence.id}/${sequence.sequenceType}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { sequence } = this.props;
    sequence!.setField({ fieldname, value });
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { sequence } = this.props;
    sequence!.setField({ fieldname: "prefixYear", value });
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
export default withRouter(withTranslation()(DocumentControlFormCreate));
