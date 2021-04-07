import * as React from "react";
import { Link } from "react-router-dom";
import { Text } from "..";
import { IText } from "../text/Text";

export interface ILinkRouter extends IText {
  path: string;
  state?: string;
  hideUnderline?: boolean;
  id?: string;
}

class LinkRouter extends React.Component<ILinkRouter> {
  public render() {
    const { path, children, hideUnderline, state, id, ...rest } = this.props;
    return (
      <Link
        to={{
          pathname: path,
          state: state || ""
        }}
        id={id}
      >
        <Text underline={!hideUnderline} {...rest}>
          {children}
        </Text>
      </Link>
    );
  }
}

export default LinkRouter;
