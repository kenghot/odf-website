import { observer } from "mobx-react";
import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface ILoading {
  active: boolean;
}

@observer
class Loading extends React.Component<ILoading> {
  public render() {
    return (
      <Dimmer active={this.props.active} inverted style={styles.dimmer}>
        <Loader size="large">ระบบกำลังประมวลผล กรุณารอสักครู่</Loader>
      </Dimmer>
    );
  }
}
const styles: any = {
  dimmer: {
    zIndex: 900
  }
};
export default Loading;
