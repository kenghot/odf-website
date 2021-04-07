import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header, Modal, Segment } from "semantic-ui-react";
import { IAccountReceivableModel } from "../modules/accountReceivable/AccountReceivableModel";
import {
  AccountReceivableBorrowerGuarantorInfo,
  AccountReceivableHeader,
  AccountReceivableReferenceDocument
} from "../modules/accountReceivable/components";

interface IBorrowerGuarantorInfoModal
  extends WithTranslation,
    RouteComponentProps {
  trigger?: any;
  accountReceivable?: IAccountReceivableModel;
  activeIndexTab?: number;
  editMode?: boolean;
  headerTitle?: string;
}

@observer
class BorrowerGuarantorInfoModal extends React.Component<
  IBorrowerGuarantorInfoModal
> {
  public state = { open: false };

  public close = () => {
    this.setState({ open: false });
  };
  public open = () => {
    this.setState({ open: true });
  };
  public render() {
    const {
      t,
      trigger,
      accountReceivable,
      activeIndexTab,
      editMode,
      headerTitle
    } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="fullscreen"
        className={"no-action"}
      >
        <Modal.Header>
          <Header textAlign="center">{headerTitle}</Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Segment basic padded style={styles.segment}>
            {accountReceivable ? (
              <React.Fragment>
                <AccountReceivableHeader
                  accountReceivableStatus={accountReceivable.status}
                  hideActionButtons
                  accountReceivable={accountReceivable}
                />
                <AccountReceivableReferenceDocument
                  accountReceivable={accountReceivable}
                />
                <AccountReceivableBorrowerGuarantorInfo
                  accountReceivable={accountReceivable}
                  activeIndexTab={activeIndexTab}
                  editMode={editMode}
                />
              </React.Fragment>
            ) : null}
          </Segment>
        </Modal.Content>
      </Modal>
    );
  }
}
const styles: any = {
  segment: {
    margin: 0
  }
};

export default withRouter(withTranslation()(BorrowerGuarantorInfoModal));
