import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Menu, Tab } from "semantic-ui-react";
import { RequesAttachedFileList } from ".";
import {
  AlertMessage,
  ErrorMessage,
  SubSectionContainer
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { IRequestItemModel, IRequestModel } from "../RequestModel";

interface IRequesAttachedFiles extends WithTranslation {
  request: IRequestModel;
  mode: "createMode" | "editMode";
  readOnly?: boolean;
  hideButtonSubmit?: boolean;
  showButtonIsVerified?: boolean;
}
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
          );
        })}
      </React.Fragment>
    );
  }
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
