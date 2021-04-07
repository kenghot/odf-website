import React, { Suspense } from "react";
import { Grid } from "semantic-ui-react";
import { Loading } from "../../../components/common/loading";

interface IFallBack {
  children: any;
  inverted?: boolean;
}
class FallBack extends React.Component<IFallBack> {
  public render() {
    return (
      <Suspense
        fallback={
          <Grid celled padded style={{ height: "100vh" }}>
            <Loading active={true} />
          </Grid>
        }
      >
        {this.props.children}
      </Suspense>
    );
  }
}
export default FallBack;
