import React from "react";
import { Grid } from "semantic-ui-react";
interface IPageContainer {
  children: any;
}

class PageContainer extends React.Component<IPageContainer> {
  public render() {
    const { children } = this.props;
    return (
      <Grid
        columns="equal"
        centered
        padded="vertically"
        style={styles.container}
      >
        <Grid.Row>
          <Grid.Column only="tablet computer" />
          <Grid.Column computer="14" tablet="14" mobile="16">
            {children}
          </Grid.Column>
          <Grid.Column only="tablet computer" />
        </Grid.Row>
      </Grid>
    );
  }
}
const styles: any = {
  container: {
    paddingTop: 20,
    height: "100vh",
  },
};
export default PageContainer;
