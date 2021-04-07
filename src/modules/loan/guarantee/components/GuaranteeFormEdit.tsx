import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { GuaranteeHeader } from ".";
import { ILocationModel } from "../../../../components/address/LocationModel";
import { ListBlock } from "../../../../components/common/block";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IRequestListModel } from "../../request/RequestListModel";
import { IRequestModel } from "../../request/RequestModel";
import { IGuaranteeModel } from "../GuaranteeModel";
import GuaranteeFormBody from "./GuaranteeFormBody";

interface IGuaranteeFormEdit extends WithTranslation {
  guarantee: IGuaranteeModel;
  locationStore: ILocationModel;
  requestList: IRequestListModel;
  request: IRequestModel;
}
@observer
class GuaranteeFormEdit extends React.Component<IGuaranteeFormEdit> {
  public render() {
    const { guarantee, locationStore, requestList, request } = this.props;
    return (
      <Segment padded="very">
        <GuaranteeHeader guarantee={guarantee} disableEditBtn />
        {this.renderReferenceDocument()}
        <Form onSubmit={this.updateForm}>
          <GuaranteeFormBody
            guarantee={guarantee}
            locationStore={locationStore}
            requestList={requestList}
            request={request}
          />
        </Form>
      </Segment>
    );
  }
  private renderReferenceDocument() {
    const { guarantee, t } = this.props;
    const list = [];

    if (guarantee.agreementId && hasPermission("AGREEMENT.VIEW")) {
      list.push({
        title: t("module.loan.guaranteeDetail.referenceLoanContractNo"),
        description: guarantee.agreementDocumentNumber,
        url: `/loan/agreement/view/${guarantee.agreementId}/${guarantee.agreementDocumentNumber}`
      });
    }
    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
  private updateForm = async () => {
    const { guarantee } = this.props;
    try {
      await guarantee.updateGuarantee();
    } catch (e) {
      console.log(e);
    }
  };
}

export default withTranslation()(GuaranteeFormEdit);
