import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { IAddressModel } from "../components/address";
import { MapMarker } from "../components/common/map";

interface IMapModal extends WithTranslation {
  trigger: any;
  address: IAddressModel;
  mode?: "editMode" | "createMode";
}
@observer
class MapModal extends React.Component<IMapModal> {
  public state = { open: false };
  public close = () => this.setState({ open: false });
  public open = () => this.setState({ open: true });
  public render() {
    const { address, mode } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={this.props.trigger}
        onOpen={this.open}
        open={open}
        onClose={this.close}
        closeIcon
        size="tiny"
      >
        <Modal.Content style={styles.modalContentStyle}>
          <Modal.Description>
            <MapMarker addressStore={address} mode={mode} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const styles: any = {
  modalContentStyle: {
    padding: 0,
  },
};

export default withTranslation()(MapModal);
