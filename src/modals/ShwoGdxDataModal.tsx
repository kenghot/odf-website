import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal, Segment } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import {
  AlertMessage,
  DateInput,
  ErrorMessage,
  FormDisplay,
} from "../components/common";
import { CurrencyInput } from "../components/common/input";
import { Loading } from "../components/common/loading";
import {
  AccountReceivableTransactionsModel,
  IAccountReceivableModel,
  IAccountReceivableTransactionsModel,
} from "../modules/accountReceivable/AccountReceivableModel";
import moment from "moment";
import { date_display_CE_TO_BE } from "../utils";
import {
  AddressBody,
  AddressFormBody,
  LocationModel
} from "../components/address";

interface IShwoGdxDataModal extends WithTranslation {
  trigger?: any;
  arTransactionsItem?: IAccountReceivableTransactionsModel;
  accountReceivable: IAccountReceivableModel;
  appStore?: IAppModel;
  editMode?: boolean;
}

@inject("appStore")
@observer
class ShwoGdxDataModal extends React.Component<IShwoGdxDataModal> {
  public state = {
    open: false,
  };
  public arTransactionsItem = AccountReceivableTransactionsModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.arTransactionsItem.resetAll();
  };
  public open = () => {
    this.setState({ open: true });

  };
  public render() {
    const { trigger, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.ShowGdxDataModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <AlertMessage
            messageobj={this.arTransactionsItem.alert}
            float={true}
            timeout={3000}
          />
          <Loading active={this.arTransactionsItem.loading} />
          <ErrorMessage
            errorobj={this.arTransactionsItem.error}
            float={true}
            timeout={10000}
          />
          {this.renderContent()}

        </Modal.Content>
        <Modal.Actions>
          {/* {this.renderActions()} */}
        </Modal.Actions>
      </Modal>
    );
  }
  public renderContent() {
    const { accountReceivable, editMode, t } = this.props;
    return (
      <Segment padded >
        <Form>
          {
            <React.Fragment >
              <Form.Group widths="equal">
                <FormDisplay
                  title={t(
                    "modal.ShowGdxDataModal.name"
                  )}
                  value={accountReceivable.gdxFullName || "-"}
                />
                <FormDisplay
                  title={t(
                    "modal.ShowGdxDataModal.iDCardNumber"
                  )}
                  value={accountReceivable.gdxIdCardNo || "-"}
                />
                <FormDisplay
                  title={t(
                    "modal.ShowGdxDataModal.dateOfBirth"
                  )}
                  value={date_display_CE_TO_BE(accountReceivable.gdxBirthday) || "-"}
                />
              </Form.Group>
            </React.Fragment>

          }
          <Segment padded>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("modal.ShowGdxDataModal.addressContacted")}
                value={accountReceivable.gdxAddress || "-"}
              />

            </Form.Group>
          </Segment>
        </Form>
      </Segment>
    );
  }


  private onChangeInputField = (fieldname: string, value: any) => {
    this.arTransactionsItem.setField({ fieldname, value });
  };


}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0,
  },
};
export default withTranslation()(ShwoGdxDataModal);
