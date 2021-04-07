import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Form,
  Grid,
  Header,
  Responsive,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { FormDisplay } from "../../../components/common";
import { StatusBlock } from "../../../components/common/block";
import { IReceiptModel } from "../ReceiptModel";
import { ReceiptInfoManager } from ".";
import { PermissionControl } from "../../../components/permission";

interface IReceiptInfoEdit extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ReceiptInfoEdit extends React.Component<IReceiptInfoEdit> {
  public state = {
    maxHeightSegmentGroup: 0
  };
  public async componentDidMount() {
    try {
      await this.handleOnUpdate();
    } catch (e) {
      console.log(e);
    }
  }
  public render() {
    const { t, receipt, appStore } = this.props;
    return (
      <React.Fragment>
        <Responsive onUpdate={this.handleOnUpdate} />
        <Form>
          <Segment
            padded
            style={{
              overflowY: appStore!.tabletMode ? "initial" : "auto",
              maxHeight: appStore!.tabletMode
                ? "initial"
                : this.state.maxHeightSegmentGroup,
              minHeight: appStore!.tabletMode
                ? "initial"
                : this.state.maxHeightSegmentGroup
            }}
          >
            {this.renderHeader()}
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.orgName")}
                value={receipt.organization.orgName}
              />
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.posName")}
                value={`${receipt.pos.posName}${
                  receipt.pos.posCode ? ` : ${receipt.pos.posCode}` : ""
                }`}
              />
            </Form.Group>

            <Form.Input
              fluid
              label={t("module.receipt.receiptInfoEdit.organizationName")}
              placeholder={t(
                "module.receipt.receiptInfoEdit.placeholderOrganizationName"
              )}
              onChange={(event: any, data: any) =>
                receipt.setField({
                  fieldname: "organizationName",
                  value: data.value
                })
              }
              value={receipt.organizationName}
            />
            {this.renderAddress()}
            <PermissionControl codes={["POS.EDIT.VAT"]}>
              {this.renderInfo()}
            </PermissionControl>
            {this.renderRef()}
            {this.renderNote()}
          </Segment>
          <ReceiptInfoManager receipt={receipt} />
        </Form>
      </React.Fragment>
    );
  }

