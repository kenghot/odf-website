import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Form,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import {
  FactSheetInterviewer,
  RequestFormFactSheetBorrower,
  RequestHeader
} from ".";
import { AttachedFile } from "../../../../components/common";
import { Questionaires } from "../../../../components/questionnaire";
import { IAuthModel } from "../../../auth/AuthModel";
import { FactSheetModel } from "../FactSheetModel";
import { IRequestModel } from "../RequestModel";
import FactSheetScrollSum from "./FactSheetScrollSum";

interface IFactSheet extends WithTranslation {
  request: IRequestModel;
  authStore?: IAuthModel;
}
@inject("authStore")
@observer
class FactSheet extends Component<IFactSheet> {
  public async componentDidMount() {
    const { request, authStore } = this.props;
    if (!request.factSheetCheckValue) {
      this.setState({ noFactsheet: true });
      await request.setField({
        fieldname: "factSheet",
        value: FactSheetModel.create({})
      });
      if (request.requestItems.length > 0) {
        await request.factSheet!.setField({
          fieldname: "borrower",
          value: clone(request.requestItems[0].borrower)
        });
        await request.factSheet!.setField({
          fieldname: "currentAddressType",
          value: request.factSheet!.borrower.currentAddressType
        });
        await request.factSheet!.setField({
          fieldname: "currentAddress",
          value: clone(request.factSheet!.borrower.currentAddress)
        });
      }
      await request.factSheet!.setField({
        fieldname: "interviewerName",
        value: `${authStore!.userProfile.title}${
          authStore!.userProfile.firstname
        } ${authStore!.userProfile.lastname}`
      });
      await request.factSheet!.factSheetItems.loadFactSheet();
    }
  }
  public render() {
    const { request, t } = this.props;
    return request.factSheet ? (
      <Segment padded basic>
        <RequestHeader request={request} hideBtn mode="view" />

        <Header
          size="medium"
          content={t("module.loan.factSheet.factQuiz")}
          subheader={t(
            "module.loan.factSheet.referToHandbookElderlyFundManagementDivision"
          )}
        />
        {!request.factSheetCheckValue ? (
          <Message negative>
            <Message.Header>
              {t("module.loan.factSheet.resultExaminationHasNotRecorded")}
            </Message.Header>
            <p>{t("module.loan.factSheet.pleaseCheckAndSaveFactSheet")}</p>
          </Message>
        ) : null}

        <Form>
          <Form.Field
            label={t("module.loan.factSheet.generalInformation")}
            control={RequestFormFactSheetBorrower}
            factSheet={request.factSheet}
          />
        </Form>
        <Questionaires
          questionlist={request.factSheet.factSheetItems.question_list}
        />
        <FactSheetScrollSum factsheet={request.factSheet.factSheetItems} />
        {request.status !== "DN" ? (
          <Segment basic style={styles.segment}>
            <Button floated="right" color="blue" onClick={this.updateForm}>
              {t("module.loan.factSheet.recordQuestionnaire")}
            </Button>
          </Segment>
        ) : null}
        {request.factSheet && request.factSheet.id ? (
          <React.Fragment>
            <Form>
              <Form.Field
                label={t("module.loan.factSheet.photographBorrowerOccupation")}
                mode="edit"
                control={AttachedFile}
                multiple={true}
                addFiles={request.factSheet.addFiles}
                removeFile={(index?: number) =>
                  request.factSheet!.removeFile(index!)
                }
                fieldName="attachedFiles"
                files={request.factSheet.fileList}
              />
            </Form>
            {request.status !== "DN" ? (
              <Segment basic style={styles.segment}>
                <Button floated="right" color="blue" onClick={this.updateFile}>
                  {t("module.loan.factSheet.savePhotosWhileWorking")}
                </Button>
              </Segment>
            ) : null}
          </React.Fragment>
        ) : null}

        <FactSheetInterviewer request={request} />
      </Segment>
    ) : null;
  }
  private updateForm = async () => {
    const { request } = this.props;
    try {
      await request.updateFactSheet();
    } catch (e) {
      console.log(e);
    }
  };
  private updateFile = async () => {
    const { request } = this.props;
    try {
      await request.updateFactSheetAttachedFiles();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  segment: {
    paddingBottom: 50,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0
  }
};
export default withTranslation()(FactSheet);
