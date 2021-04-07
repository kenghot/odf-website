import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Icon, Menu, Tab } from "semantic-ui-react";

import { RequestFormInfoBorrower, RequestFormInfoGuarantor } from ".";
import { SubSectionContainer } from "../../../../components/common";
import { IDCardModel } from "../../../../components/idcard";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import {
  IRequestItemModel,
  IRequestModel,
  RequestItemModel
} from "../RequestModel";

interface IRequesFormBorrowerGuarantorList extends WithTranslation {
  request: IRequestModel;
  mode: "editMode" | "createMode";
}

@observer
class RequesFormBorrowerGuarantorList extends React.Component<
  IRequesFormBorrowerGuarantorList
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
          <Menu.Item key={index}>
            {"# " + (index + 1).toString()}
            {index === 0 ? null : (
              <Icon
                name="x"
                link
                onClick={() =>
                  this.onRemoveBorrowerItem(
                    index,
                    item,
                    request.idCardBorrowerItems[index],
                    request.idCardGuarantorItems[index],
                    request.idCardSpouseItems[index]
                  )
                }
              />
            )}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane key={index}>
            <Form.Field
              key={index}
              label={t("module.loan.agreementDetail.informationBorrowers")}
              control={RequestFormInfoBorrower}
              documentDate={request.documentDate}
              requestItems={item}
              idCardBorrowerItems={request.idCardBorrowerItems[index]}
              idCardSpouseItems={request.idCardSpouseItems[index]}
            />
            <Form.Field
              label={t("module.loan.agreementFormCreate.vendorInformation")}
              width={16}
              control={RequestFormInfoGuarantor}
              documentDate={request.documentDate}
              requestItems={item}
              idCardItem={request.idCardGuarantorItems[index]}
            />
          </Tab.Pane>
        )
      })
    );
    return (
      <React.Fragment>
        <Form.Input
          label={t("module.loan.requestDetail.groupName")}
          fluid
          placeholder={t("module.loan.requestDetail.specifyGroupName")}
          value={request.name}
          onChange={(event: any, data: any) => {
            request.setField({
              fieldname: "name",
              value: data.value
            });
          }}
        />
        <SubSectionContainer
          title={t("module.loan.requestDetail.listBorrowers")}
          style={styles.container}
          stretch
          basic
          fluid
          linkLabel={t("module.loan.requestDetail.addListBorrowers")}
          iconName="plus circle"
          onClick={() =>
            request.addRequestItems(
              RequestItemModel.create({}),
              IDCardModel.create({}),
              IDCardModel.create({}),
              IDCardModel.create({})
            )
          }
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
      </React.Fragment>
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
                control={RequestFormInfoBorrower}
                documentDate={request.documentDate}
                requestItems={item}
                idCardBorrowerItems={request.idCardBorrowerItems[index]}
                idCardSpouseItems={request.idCardSpouseItems[index]}
              />
              <Form.Field
                label={t("module.loan.agreementFormCreate.vendorInformation")}
                width={16}
                control={RequestFormInfoGuarantor}
                documentDate={request.documentDate}
                requestItems={item}
                idCardItem={request.idCardGuarantorItems[index]}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }

  private onRemoveBorrowerItem = async (
    index: number,
    requesItem: IRequestItemModel,
    idCardBorrowerItems: IIDCardModel,
    idCardGuarantorItems: IIDCardModel,
    idCardSpouseItems: IIDCardModel
  ) => {
    await requesItem.onRemove();
    await idCardBorrowerItems.onRemove();
    await idCardGuarantorItems.onRemove();
    await idCardSpouseItems.onRemove();
    await this.setState({ activeIndex: index - 1 });
  };
}
const styles: any = {
  container: {
    marginBottom: 7
  }
};

export default withTranslation()(RequesFormBorrowerGuarantorList);
