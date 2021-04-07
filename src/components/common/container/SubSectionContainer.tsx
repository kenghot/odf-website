import * as React from "react";
import { Link } from "react-router-dom";
import { Grid, Icon, Segment, SemanticICONS } from "semantic-ui-react";
import { COLORS } from "../../../constants";
export interface ISubSectionContainer {
  style?: any;
  children: any;
  footer?: any;
  fluid?: boolean;
  basic?: boolean;
  stretch?: boolean;
  onClick?: () => void;
  styleContent?: any;
  title?: string;
  titleComponent?: any;
  linkLabel?: string;
  linkRouterLabel?: string;
  linkRouterPathName?: string;
  linkModalLabel?: string;
  linkModalComponent?: any;
  iconName?: SemanticICONS;
  size?: "tiny" | "medium" | "big";
  idLink?: string;
}

class SubSectionContainer extends React.Component<ISubSectionContainer> {
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
      size,
      style,
    } = this.props;
    const fullContent = fluid ? styles.segment : undefined;

    return (
      <Grid padded={stretch ? false : true} style={style}>
        {!title && !linkLabel && !linkRouterLabel && !linkModalLabel ? null : (
          <Grid.Row
            columns={
              (title || titleComponent) &&
              (linkLabel || linkRouterLabel || linkModalLabel)
                ? 2
                : 1
            }
            verticalAlign="middle"
            style={styles.headerRowStyle}
          >
            {title || titleComponent ? (
              <Grid.Column floated="left" textAlign="left">
                {title ? (
                  <div className={`ui form ${size}`}>
                    <div className="field">
                      <label style={styles.headerTitleStyle}>{title}</label>
                    </div>
                  </div>
                ) : null}
                {titleComponent || null}
              </Grid.Column>
            ) : null}
            {linkLabel || linkRouterLabel || linkModalLabel ? (
              <Grid.Column floated="right" textAlign="right">
                <div className={`ui form ${size}`}>
                  <div className="field">
                    {linkLabel ? this.renderLinkLabel() : null}
                    {linkRouterLabel ? this.renderLinkRouter() : null}
                    {linkModalLabel ? this.renderLinkModal() : null}
                  </div>
                </div>
              </Grid.Column>
            ) : null}
          </Grid.Row>
        )}

        <Grid.Row columns={1} style={styles.row}>
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

  private renderLinkLabel = () => {
    const { linkLabel, iconName, idLink } = this.props;
    return (
      <label id={idLink} style={styles.linkStyle} onClick={this.onClick}>
        {linkLabel}
        <Icon
          id={idLink}
          name={iconName || "chevron right"}
          className="primary"
          style={styles.icon}
        />
      </label>
    );
  };

  private renderLinkRouter = () => {
    const { linkRouterLabel, idLink, iconName, linkRouterPathName } = this.props;
    return (
      <Link
        to={{
          pathname: linkRouterPathName,
        }}
        id={idLink}
      >
        <label style={styles.linkStyle}>
          {linkRouterLabel}
          <Icon
            name={iconName || "chevron right"}
            className="primary"
            style={styles.icon}
          />
        </label>
      </Link>
    );
  };

  private renderLinkModal = () => {
    const { iconName, linkModalComponent, linkModalLabel, idLink } = this.props;
    return (
      <React.Fragment>
        {React.cloneElement(linkModalComponent, {
          trigger: (
            <label style={styles.linkStyle} id={idLink}>
              {linkModalLabel}
              <Icon
                name={iconName || "chevron right"}
                className="primary"
                style={styles.icon}
              />
            </label>
          ),
        })}
      </React.Fragment>
    );
  };
}

const styles: any = {
  row: {
    paddingTop: 0,
  },
  icon: {
    marginLeft: 8,
    marginRight: 0,
    textDecoration: "none",
  },
  segment: {
    padding: 0,
  },
  linkStyle: {
    textDecoration: "underline",
    color: COLORS.blue,
    cursor: "pointer",
  },
  headerRowStyle: {
    paddingBottom: 0,
    marginBottom: 4,
  },
  headerTitleStyle: {
    // color: "rgba(0,0,0,0.6)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%",
  },
};

export default SubSectionContainer;
