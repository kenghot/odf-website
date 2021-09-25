import { observer, inject } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Menu, Tab, Button } from "semantic-ui-react";
import { RequesAttachedFileList } from ".";
import {
  AlertMessage,
  ErrorMessage,
  SubSectionContainer
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { IRequestItemModel, IRequestModel } from "../RequestModel";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IAuthModel } from "../../../../modules/auth/AuthModel";

interface IRequesAttachedFiles extends WithTranslation {
  request: IRequestModel;
  mode: "createMode" | "editMode";
  readOnly?: boolean;
  hideButtonSubmit?: boolean;
  showButtonIsVerified?: boolean;
  authStore?: IAuthModel;
  calculateAgeDate?: string; // DDMMYYYY,
}
@inject("authStore")
@observer
class RequesAttachedFiles extends React.Component<IRequesAttachedFiles> {
  public async componentDidMount() {
    const { request } = this.props;
    if (request.requestItems.length && request.requestItems[0].id) {
      await request.requestItems[0].getAttachedFiles(request.id || "");
    }
  }
  public state = {
    activeIndex: 0
  };
  public handleTabChange = async (e: any, data: any) => {
    const { request } = this.props;
    await this.setState({ activeIndex: data.activeIndex });
    if (request.requestItems[data.activeIndex].id) {
      await request.requestItems[data.activeIndex].getAttachedFiles(
        request.id || ""
      );
    }
  };

  public render() {
    const { request } = this.props;
    switch (request.requestType) {
      case "G":
        return this.renderGroup(request);
      default:
        return this.renderPerson(request);
    }
  }

