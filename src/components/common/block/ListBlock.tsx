import * as React from "react";
import { Link } from "react-router-dom";
import { Form, Grid, Segment } from "semantic-ui-react";
import { COLORS } from "../../../constants";
import { FormDisplay } from "../formdisplay";

interface IItem {
  title: string;
  description: string;
  url: string;
  children?: any;
}
interface IListBlock {
  list: IItem[];
  bgColor?: string;
  textColor?: string;
}
class ListBlock extends React.Component<IListBlock> {
  public render() {
    const { list, bgColor, textColor } = this.props;
    return (
      <Form>
        <Segment.Group
          horizontal
          style={{
            backgroundColor: `${bgColor ? bgColor : "white"}`,
            color: `${textColor ? textColor : COLORS.black87}`
          }}
        >
          {list.map((_item: IItem, index: number) => {
            return (
              <Segment key={index}>
                <Grid columns="equal" stackable>
                  <Grid.Row>
                    {_item.title && _item.description ? (
                      <Grid.Column>
                        {_item.url ? (
                          <Link to={_item.url}>
                            <FormDisplay
                              title={_item.title}
                              value={_item.description}
                            />
                          </Link>
                        ) : (
                          <FormDisplay
                            title={_item.title}
                            value={_item.description}
                          />
                        )}
                      </Grid.Column>
                    ) : null}
                    {_item.children ? (
                      <Grid.Column>{_item.children}</Grid.Column>
                    ) : null}
                  </Grid.Row>
                </Grid>
              </Segment>
            );
          })}
        </Segment.Group>
      </Form>
    );
  }
}
export default ListBlock;
