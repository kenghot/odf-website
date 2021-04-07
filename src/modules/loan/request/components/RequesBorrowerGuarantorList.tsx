import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Menu, Tab } from "semantic-ui-react";
import { RequesInfoGuarantor, RequestInfoBorrower } from ".";
import { SubSectionContainer } from "../../../../components/common";
import { IRequestItemModel, IRequestModel } from "../RequestModel";

interface IRequesBorrowerGuarantorList extends WithTranslation {
  request: IRequestModel;
}
@observer
class RequesBorrowerGuarantorList extends React.Component<
  IRequesBorrowerGuarantorList
> {
  public state = {
    activeIndex: 0
  };

  public handleTabChange = (e: any, data: any) =>
    this.setState({ activeIndex: data.activeIndex });

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
    const { t } = this.props;
    const { activeIndex } = this.state;
    const panes = request.requestItems.map(
      (item: IRequestItemModel, index: number) => ({
        menuItem: (
          <Menu.Item key={index}>{"# " + (index + 1).toString()}</Menu.Item>
        ),
        render: () => (
          <Tab.Pane key={index}>
            <Form.Field
              label={t("module.loan.agreementDetail.informationBorrowers")}
              control={RequestInfoBorrower}
              requestItems={item}
            />
            <Form.Field
              label={t("module.loan.agreementFormCreate.vendorInformation")}
              width={16}
              control={RequesInfoGuarantor}
              requestItems={item}
            />
          </Tab.Pane>
        )
      })
    );
    return (
      <SubSectionContainer
        title={t("module.loan.requestDetail.listBorrowers")}
        style={styles.container}
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
  private renderPerson(request: IRequestModel) {
    const { t } = this.props;
    return (
      <React.Fragment>
        {request.requestItems.map((item: IRequestItemModel, index: number) => {
          return (
            <React.Fragment key={index}>
              <Form.Field
                label={t("module.loan.agreementDetail.informationBorrowers")}
                control={RequestInfoBorrower}
                requestItems={item}
              />
              <Form.Field
                label={t("module.loan.agreementFormCreate.vendorInformation")}
                width={16}
                control={RequesInfoGuarantor}
                requestItems={item}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}
const styles: any = {
  container: {
    marginBottom: 7
  }
};

export default withTranslation()(RequesBorrowerGuarantorList);
