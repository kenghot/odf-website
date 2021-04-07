import { observer } from "mobx-react";
import React from "react";
import { Message, MessageProps, TransitionablePortal } from "semantic-ui-react";
import { IMessageModel } from "./MessageModel";

interface IAlertMessage extends MessageProps {
    messageobj: IMessageModel;
    float?: boolean;
    timeout?: number;
}

@observer
class AlertMessage extends React.Component<IAlertMessage, any> {
    public render() {
        const { tigger } = this.props.messageobj;
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
        const { icon, title, message, messageType } = this.props.messageobj;
        return (
            <Message
                success={messageType === "success"}
                info={messageType === "info"}
                onDismiss={this.handleDismiss}
                style={float ? styles.messageStyle : undefined}
                icon={icon ? icon : "check circle"}
                header={title}
                content={message}
            />
        );
    };
    private handleDismiss = () => {
        this.props.messageobj.setField({ fieldname: "tigger", value: false });
    };
    private handleOpen = () => {
        if (this.props.timeout) {
            setTimeout(() => {
                this.props.messageobj.setField({
                    fieldname: "tigger",
                    value: false,
                });
            }, this.props.timeout);
        }
    };
}
const styles: any = {
    link: {
        paddingRight: 10,
        paddingBottom: 10,
    },
    messageStyle: {
        left: "21%",
        position: "fixed",
        top: "45%",
        zIndex: 1000,
        width: "75vw",
    },
};
export default AlertMessage;
