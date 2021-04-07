import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Tab } from "semantic-ui-react";
import {
  RequestFormConsideration,
  RequestFormCreate,
  RequestFormEdit
} from ".";
import { hasPermission } from "../../../../utils/render-by-permission";
import RequestValidation from "../components/RequestValidation";
import { IRequestModel } from "../RequestModel";
import FactSheet from "./FactSheet";

interface IRequestFormTab extends WithTranslation {
  mode: "createMode" | "editMode";
  request: IRequestModel;
}

@observer
class RequestFormTab extends React.Component<IRequestFormTab> {
  public render() {
    const { request, mode, t } = this.props;
    const panes = [];
    if (mode === "createMode") {
      panes.push({
        menuItem: t("module.loan.requestDetail.requestForm"),
        render: () => (
          <Tab.Pane>
            <RequestFormCreate request={request} mode={mode} />
          </Tab.Pane>
        )
      });
    } else {
      panes.push({
        menuItem: t("module.loan.requestDetail.requestForm"),
        render: () => (
          <Tab.Pane>
            <RequestFormEdit request={request} mode={mode} />
          </Tab.Pane>
        )
      });
      if (request.status !== "DF" || hasPermission("DATA.ALL.EDIT")) {
        if (
          hasPermission("REQUEST.VALIDATE") ||
          hasPermission("DATA.ALL.EDIT")
        ) {
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

export default withTranslation()(RequestFormTab);
