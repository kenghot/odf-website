import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Tab } from "semantic-ui-react";
import { RequestDetail, RequestFormConsideration } from ".";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IRequestModel } from "../RequestModel";
import FactSheet from "./FactSheet";
import RequestValidation from "./RequestValidation";

interface IRequestTab extends WithTranslation {
  request: IRequestModel;
}

@observer
class RequestTab extends React.Component<IRequestTab> {
  public render() {
    const { request, t } = this.props;
    const panes = [];
    panes.push({
      menuItem: t("module.loan.requestDetail.requestForm"),
      render: () => <Tab.Pane>{<RequestDetail request={request} />}</Tab.Pane>
    });
    if (request.status !== "DF" || hasPermission("DATA.ALL.EDIT")) {
      if (hasPermission("REQUEST.VALIDATE") || hasPermission("DATA.ALL.EDIT")) {
        panes.push({
          menuItem: t("module.loan.requestDetail.checkQualifications"),
          render: () => (
            <Tab.Pane>
              <RequestValidation request={request} />
            </Tab.Pane>
          )
        });
      }
      if (
        hasPermission("REQUEST.FACTSHEET") ||
        hasPermission("DATA.ALL.EDIT")
      ) {
        panes.push({
          menuItem: t("module.loan.requestDetail.checkFacts"),
          render: () => (
            <Tab.Pane>
              <FactSheet request={request} />
            </Tab.Pane>
          )
        });
      }
      if (
        hasPermission("REQUEST.CONSOLIDATION") ||
        hasPermission("DATA.ALL.EDIT")
      ) {
        panes.push({
          menuItem: t("module.loan.requestDetail.approvalResults"),
          render: () => (
            <Tab.Pane>
              <RequestFormConsideration request={request} />
            </Tab.Pane>
          )
        });
      }
    }
    return (
      <Tab
        panes={panes}
        menu={{
          tabular: true,
          attached: true,
          fluid: true
        }}
      />
    );
  }
}

export default withTranslation()(RequestTab);
