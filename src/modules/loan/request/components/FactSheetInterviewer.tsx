import { observer } from "mobx-react";
import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Radio, Segment } from "semantic-ui-react";
import { DateInput } from "../../../../components/common";
import { IRequestModel } from "../RequestModel";

interface IFactSheetInterviewer extends WithTranslation {
  request: IRequestModel;
}

@observer
class FactSheetInterviewer extends Component<IFactSheetInterviewer> {
  public render() {
    const { request, t } = this.props;
    const factSheet = request.factSheet;
    return factSheet ? (
      <Segment padded style={styles.segment}>
        <Header
          size="medium"
          content={t("module.loan.factSheetInterviewer.opinionOfficer")}
          subheader={t(
            "module.loan.factSheetInterviewer.preliminaryResultsExaminationOfficials"
          )}
          style={styles.header}
        />
        <Form>
          <Form.Input
            fluid
            label={t("module.loan.factSheetInterviewer.interviewedBy")}
            placeholder={t("module.loan.factSheetInterviewer.specifyInterview")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              factSheet!.setField({
                fieldname: "interviewerName",
                value: data.value
              })
            }
            value={factSheet!.interviewerName}
          />
          <Form.Field
            label={t("module.loan.factSheetInterviewer.interviewDate")}
            control={DateInput}
            value={factSheet!.interviewDate}
            fieldName="interviewDate"
            onChangeInputField={this.onChangeInputField}
            id={"factSheet_interviewDate"}
          />
          <Form.Field>
            <label>
              {t("module.loan.factSheetInterviewer.withFollowingComments")}
            </label>
            <Segment padded>
              <Form.Group inline style={{ marginBottom: 0 }}>
                <Form.Field
                  control={Radio}
                  label={t("module.loan.factSheetInterviewer.reasonableLoan")}
                  // value={true}
                  onChange={(
                    event: React.SyntheticEvent<HTMLElement>,
                    data: any
                  ) =>
                    factSheet!.setField({
                      fieldname: "isApproved",
                      value: true
                    })
                  }
                  checked={request.factSheet!.isApproved === true}
                />
                <Form.Field
                  control={Radio}
                  label={t("module.loan.factSheetInterviewer.notSuitableLoan")}
                  // value={false}
                  onChange={(
                    event: React.SyntheticEvent<HTMLElement>,
                    data: any
                  ) =>
                    factSheet!.setField({
                      fieldname: "isApproved",
                      value: false
                    })
                  }
                  checked={request.factSheet!.isApproved === false}
                />
              </Form.Group>
              <Form.TextArea
                label={t("module.loan.factSheetInterviewer.reason")}
                placeholder={t(
                  "module.loan.factSheetInterviewer.pleaseSpecify"
                )}
                onChange={(
                  event: React.SyntheticEvent<HTMLElement>,
                  data: any
                ) =>
                  factSheet!.setField({
                    fieldname: "comments",
                    value: data.value
                  })
                }
                value={factSheet!.comments}
              />
            </Segment>
          </Form.Field>
          {request!.status !== "DN" ? (
            <Button floated="right" color="blue" onClick={this.updatrForm}>
              {t("module.loan.factSheetInterviewer.memoStaffComments")}
            </Button>
          ) : null}
        </Form>
      </Segment>
    ) : null;
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { request } = this.props;
    const factSheet = request.factSheet;
    factSheet!.setField({ fieldname, value });
  };
  private updatrForm = async () => {
    const { request } = this.props;
    try {
      await request.updateFactSheet(true);
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  header: {
    marginBottom: 28
  },
  segment: {
    paddingBottom: 50
  }
};

export default withTranslation()(FactSheetInterviewer);
