import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Icon, Menu, Tab } from "semantic-ui-react";

import { AgreementFormInfoBorrower, AgreementFormInfoGuarantor } from ".";
import { SubSectionContainer } from "../../../../components/common";
import { IDCardModel } from "../../../../components/idcard";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import {
  AgreementItemModel,
  IAgreementItemModel,
  IAgreementModel
} from "../AgreementModel";

interface IAgreementFormBorrowerGuarantorList extends WithTranslation {
  agreement: IAgreementModel;
  mode: "editMode" | "createMode";
}

@observer
class AgreementFormBorrowerGuarantorList extends React.Component<
  IAgreementFormBorrowerGuarantorList
> {
  public state = {
    activeIndex: 0
  };
  public componentDidMount() {
    if (this.props.mode === "createMode") {
      this.props.agreement.addAgreementItems(
        AgreementItemModel.create({}),
        IDCardModel.create({})
      );
    }
  }
  public handleTabChange = (e: any, data: any) =>
    this.setState({ activeIndex: data.activeIndex });

  public render() {
    const { agreement } = this.props;
    switch (agreement.agreementType) {
      case "G":
        return this.renderGroup(agreement);
      default:
        return this.renderPerson(agreement);
    }
  }
  private renderGroup(agreement: IAgreementModel) {
    const { t } = this.props;
    const { activeIndex } = this.state;
    const panes = agreement.agreementItems.map(
      (item: IAgreementItemModel, index: number) => ({
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
                    agreement.idCardItems[index]
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
              control={AgreementFormInfoBorrower}
              agreementItem={item}
              idCardItem={agreement.idCardItems[index]}
              documentDate={agreement.documentDate}
            />
            <Form.Field
              label={t("module.loan.agreementFormCreate.vendorInformation")}
              width={16}
              control={AgreementFormInfoGuarantor}
              agreementItem={item}
            />
          </Tab.Pane>
        )
      })
    );
    return (
      <SubSectionContainer
        title={t("module.loan.agreementDetail.listBorrowers")}
        style={styles.container}
        stretch
        basic
        fluid
        linkLabel={t("module.loan.agreementDetail.addListBorrowers")}
        iconName="plus circle"
        onClick={() =>
          agreement.addAgreementItems(
            AgreementItemModel.create({}),
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
            widths: agreement.agreementItems.length
          }}
        />
      </SubSectionContainer>
    );
  }
  private renderPerson(agreement: IAgreementModel) {
    const { t } = this.props;
    return (
      <React.Fragment>
        {agreement.agreementItems.map(
          (item: IAgreementItemModel, index: number) => {
            return (
              <React.Fragment key={index}>
                <Form.Field
                  label={t("module.loan.agreementDetail.informationBorrowers")}
                  control={AgreementFormInfoBorrower}
                  agreementItem={item}
                  idCardItem={agreement.idCardItems[index]}
                  documentDate={agreement.documentDate}
                />
                <Form.Field
                  label={t("module.loan.agreementFormCreate.vendorInformation")}
                  width={16}
                  control={AgreementFormInfoGuarantor}
                  agreementItem={item}
                />
              </React.Fragment>
            );
          }
        )}
      </React.Fragment>
    );
  }

  private onRemoveBorrowerItem = async (
    index: number,
    agreementItem: IAgreementItemModel,
    idCardItems: IIDCardModel
  ) => {
    await agreementItem.onRemove();
    await idCardItems.onRemove();
    await this.setState({ activeIndex: index - 1 });
  };
}
const styles: any = {
  container: {
    marginBottom: 7
  }
};

export default withTranslation()(AgreementFormBorrowerGuarantorList);
