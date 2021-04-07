import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Form,
  Header,
  Modal,
  Radio,
  TextArea
} from "semantic-ui-react";
import { IEnumItemModel } from "../AppModel";

interface IM113AgreeementCancelation extends WithTranslation {
  title?: string;
  trigger: any;
  fieldName?: string;
  valueInput?: string;
  selectList?: IEnumItemModel[];
  onChangeInputField?: (fieldName: string, value: any) => void;
  onClick?: (value?: any) => void;
  style?: any;
}
@observer
class M113AgreeementCancelation extends React.Component<
  IM113AgreeementCancelation
> {
  public state = { open: false, selected: "" };
  public close = () => this.setState({ open: false });
  public open = () => this.setState({ open: true });
  public render() {
    const {
      t,
      trigger,
      fieldName,
      style,
      valueInput,
      selectList,
      title
    } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
        style={style}
      >
        <Modal.Header>
          <Header textAlign="center">{title}</Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              {selectList &&
                selectList!.map((item: any, index: number) => (
                  <React.Fragment key={index}>
                    <Form.Field
                      control={Radio}
                      label={item.text}
                      value={item.value}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        data: any
                      ) => this.setState({ selected: data.value })}
                      checked={this.state.selected === item.value}
                    />
                  </React.Fragment>
                ))}
            </Form.Group>
            <Form.Field
              control={TextArea}
              label={t("modal.M113AgreeementCancelation.reason")}
              value={valueInput}
              placeholder={t(
                "modal.M113AgreeementCancelation.pleaseSpecifyReasonUpdatingDocumentStatus"
              )}
              onChange={(event: any, data: any) =>
                this.onChangeInputField(fieldName!, data.value)
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            fluid
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M113AgreeementCancelation.confirm")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private onChangeInputField = (fieldName: string, value: any) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, value);
    }
  };
  private onClick = async () => {
    const { onClick } = this.props;
    if (typeof onClick !== "undefined") {
      await onClick(this.state.selected);
      this.close();
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};
export default withTranslation()(M113AgreeementCancelation);
