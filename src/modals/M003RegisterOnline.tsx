import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Form,
  Header,
  Icon,
  Menu,
  Modal,
  Tab
} from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { SubSectionContainer } from "../components/common";
import { IDCardModel } from "../components/idcard";
import { IIDCardModel } from "../components/idcard/IDCardModel";
import {
  RequesFormSimpleGuarantor,
  RequestFormSimpleBorrower
} from "../modules/loan/request/components";
import {
  IRequestItemModel,
  IRequestModel,
  RequestItemModel
} from "../modules/loan/request/RequestModel";
import { IUserModel } from "../modules/admin/user/UserModel";
import { OrganizationDDL } from "../modules/admin/organization/components";
import { OrgListModel } from "../modules/admin/organization/OrgListModel";
import { UserModel } from "../modules/admin/user";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IM003RegisterOnline extends WithTranslation, RouteComponentProps {
  trigger?: any;
  appStore?: IAppModel;
  requestCreate?: IRequestModel;
  authStore?: IAuthModel;
}

@inject("appStore", "requestCreate", "authStore")
@observer
class M003RegisterOnline extends React.Component<IM003RegisterOnline> {
  private user = UserModel.create({});
  private orgList = OrgListModel.create({});
  public _isMounted = false;

  public componentDidMount() {
    if (this.props.requestCreate!.requestItems.length === 0) {
      this.props.requestCreate!.setRequestItems();
    }
  }
  public state = { open: false, activeIndex: 0 };

  public handleTabChange = (e: any, data: any) =>
    this.setState({ activeIndex: data.activeIndex });

  public close = () => {
    this.setState({ open: false });
    // this.props.requestCreate!.resetAll();
  };
  public open = () => {
    this.setState({ open: true });
    if (this.props.requestCreate!.requestItems.length === 0) {
      this.props.requestCreate!.setRequestItems();
    }
  };
  public render() {
    const { t, trigger, appStore, requestCreate, authStore } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="fullscreen"
      // {...rest}
      >
        <Modal.Header>
          <Header textAlign="center" id="header-text-m106">
            {t("page.loginPage.registerBorrower")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Form onSubmit={this.createUserForm}>
            <Form.Select
              search
              fluid
              label={t("module.loan.agreementFormCreate.category")}
              placeholder={t(
                "module.loan.agreementFormCreate.pleaseSelectCategory"
              )}
              options={appStore!.enumItems("loanType")}
              onChange={(event, data) =>
                requestCreate!.setField({
                  fieldname: "requestType",
                  value: data.value
                })
              }
              value={requestCreate!.requestType}
            />
            {/* <Form.Input
              id="form-input-username"
              required
              label={t("page.loginPage.username")}
              icon="user"
              iconPosition="left"
              placeholder={t("page.loginPage.username")}
              style={styles.textInputStyle}
              width="16"
              onChange={(event: any, data: any) =>
                authStore!.userProfile.setField({
                  fieldname: "username",
                  value: data.value
                })
              }
              value={authStore!.userProfile.username || ""}
            /> */}
            <Form.Button
              id={"btn-submit-forget-password"}
              primary
              floated="right"
              type="submit"
            >
              {t("continue")}
            </Form.Button>
            {/* {this.renderBody()} */}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            id="btn-submit-create-request-modal"
            disabled={!requestCreate!.check_list_verify}
            onClick={this.navigationToRequestCreatePage}
            style={styles.button}
          >
            {t("module.loan.requestDetail.createRequest")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public renderBody() {
    const { requestCreate } = this.props;
    switch (requestCreate!.requestType) {
      case "G":
        return this.renderGroup(requestCreate!);
      default:
        return this.renderPerson(requestCreate!);
    }
  }
  private navigationToRequestCreatePage = async () => {
    const { history } = this.props;
    // this.setState({ open: false });
    this.close();
    history.push("/loan/request/create");
  };
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
              control={RequestFormSimpleBorrower}
              requestItem={item}
              idCardBorrowerItems={request.idCardBorrowerItems[index]}
              documentDate={request.documentDate}
            />
            <Form.Field
              label={t("module.loan.agreementFormCreate.vendorInformation")}
              width={16}
              control={RequesFormSimpleGuarantor}
              requestItem={item}
              idCardItem={request.idCardGuarantorItems[index]}
              documentDate={request.documentDate}
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
                control={RequestFormSimpleBorrower}
                requestItem={item}
                idCardBorrowerItems={request.idCardBorrowerItems[index]}
                documentDate={request.documentDate}
              />
              <Form.Field
                label={t("module.loan.agreementFormCreate.vendorInformation")}
                width={16}
                control={RequesFormSimpleGuarantor}
                requestItem={item}
                idCardItem={request.idCardGuarantorItems[index]}
                documentDate={request.documentDate}
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
  private createUserForm = async () => {
    const { authStore } = this.props;
    try {
      authStore!.userProfile.setField({
        fieldname: "username",
        value: "beer00004"
      })
      authStore!.userProfile.setField({
        fieldname: "active",
        value: true
      })
      authStore!.userProfile.setField({
        fieldname: "createdBy",
        value: 1
      })
      authStore!.userProfile.setField({
        fieldname: "createdDate",
        value: "2021-08-15T14:33:34.360Z"
      })
      authStore!.userProfile.setField({
        fieldname: "id",
        value: ""
      })
      authStore!.userProfile.setField({
        fieldname: "organizationId",
        value: null
      })
      authStore!.userProfile.setField({
        fieldname: "signinCount",
        value: 0
      })
      authStore!.userProfile.setField({
        fieldname: "resetPasswordToken",
        value: ""
      })
      authStore!.userProfile.setField({
        fieldname: "resetPasswordTokenExpiration",
        value: "-1"
      })
      authStore!.userProfile.setField({
        fieldname: "createdByName",
        value: "registonline1"
      })
      authStore!.userProfile.setField({
        fieldname: "updatedByName",
        value: ""
      })
      authStore!.userProfile.setField({
        fieldname: "email",
        value: "registonline@gmail.com"
      })
      authStore!.userProfile.setField({
        fieldname: "2021-08-15T14:33:34.360Z",
        value: "registonline@gmail.com"
      })
      console.log(authStore!.userProfile)
      await authStore!.userProfile.createUser();
      // authStore.push(`/admin/user_managment/edit/${user.id}/${user.username}`);

    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};
export default withRouter(withTranslation()(M003RegisterOnline));
