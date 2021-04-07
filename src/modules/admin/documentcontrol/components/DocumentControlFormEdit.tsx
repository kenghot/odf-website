import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Header, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { FiscalYearDDL } from "../../../../components/project/year";
import { DeleteModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { ISequenceModel } from "../../sequence/SequenceModel";

interface IDocumentControlFormEdit
  extends WithTranslation,
    RouteComponentProps {
  sequence: ISequenceModel;
}
@observer
class DocumentControlFormEdit extends React.Component<
  IDocumentControlFormEdit
> {
  public render() {
    const { t, sequence } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t(
            "module.admin.documentInfoForm.documentManagementNumberInfo",
          )}
          subheader={t(
            "module.admin.documentInfoForm.forHandlingDocumentFormat",
          )}
          style={styles.header}
        />
        <Form>
          <FormDisplay
            title={t("module.admin.documentInfoForm.documentType")}
            value={sequence.sequenceTypeName}
          />
          <FormDisplay
            title={t("module.admin.documentInfoForm.shortcode")}
            value={sequence.prefixCode}
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
              "module.admin.documentInfoForm.specifyNumberCodeNumbers",
            )}
            onChange={(event: any, data: any) =>
              sequence.setField({
                fieldname: "paddingSize",
                value: parseInt(data.value) || 0,
              })
            }
            type="number"
            min="0"
            value={sequence.paddingSize}
          />
          <Form.Input
            fluid
            label={t("module.admin.documentInfoForm.codeCharactercode")}
            placeholder={t(
              "module.admin.documentInfoForm.specifyNumberCodeNumbers",
            )}
            onChange={(event: any, data: any) =>
              sequence.setField({
                fieldname: "paddingChar",
                value: data.value,
              })
            }
            value={sequence.paddingChar}
          />
          <Form.Input
            fluid
            label={t("module.admin.documentInfoForm.latestDocumentOrder")}
            placeholder={t(
              "module.admin.documentInfoForm.specifyOrderWhichDocument",
            )}
            onChange={(event: any, data: any) =>
              sequence.setField({
                fieldname: "sequenceNumber",
                value: parseInt(data.value) || 0,
              })
            }
            type="number"
            min="0"
            value={sequence.sequenceNumber}
          />
          <FormDisplay
            title={t("module.admin.documentInfoForm.latestDocumentNumber")}
            value={sequence.runningNumber}
          />
          <Form.Group widths="equal">
            {hasPermission("DOC.DEL") ? (
              <DeleteModal
                trigger={
                  <Form.Button floated="left" color="red" inverted>
                    {t("module.admin.documentInfoForm.delete")}
                  </Form.Button>
                }
                onConfirmDelete={() => this.deleteSequence(sequence)}
              />
            ) : (
              <Form.Field />
            )}
            <Form.Button
              width={5}
              fluid
              floated="right"
              color="blue"
              onClick={this.updateForm}
            >
              {t("module.admin.documentInfoForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
  private deleteSequence = async (item: ISequenceModel) => {
    const { history } = this.props;
    try {
      await item.deleteSequence();
      history.push("/admin/doc_control");
    } catch (e) {
      console.log(e);
    }
  };
  private updateForm = async () => {
    const { sequence } = this.props;
    try {
      await sequence.updateSequence();
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { sequence } = this.props;
    sequence.setField({ fieldname: "prefixYear", value });
  };
}

const styles: any = {
  header: {
    marginBottom: 28,
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14,
  },
};

export default withRouter(withTranslation()(DocumentControlFormEdit));
