import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, FormSelectProps } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";

export interface ITitleDDL extends FormSelectProps, WithTranslation {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class TitleDDL extends React.Component<ITitleDDL> {
  public options = this.props.appStore!.enumItems("titleType").slice();
  public optionsCheck = this.options.slice().map((op: any) => {
    return op.value;
  });

  public componentDidMount() {
    if (this.props.value && this.options.length) {
      if (!this.optionsCheck.includes(this.props.value)) {
        this.options.slice().push({
          key: this.props.value,
          text: this.props.value,
          value: this.props.value
        });
      }
    }
  }
  public componentDidUpdate(prevProps: any) {
    if (this.props.value !== prevProps.value) {
      if (this.props.value && this.options.length) {
        if (!this.optionsCheck.includes(this.props.value)) {
          this.options.slice().push({
            key: this.props.value,
            text: this.props.value,
            value: this.props.value
          });
          this.optionsCheck = this.options.slice().map((op: any) => {
            return op.value;
          });
          this.forceUpdate();
        }
      }
    }
  }

  public render() {
    const {
      id,
      search,
      value,
      onChange,
      fluid,
      placeholder,
      width,
      label,
      required
    } = this.props;
    if (!this.options.length) {
      this.options = this.props.appStore!.enumItems("titleType").slice();
    }
    this.optionsCheck = this.options.slice().map((op: any) => {
      return op.value;
    });
    if (this.props.value && !this.optionsCheck.includes(this.props.value)) {
      this.options.push({
        key: this.props.value,
        text: this.props.value,
        value: this.props.value
      });
    }
    return (
      <Form.Select
        required={required}
        id={id}
        fluid={fluid}
        search={search}
        options={this.options}
        placeholder={placeholder}
        label={label}
        width={width}
        value={value}
        onChange={onChange}
      />
    );
  }
}
export default withTranslation()(TitleDDL);