  private renderHeader() {
    const { t, receipt, appStore } = this.props;
    return (
      <React.Fragment>
        <Grid columns="equal">
          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Header
                style={styles.header}
                size="medium"
                content={t("module.receipt.receiptInfoEdit.content")}
                subheader={t("module.receipt.receiptInfoEdit.subheader")}
              />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <StatusBlock
                label={appStore!.enumItemLabel("receiptStatus", receipt.status)}
                color={this.getStatusColor()}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }

  private renderAddress() {
    const { t, receipt } = this.props;
    return (
      <Form.Field>
        <label>
          {t("module.receipt.receiptInfoEdit.organizationAddressLine")}
        </label>
        <Segment>
          <Form.Input
            fluid
            placeholder={t(
              "module.receipt.receiptInfoEdit.organizationAddressLine1"
            )}
            onChange={(event: any, data: any) =>
              receipt.setField({
                fieldname: "organizationAddressLine1",
                value: data.value
              })
            }
            value={receipt.organizationAddressLine1}
          />
          <Form.Input
            fluid
            placeholder={t(
              "module.receipt.receiptInfoEdit.organizationAddressLine2"
            )}
            onChange={(event: any, data: any) =>
              receipt.setField({
                fieldname: "organizationAddressLine2",
                value: data.value
              })
            }
            value={receipt.organizationAddressLine2}
          />
          <Form.Input
            fluid
            placeholder={t(
              "module.receipt.receiptInfoEdit.organizationAddressLine3"
            )}
            onChange={(event: any, data: any) =>
              receipt.setField({
                fieldname: "organizationAddressLine3",
                value: data.value
              })
            }
            value={receipt.organizationAddressLine3}
          />
          <Form.Input
            fluid
            placeholder={t(
              "module.receipt.receiptInfoEdit.organizationAddressLine4"
            )}
            onChange={(event: any, data: any) =>
              receipt.setField({
                fieldname: "organizationAddressLine4",
                value: data.value
              })
            }
            value={receipt.organizationAddressLine4}
          />
        </Segment>
      </Form.Field>
    );
  }

  private renderInfo() {
    const { t, receipt } = this.props;
    return (
      <Form.Field>
        <label>{t("module.receipt.receiptInfoEdit.taxInfo")}</label>
        <Segment>
          <Form.Input
            fluid
            label={t("module.receipt.receiptInfoEdit.organizationTaxNo")}
            placeholder={t(
              "module.receipt.receiptInfoEdit.placeholderOrganizationTaxNo"
            )}
            onChange={(event: any, data: any) =>
              receipt.setField({
                fieldname: "organizationTaxNo",
                value: data.value
              })
            }
            value={receipt.organizationTaxNo}
          />
          <Form.Input
            fluid
            label={t("module.receipt.receiptInfoEdit.POSVATCode")}
            placeholder={t(
              "module.receipt.receiptInfoEdit.placeholderPOSVATCode"
            )}
            onChange={(event: any, data: any) =>
              receipt.setField({
                fieldname: "POSVATCode",
                value: data.value
              })
            }
            value={receipt.POSVATCode}
          />
        </Segment>
      </Form.Field>
    );
  }

  private renderRef() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <br />
        <Form.Field>
          <label>{t("module.receipt.receiptInfoEdit.refNumber")}</label>
          <Segment>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label={t("module.receipt.receiptInfoEdit.internalRef1")}
                placeholder={t(
                  "module.receipt.receiptInfoEdit.placeholderInternalRef1"
                )}
                onChange={(event: any, data: any) =>
                  receipt.setField({
                    fieldname: "internalRef1",
                    value: data.value
                  })
                }
                value={receipt.internalRef1}
              />
              <Form.Input
                fluid
                label={t("module.receipt.receiptInfoEdit.internalRef2")}
                placeholder={t(
                  "module.receipt.receiptInfoEdit.placeholderInternalRef2"
                )}
                onChange={(event: any, data: any) =>
                  receipt.setField({
                    fieldname: "internalRef2",
                    value: data.value
                  })
                }
                value={receipt.internalRef2}
              />
            </Form.Group>
            <Form.Input
              fluid
              label={t("module.receipt.receiptInfoEdit.exteranalRef")}
              placeholder={t(
                "module.receipt.receiptInfoEdit.placeholderExteranalRef"
              )}
              onChange={(event: any, data: any) =>
                receipt.setField({
                  fieldname: "exteranalRef",
                  value: data.value
                })
              }
              value={receipt.exteranalRef}
            />
          </Segment>
        </Form.Field>
      </React.Fragment>
    );
  }

  private renderNote() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <br />
        <Form.Field>
          <label>{t("module.receipt.receiptInfoEdit.note")}</label>
          <Segment>
            <Form.Input
              fluid
              label={t("module.receipt.receiptInfoEdit.note")}
              placeholder={t(
                "module.receipt.receiptInfoEdit.placeholderDocumentNote"
              )}
              onChange={(event: any, data: any) =>
                receipt.setField({
                  fieldname: "documentNote",
                  value: data.value
                })
              }
              value={receipt.documentNote}
            />
            <Form.TextArea
              label={t("module.receipt.receiptInfoEdit.internalNote")}
              placeholder={t(
                "module.receipt.receiptInfoEdit.placeholderinternalNote"
              )}
              onChange={(event: any, data: any) =>
                receipt.setField({
                  fieldname: "internalNote",
                  value: data.value
                })
              }
              value={receipt.internalNote}
            />
          </Segment>
        </Form.Field>
      </React.Fragment>
    );
  }

  private getStatusColor(): SemanticCOLORS {
    const { receipt } = this.props;
    switch (receipt.status) {
      case "CL":
        return "red";
      case "PD":
        return "green";
      default:
        return "grey";
    }
  }
  private getHeightElement = (id: string) => {
    this.forceUpdate();
    const height = document.getElementById(id)
      ? document.getElementById(id)!.clientHeight
      : 0;
    return height;
  };

  private handleOnUpdate = async () => {
    const padding = 44;
    const body = this.getHeightElement("ReceiptModal-Content");
    const segmentInfoManager = this.getHeightElement("Segment-Info-Manager");
    const cal = body - padding - segmentInfoManager;
    if (cal > 0) {
      await this.setState({
        maxHeightSegmentGroup: cal
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0
      });
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
  }
};

export default withTranslation()(ReceiptInfoEdit);
