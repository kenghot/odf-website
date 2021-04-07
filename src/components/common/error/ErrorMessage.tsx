import { observer } from "mobx-react";
import React from "react";
import {
  Message,
  MessageProps,
  Modal,
  TransitionablePortal
} from "semantic-ui-react";
import { Link } from "../button";
import { IErrorModel } from "./ErrorModel";

interface IErrorMessage extends MessageProps {
  errorobj: IErrorModel;
  float?: boolean;
  timeout?: number;
  id?: string;
}

@observer
class ErrorMessage extends React.Component<IErrorMessage, any> {
  public render() {
    const { tigger } = this.props.errorobj;
    if (tigger) {
      return this.props.float ? (
        <TransitionablePortal open={tigger} onOpen={this.handleOpen}>
          {this.renderMessage(true)}
        </TransitionablePortal>
      ) : (
        this.renderMessage(false)
      );
    }
    return null;
  }
  private renderMessage = (float: boolean) => {
    const {
      tigger,
      code,
      title,
      message,
      technical_stack
    } = this.props.errorobj;
    return (
      <Message
        id={this.props.id}
        negative
        onDismiss={this.handleDismiss}
        hidden={!tigger}
        style={float ? styles.messageStyle : undefined}
      >
        <Message.Header>{title}</Message.Header>
        {message}
        {technical_stack ? (
          <Modal
            trigger={
              <Link attached="bottom right" shade={1} style={styles.link}>
                ดูรายละเอียด
              </Link>
            }
            header={`${code}: ${title}`}
            content={technical_stack}
          />
        ) : null}
      </Message>
    );
  };
  private handleDismiss = () => {
    this.props.errorobj.setField({ fieldname: "tigger", value: false });
  };
  private handleOpen = () => {
    if (this.props.timeout) {
      setTimeout(() => {
        this.props.errorobj.setField({
          fieldname: "tigger",
          value: false
        });
      }, this.props.timeout);
    }
  };
}
const styles: any = {
  link: {
    paddingRight: 10,
    paddingBottom: 10
  },
  messageStyle: {
    left: "19%",
    position: "fixed",
    top: "0",
    zIndex: 1000,
    width: "80vw"
  }
};
export default ErrorMessage;
