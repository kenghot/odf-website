import * as React from "react";
import {
  Grid,
  Header,
  Icon,
  Segment,
  SemanticICONS,
  SemanticSIZES
} from "semantic-ui-react";
import { IconSizeProp } from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { COLORS } from "../../../constants";
import { Link, LinkRouter } from "../button";
export interface ISectionContainer {
  size?: "small" | "medium" | "large";
  title?: string;
  titleComponent?: any;
  style?: any;
  children: any;
  footer?: any;
  iconName?: SemanticICONS;
  fluid?: boolean;
  basic?: boolean;
  stretch?: boolean;
  onClick?: () => void;
  styleContent?: any;
  linkLabel?: string;
  linkRouterLabel?: string;
  linkRouterPathName?: string;
  linkModalLabel?: string;
  linkModalComponent?: any;
  id?: string;
  idLink?: string;
}

interface ISizeStyle {
  sizeHeader: "tiny" | "small" | "medium" | "large" | "huge";
  sizeLink: SemanticSIZES;
  sizeIcon: IconSizeProp | undefined;
}

class SectionContainer extends React.Component<ISectionContainer> {
  public render() {
    const {
      title,
      titleComponent,
      children,
      linkLabel,
      footer,
      fluid,
      linkRouterLabel,
      linkModalLabel,
      styleContent,
      basic,
      stretch,
      style,
      id
    } = this.props;
    const sizeStyle = this.getSize();
    const fullContent = fluid ? styles.segment : undefined;

    return (
      <Grid id={id} padded={stretch ? false : true} style={style}>
        {!title &&
        !titleComponent &&
        !linkLabel &&
        !linkRouterLabel &&
        !linkModalLabel ? null : (
          <Grid.Row
            columns={
              (title || titleComponent) &&
              (linkLabel || linkRouterLabel || linkModalLabel)
                ? 2
                : 1
            }
            verticalAlign="middle"
          >
            {title || titleComponent ? (
              <Grid.Column floated="left" textAlign="left">
                {title ? (
                  <Header size={sizeStyle.sizeHeader} style={styles.header}>
                    {title}
                  </Header>
                ) : null}
                {titleComponent || null}
              </Grid.Column>
            ) : null}
            {linkLabel || linkRouterLabel || linkModalLabel ? (
              <Grid.Column floated="right" textAlign="right">
                {linkLabel ? this.renderLinkLabel() : null}
                {linkRouterLabel ? this.renderLinkRouter() : null}
                {linkModalLabel ? this.renderLinkModal() : null}
              </Grid.Column>
            ) : null}
          </Grid.Row>
        )}

        <Grid.Row columns={1} style={{ ...styles.row }}>
          <Grid.Column>
            <Segment basic={basic} style={{ ...styleContent, ...fullContent }}>
              {children}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        {footer ? (
          <Grid.Row columns={1} style={styles.row}>
            <Grid.Column floated="right" textAlign="right">
              {footer}
            </Grid.Column>
          </Grid.Row>
        ) : null}
      </Grid>
    );
  }
  private onClick = () => {
    const { onClick } = this.props;
    if (typeof onClick !== "undefined") {
      onClick();
    }
  };

  private getSize = () => {
    const { size } = this.props;
    const style: ISizeStyle = {
      sizeHeader: "medium",
      sizeLink: "large",
      sizeIcon: "large"
    };
    switch (size) {
      case "small":
        style.sizeHeader = "tiny";
        style.sizeLink = "tiny";
        style.sizeIcon = undefined;
        break;
      case "medium":
        style.sizeHeader = "medium";
        style.sizeLink = "large";
        style.sizeIcon = "large";
        break;
      case "large":
        style.sizeHeader = "large";
        style.sizeLink = "big";
        style.sizeIcon = "big";
        break;
      default:
        style.sizeHeader = "medium";
        style.sizeLink = "large";
        style.sizeIcon = "large";
        break;
    }
    return style;
  };

  private renderLinkLabel = () => {
    const sizeStyle = this.getSize();
    const { linkLabel, iconName, idLink } = this.props;
    return (
      <React.Fragment>
        <Link
          id={idLink}
          shade={5}
          size={sizeStyle.sizeLink}
          onClick={this.onClick}
        >
          {linkLabel}
        </Link>
        {iconName ? (
          <Icon
            id={idLink}
            size={sizeStyle.sizeIcon}
            link
            name={iconName}
            className="primary"
            onClick={this.onClick}
            style={{ ...styles.icon }}
          />
        ) : null}
      </React.Fragment>
    );
  };

  private renderLinkRouter = () => {
    const sizeStyle = this.getSize();
    const {
      linkRouterLabel,
      iconName,
      linkRouterPathName,
      idLink
    } = this.props;
    return (
      <React.Fragment>
        <LinkRouter
          id={idLink}
          shade={5}
          size={sizeStyle.sizeLink}
          path={linkRouterPathName!}
        >
          {linkRouterLabel}
          <Icon
            size={sizeStyle.sizeIcon}
            link
            name={iconName || "chevron right"}
            className="primary"
            onClick={this.onClick}
            style={{ ...styles.icon }}
          />
        </LinkRouter>
      </React.Fragment>
    );
  };

  private renderLinkModal = () => {
    const sizeStyle = this.getSize();
    const { iconName, linkModalComponent, linkModalLabel, idLink } = this.props;
    return (
      <React.Fragment>
        {React.cloneElement(linkModalComponent, {
          trigger: (
            <Link
              id={idLink}
              shade={5}
              size={sizeStyle.sizeLink}
              onClick={this.onClick}
            >
              {linkModalLabel}
              {iconName ? (
                <Icon
                  size={sizeStyle.sizeIcon}
                  link
                  name={iconName}
                  className="primary"
                  onClick={this.onClick}
                  style={{ ...styles.icon }}
                />
              ) : null}
            </Link>
          )
        })}
      </React.Fragment>
    );
  };
}

const styles = {
  row: {
    paddingTop: 0
  },
  icon: {
    marginLeft: 8,
    marginRight: 0,
    textDecoration: "none",
    color: COLORS.blue
  },
  segment: {
    padding: 0
  },
  header: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%"
  }
};

export default SectionContainer;
