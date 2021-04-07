import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Icon, Menu, Tab } from "semantic-ui-react";

import { GuaranteeFormBorrowerInfo, GuaranteeFormGuarantorInfo } from ".";
import { SubSectionContainer } from "../../../../components/common";
import { IDCardModel } from "../../../../components/idcard";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import {
  GuaranteeItemModel,
  IGuaranteeItemModel,
  IGuaranteeModel
} from "../GuaranteeModel";

interface IGuaranteeBorrowerGuarantorList extends WithTranslation {
  guarantee: IGuaranteeModel;
  mode: "editMode" | "createMode";
}

@observer
class GuaranteeBorrowerGuarantorList extends React.Component<
  IGuaranteeBorrowerGuarantorList
> {
  public state = {
    activeIndex: 0
  };
  public componentDidMount() {
    if (this.props.mode === "createMode") {
      this.props.guarantee.addGuaranteeItems(
        GuaranteeItemModel.create({}),
        IDCardModel.create({})
      );
    }
  }
  public handleTabChange = (e: any, data: any) =>
    this.setState({ activeIndex: data.activeIndex });

  public render() {
    const { guarantee } = this.props;
    switch (guarantee.guaranteeType) {
      case "G":
        return this.renderGroup(guarantee);
      default:
        return this.renderPerson(guarantee);
    }
  }
  private renderGroup(guarantee: IGuaranteeModel) {
    const { t } = this.props;
    const { activeIndex } = this.state;
    const panes = guarantee.guaranteeItems.map(
      (item: IGuaranteeItemModel, index: number) => ({
        menuItem: (
          <Menu.Item key={index}>
            {"# " + (index + 1).toString()}
            {index === 0 ? null : (
              <Icon
                name="x"
                link
                onClick={() =>
                  this.onRemoveGuarantorItem(
                    index,
                    item,
                    guarantee.idCardItems[index]
                  )
                }
              />
            )}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane key={index}>
            <Form.Field
              label={t("module.loan.guaranteeDetail.vendorInformation")}
              control={GuaranteeFormGuarantorInfo}
              guaranteeItem={item}
              idCardItem={guarantee.idCardItems[index]}
              documentDate={guarantee.documentDate}
            />
            <Form.Field
              label={t("module.loan.guaranteeDetail.informationBorrowers")}
              width={16}
              control={GuaranteeFormBorrowerInfo}
              guaranteeItem={item}
            />
          </Tab.Pane>
        )
      })
    );
    return (
      <SubSectionContainer
        title={t("module.loan.guaranteeDetail.listGuarantee")}
        style={styles.container}
        stretch
        basic
        fluid
        linkLabel={t("module.loan.guaranteeDetail.addListSponsors")}
        iconName="plus circle"
        onClick={() =>
          guarantee.addGuaranteeItems(
            GuaranteeItemModel.create({}),
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
            widths: guarantee.guaranteeItems.length
          }}
        />
      </SubSectionContainer>
    );
  }

  private renderPerson(guarantee: IGuaranteeModel) {
    const { t } = this.props;
    return (
      <React.Fragment>
        {guarantee.guaranteeItems.map(
          (item: IGuaranteeItemModel, index: number) => {
            return (
              <React.Fragment key={index}>
                <Form.Field
                  label={t("module.loan.guaranteeDetail.vendorInformation")}
                  control={GuaranteeFormGuarantorInfo}
                  guaranteeItem={item}
                  idCardItem={guarantee.idCardItems[index]}
                  documentDate={guarantee.documentDate}
                />
                <Form.Field
                  label={t("module.loan.guaranteeDetail.informationBorrowers")}
                  width={16}
                  control={GuaranteeFormBorrowerInfo}
                  guaranteeItem={item}
                />
              </React.Fragment>
            );
          }
        )}
      </React.Fragment>
    );
  }
  private onRemoveGuarantorItem = async (
    index: number,
    guaranteeItem: IGuaranteeItemModel,
    idCardItems: IIDCardModel
  ) => {
    await guaranteeItem.onRemove();
    await idCardItems.onRemove();
    await this.setState({ activeIndex: index - 1 });
  };
}
const styles: any = {
  container: {
    marginBottom: 7
  }
};

export default withTranslation()(GuaranteeBorrowerGuarantorList);
