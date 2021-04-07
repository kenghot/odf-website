import { observer } from "mobx-react";
import React from "react";
import { Accordion, Form, Menu } from "semantic-ui-react";
import { InputLabel } from "../common";
import { IChoiceModel, IQuestionModel } from "./QuestionaireModel";

interface IQuestionairs {
  questionlist: IQuestionModel[];
}

@observer
class Questionaires extends React.Component<IQuestionairs> {
  public state = { activeIndex: [] as boolean[] };
  public handleClick = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    activeIndex[index] = !activeIndex[index];
    this.setState({ activeIndex });
  };
  public render() {
    const { questionlist } = this.props;
    const { activeIndex } = this.state;
    return (
      <Accordion as={Menu} vertical styled fluid>
        {questionlist.map((q: IQuestionModel, index: number) => (
          <Menu.Item key={`Q${index}`}>
            <Accordion.Title
              key={`title${index}`}
              active={
                typeof activeIndex[index] !== "undefined"
                  ? activeIndex[index]
                  : true
              }
              index={index}
              onClick={this.handleClick}
              content={q.question_label}
            />
            <Accordion.Content
              key={`content${index}`}
              active={
                typeof activeIndex[index] !== "undefined"
                  ? activeIndex[index]
                  : true
              }
            >
              <Form>{this.renderQuestion(q)}</Form>
            </Accordion.Content>
          </Menu.Item>
        ))}
      </Accordion>
    );
  }
  private renderQuestion(q: IQuestionModel) {
    switch (q.choice_type) {
      case "RADIO":
        return this.renderRadioQuestion(q);
      case "TEXT":
        return q.subfix ? (
          <Form.Field
            label={q.question_label}
            control={InputLabel}
            labelText={q.subfix}
            placeholder={q.default_answer}
            value={q.answer}
            onChangeInputField={(fieldname: string, value: string) => {
              q.setField({
                fieldname: "answer",
                value,
              });
            }}
          />
        ) : (
          <Form.Input
            inline
            fluid
            label={q.question_label}
            value={q.answer}
            placeholder={q.default_answer}
            onChange={(e, { value }) => {
              q.setField({
                fieldname: "answer",
                value: value ? value!.toString() : "",
              });
            }}
          />
        );
      case "GROUP":
        return q.child!.map((qC: IQuestionModel, index: number) => (
          <Form.Group grouped key={`QG${index}`}>
            {this.renderQuestion(qC)}
          </Form.Group>
        ));

      default:
        return null;
    }
  }
  private renderRadioQuestion(q: IQuestionModel) {
    return (
      <Form.Group grouped>
        {q.question_label && q.question_type !== "main" ? (
          <p>{q.question_label}</p>
        ) : null}
        {q.choice_list!.map((choice: IChoiceModel, index: number) => (
          <React.Fragment key={choice.key}>
            <Form.Radio
              label={choice.label}
              name={`Q${q.question_id}`}
              value={choice.value}
              checked={q.answer === choice.value}
              onChange={(e, { value }) => {
                q.setField({
                  fieldname: "answer",
                  value: value ? value!.toString() : "",
                });
              }}
            />
            {choice.info_label && q.answer === choice.value ? (
              choice.info_subfix ? (
                <Form.Field
                  label={choice.info_label}
                  control={InputLabel}
                  labelText={choice.info_subfix}
                  placeholder={choice.default_info_value}
                  value={choice.info_value}
                  onChangeInputField={(fieldname: string, value: string) => {
                    choice.setField({
                      fieldname: "info_value",
                      value,
                    });
                  }}
                />
              ) : (
                <Form.Input
                  label={choice.info_label}
                  value={choice.info_value}
                  placeholder={choice.default_info_value}
                  onChange={(e, { value }) => {
                    console.log(value);
                    choice.setField({
                      fieldname: "info_value",
                      value: value.toString(),
                    });
                  }}
                />
              )
            ) : null}
          </React.Fragment>
        ))}
      </Form.Group>
    );
  }
}
export default Questionaires;