  private renderGroup(request: IRequestModel) {
    const { readOnly, hideButtonSubmit, showButtonIsVerified, t } = this.props;
    const { activeIndex } = this.state;
    const panes = request.requestItems.map(
      (item: IRequestItemModel, index: number) => ({
        menuItem: (
          <Menu.Item key={index}>{"# " + (index + 1).toString()}</Menu.Item>
        ),
        render: () => (
          <Tab.Pane key={index}>
            <React.Fragment key={index}>
              <ErrorMessage errorobj={item.error} float timeout={10000} />
              <AlertMessage
                messageobj={item.alert}
                float={true}
                timeout={3000}
              />
              <Loading active={item.loading} />
              <Form.Field
                label={t("module.loan.requesAttachedFiles.borrowerDocuments")}
                width={16}
                requestItemId={item.id}
                control={RequesAttachedFileList}
                readOnly={readOnly}
                hideButtonSubmit={hideButtonSubmit}
                showButtonIsVerified={showButtonIsVerified}
                attachedFiles={item.borrower.attachedFiles}
                onSubmit={() =>
                  item.updateAttachedFiles(
                    request.id || "",
                    "borrower",
                    item.borrower
                  )
                }
                loading={item.borrower.loading}
              />
              {[1, 3, 4].includes(item.borrower.marriageStatus) ? (
                <Form.Field
                  label={t(
                    "module.loan.requesAttachedFiles.documentsBorrowerSpouse"
                  )}
                  width={16}
                  requestItemId={item.id}
                  control={RequesAttachedFileList}
                  readOnly={readOnly}
                  hideButtonSubmit={hideButtonSubmit}
                  showButtonIsVerified={showButtonIsVerified}
                  attachedFiles={item.spouse.attachedFiles}
                  onSubmit={() =>
                    item.updateAttachedFiles(
                      request.id || "",
                      "spouse",
                      item.spouse
                    )
                  }
                  loading={item.spouse.loading}
                />
              ) : null}

              <Form.Field
                label={t("module.loan.requesAttachedFiles.documentsGuarantor")}
                width={16}
                requestItemId={item.id}
                control={RequesAttachedFileList}
                readOnly={readOnly}
                hideButtonSubmit={hideButtonSubmit}
                showButtonIsVerified={showButtonIsVerified}
                attachedFiles={item.guarantor.attachedFiles}
                onSubmit={() =>
                  item.updateAttachedFiles(
                    request.id || "",
                    "guarantor",
                    item.guarantor
                  )
                }
                loading={item.guarantor.loading}
              />
              {[1, 3, 4].includes(item.guarantor.marriageStatus) ? (
                <Form.Field
                  label={t(
                    "module.loan.requesAttachedFiles.documentsGuarantorSpouse"
                  )}
                  width={16}
                  requestItemId={item.id}
                  control={RequesAttachedFileList}
                  readOnly={readOnly}
                  hideButtonSubmit={hideButtonSubmit}
                  showButtonIsVerified={showButtonIsVerified}
                  attachedFiles={item.guarantorSpouse.attachedFiles}
                  onSubmit={() =>
                    item.updateAttachedFiles(
                      request.id || "",
                      "guarantorSpouse",
                      item.guarantorSpouse
                    )
                  }
                  loading={item.guarantorSpouse.loading}
                />
              ) : null}
            </React.Fragment>
          </Tab.Pane>
        )
      })
    );
    if (request.requestItems.length) {
      const reRenderLoading = request.requestItems[activeIndex].loading;
      const reRenderBorrowerLoading =
        request.requestItems[activeIndex].borrower.loading;
      const reRenderSpouseLoading =
        request.requestItems[activeIndex].spouse.loading;
      const reRenderGuarantorSpouseLoading =
        request.requestItems[activeIndex].guarantorSpouse.loading;
      const reRenderGuarantorLoading =
        request.requestItems[activeIndex].guarantor.loading;
    }
    return (
      <SubSectionContainer
        title={t("module.loan.requesAttachedFiles.documents")}
        style={styles.container}
        styleContent={styles.styleContent}
        stretch
        basic
        fluid
      >
        <Tab
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}
          panes={panes}
          menu={{
            tabular: true,
            attached: true,
            fluid: true,
            widths: request.requestItems.length
          }}
        />
      </SubSectionContainer>
    );
  }

  public renderPerson(request: IRequestModel) {
    const { readOnly, hideButtonSubmit, showButtonIsVerified, t } = this.props;
    return (
      <React.Fragment>
        {request.requestItems.map((item: IRequestItemModel, index: number) => {
          return (
            <React.Fragment key={index}>
              <ErrorMessage errorobj={item.error} float timeout={10000} />
              <AlertMessage
                messageobj={item.alert}
                float={true}
                timeout={3000}
              />
              <Loading active={item.loading} />
              <Form.Field
                label={t("module.loan.requesAttachedFiles.borrowerDocuments")}
                width={16}
                requestItemId={item.id}
                control={RequesAttachedFileList}
                readOnly={readOnly}
                hideButtonSubmit={hasPermission("REQUEST.ONLINE.CREATE") ? true : hideButtonSubmit}
                showButtonIsVerified={showButtonIsVerified}
                attachedFiles={item.borrower.attachedFiles}
                onSubmit={() =>
                  item.updateAttachedFiles(
                    request.id || "",
                    "borrower",
                    item.borrower
                  )
                }
                loading={item.borrower.loading}
              />
              {[1, 3, 4].includes(item.borrower.marriageStatus) ? (
                <Form.Field
                  label={t(
                    "module.loan.requesAttachedFiles.documentsBorrowerSpouse"
                  )}
                  width={16}
                  requestItemId={item.id}
                  control={RequesAttachedFileList}
                  readOnly={readOnly}
                  hideButtonSubmit={hasPermission("REQUEST.ONLINE.CREATE") ? true : hideButtonSubmit}
                  showButtonIsVerified={showButtonIsVerified}
                  attachedFiles={item.spouse.attachedFiles}
                  onSubmit={() =>
                    item.updateAttachedFiles(
                      request.id || "",
                      "spouse",
                      item.spouse
                    )
                  }
                  loading={item.spouse.loading}
                />
              ) : null}

              <Form.Field
                label={t("module.loan.requesAttachedFiles.documentsGuarantor")}
                width={16}
                requestItemId={item.id}
                control={RequesAttachedFileList}
                readOnly={readOnly}
                hideButtonSubmit={hasPermission("REQUEST.ONLINE.CREATE") ? true : hideButtonSubmit}
                showButtonIsVerified={showButtonIsVerified}
                attachedFiles={item.guarantor.attachedFiles}
                onSubmit={() =>
                  item.updateAttachedFiles(
                    request.id || "",
                    "guarantor",
                    item.guarantor
                  )
                }
                loading={item.guarantor.loading}
              />
              {[1, 3, 4].includes(item.guarantor.marriageStatus) ? (
                <Form.Field
                  label={t(
                    "module.loan.requesAttachedFiles.documentsGuarantorSpouse"
                  )}
                  width={16}
                  requestItemId={item.id}
                  control={RequesAttachedFileList}
                  readOnly={readOnly}
                  hideButtonSubmit={hasPermission("REQUEST.ONLINE.CREATE") ? true : hideButtonSubmit}
                  showButtonIsVerified={showButtonIsVerified}
                  attachedFiles={item.guarantorSpouse.attachedFiles}
                  onSubmit={() =>
                    item.updateAttachedFiles(
                      request.id || "",
                      "guarantorSpouse",
                      item.guarantorSpouse
                    )
                  }
                  loading={item.guarantorSpouse.loading}
                />
              ) : null}
              {
                hasPermission("REQUEST.ONLINE.CREATE") ?
                  <Button
                    fluid color="brown" onClick={this.onCreateRequestOnline}>
                    {t("module.loan.requestDetail.saveRequestOnline")}
                  </Button>
                  :
                  null
              }
            </React.Fragment>
          );
        })
        }
      </React.Fragment>
    );
  }
  private onCreateRequestOnline = async () => {
    const { request, authStore, calculateAgeDate } = this.props;
    request.requestItems.map(async (item: IRequestItemModel, index: number) => {
      if (!item.attachedFilesCheckFileAll && hasPermission("REQUEST.ONLINE.CREATE")) {
        if (!item.borrower.attachedFiles[0].file.size
          || !item.borrower.attachedFiles[1].file.size || !item.borrower.attachedFiles[6].file.size) {
          item.error.setField({ fieldname: "tigger", value: true });
          item.error.setField({ fieldname: "title", value: "โปรดแนบเอกสารผู้กู้" });
          item.error.setField({ fieldname: "message", value: "โปรดแนบเอกสารผู้กู้ให้ครบและกดนำส่งเอกสาร" });
        } else {
          const numAge = item.borrower.ageDisplay(calculateAgeDate);
          if (numAge > 80) {
            if (!item.borrower.attachedFiles[3].file.size) {
              item.error.setField({ fieldname: "tigger", value: true });
              item.error.setField({ fieldname: "title", value: "โปรดแนบเอกสารผู้กู้ ใบรับรองแพทย์" });
              item.error.setField({ fieldname: "message", value: "โปรดแนบเอกสาร กรณีผู้ยื่นคำร้องมีอายุ 80 ปีขึ้นไป ควรมีใบรับรองแพทย์" });
              item.setField({ fieldname: "borrowerCheckFile", value: false });
            } else {
              item.setField({ fieldname: "borrowerCheckFile", value: true });
            }
          } else {
            item.setField({ fieldname: "borrowerCheckFile", value: true });
          }
        }
        if (item.borrower.marriageStatus == 1 && (!item.spouse.attachedFiles[0].file.size
          || !item.spouse.attachedFiles[1].file.size || !item.spouse.attachedFiles[2].file.size || !item.spouse.attachedFiles[4].file.size)) {
          item.error.setField({ fieldname: "tigger", value: true });
          item.error.setField({ fieldname: "title", value: "โปรดแนบเอกสาร หนังสือยินยอมคู่สมรส,สำเนาบัตรประชาชน,สำเนาทะเบียนบ้าน,สำเนาใบสำคัญสมรส" });
          item.error.setField({ fieldname: "message", value: "โปรดแนบเอกสารคู่สมรสของผู้กู้ ให้ครบและกดนำส่งเอกสาร" });
        } else {
          item.setField({ fieldname: "spouseCheckFile", value: true });
        }
        if ((item.borrower.marriageStatus == 3 || item.borrower.marriageStatus == 4) && (!item.spouse.attachedFiles[5].file.size
          && !item.spouse.attachedFiles[6].file.size)) {
          item.error.setField({ fieldname: "tigger", value: true });
          item.error.setField({ fieldname: "title", value: "โปรดแนบเอกสาร สำเนาใบสำคัญหย่า หรือใบมรณะบัตร" });
          item.error.setField({ fieldname: "message", value: "โปรดแนบเอกสารคู่สมรสของผู้กู้ให้ครบและกดนำส่งเอกสาร" });
        } else {
          item.setField({ fieldname: "spouseCheckFile", value: true });
        }
        if (item.borrower.marriageStatus == 0 && item.spouse.attachedFiles.length === 0) {
          item.setField({ fieldname: "spouseCheckFile", value: true });
        }
        if (!item.guarantor.attachedFiles[0].file.size
          || !item.guarantor.attachedFiles[1].file.size || !item.guarantor.attachedFiles[3].file.size) {
          item.error.setField({ fieldname: "tigger", value: true });
          item.error.setField({ fieldname: "title", value: "โปรดแนบเอกสารผู้ค้ำประกัน" });
          item.error.setField({ fieldname: "message", value: "โปรดแนบเอกสารผู้ค้ำประกันให้ครบและกดนำส่งเอกสาร" });
        } else {
          item.setField({ fieldname: "guarantorCheckFile", value: true });
        }
        if (item.borrowerCheckFile && item.spouseCheckFile && item.guarantorCheckFile) {
          item.setField({ fieldname: "attachedFilesCheckFileAll", value: true });
        }
      }

      if (!request.id && item.attachedFilesCheckFileAll) {
        await request.createRequestOnline();
        await request.updateRequestAll();
        await request.getRequestDetail();
        await request.setRequestItemsAttachedFiles();
        if (request.requestItems.length && request.requestItems[0].id) {
          await request.requestItems[0].getAttachedFiles(request.id || "");
        }
        request.requestItems.map(async (itemResult: IRequestItemModel, index: number) => {
          if (itemResult.borrower.attachedFiles.length > 0) {
            for (let i = 0; i < itemResult.borrower.attachedFiles.length; i++) {
              itemResult.borrower.attachedFiles[i].setField({
                fieldname: "file",
                value: item.borrower.attachedFiles[i].file
              });
            }
          }
          if (itemResult.spouse.attachedFiles.length > 0) {
            for (let i = 0; i < itemResult.spouse.attachedFiles.length; i++) {
              itemResult.spouse.attachedFiles[i].setField({
                fieldname: "file",
                value: item.spouse.attachedFiles[i].file
              });
            }
          }
          if (itemResult.guarantor.attachedFiles.length > 0) {
            for (let i = 0; i < itemResult.guarantor.attachedFiles.length; i++) {
              itemResult.guarantor.attachedFiles[i].setField({
                fieldname: "file",
                value: item.guarantor.attachedFiles[i].file
              });
            }
          }
          if (itemResult.guarantorSpouse.attachedFiles.length > 0) {
            for (let i = 0; i < itemResult.guarantorSpouse.attachedFiles.length; i++) {
              itemResult.guarantorSpouse.attachedFiles[i].setField({
                fieldname: "file",
                value: item.guarantorSpouse.attachedFiles[i].file
              });
            }
          }
          await itemResult.updateAttachedFiles(request.id || "", "borrower", itemResult.borrower);
          await itemResult.updateAttachedFiles(request.id || "", "spouse", itemResult.spouse);
          await itemResult.updateAttachedFiles(request.id || "", "guarantor", itemResult.guarantor);
          await itemResult.updateAttachedFiles(request.id || "", "guarantorSpouse", itemResult.guarantorSpouse);
          if (hasPermission("REQUEST.ONLINE.CREATE") && request.id_card == authStore!.userProfile.username && request.status == "DFO") {
            try {
              const smsApiUrl = `${process.env.REACT_APP_SMS_SERVICE_API}/odf_sms_api.php`;
              const result: any = await fetch(`${smsApiUrl}?msisdn=${authStore!.userProfile.telephone}&message=เอกสารแบบร่างคำร้องออนไลน์ ได้บันทึกและส่งไปยังระบบกองทุนผู้สูงอายุเรียบร้อยแล้ว`);
              const response: any = await result.json();
              if (response.QUEUE.Status == "0") {
                console.log("ส่ง SMS ไม่สำเร็จ โปรดตรวจสอบหมายเลขโทรศัพท์ หรือลองใหม่อีกครั้ง Error:" + response.QUEUE.Detail);
              } else {
                console.log("ส่ง SMS สำเร็จ");
              }
            } catch (e) {
              console.log(e);
              throw e;
            }
          }
          if (hasPermission("REQUEST.ONLINE.CREATE")) {
            request.setField({
              fieldname: "successRequestOnline",
              value: true
            });
          }
        });
      } else if (item.attachedFilesCheckFileAll) {
        await item.updateAttachedFiles(request.id || "", "borrower", item.borrower);
        await item.updateAttachedFiles(request.id || "", "spouse", item.spouse);
        await item.updateAttachedFiles(request.id || "", "guarantor", item.guarantor);
        await item.updateAttachedFiles(request.id || "", "guarantorSpouse", item.guarantorSpouse);
      }
    });
  };
}
const styles: any = {
  container: {
    marginBottom: 7,
    width: "100%",
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0
  },
  styleContent: {
    marginRight: -14,
    marginLeft: -14
  }
};
export default withTranslation()(RequesAttachedFiles);
