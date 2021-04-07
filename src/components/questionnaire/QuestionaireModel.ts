import { getRoot, IAnyModelType, types } from "mobx-state-tree";
import { IInput } from "../../utils/common-interface";
import { getValueFromRequestObject } from "../../utils/get-value-from-request-object";

// choice_type : "RADIO" "TEXT"
export const ChoiceModel = types.model("ChoiceModel", {
  key: types.optional(types.number, 1),
  value: types.optional(types.string, ""),
  label: types.optional(types.string, ""),
  require_info: types.optional(types.boolean, false),
  info_label: types.optional(types.string, ""),
  info_value: types.optional(types.string, ""),
  info_subfix: types.optional(types.string, ""),
  default_info_value_field: types.optional(types.string, ""),
  default_info_value: types.optional(types.string, "")
}).actions((self: any) => ({
  setField: ({ fieldname, value }: IInput) => {
    self[fieldname] = value;
  },
}));
export const QuestionModel = types.model("QuestionModel", {
  question_id: types.optional(types.number, 0),
  question_label: types.optional(types.string, ""),
  question_type: types.optional(types.string, ""),
  choice_type: types.optional(types.string, ""),
  choice_list: types.maybe(types.array(ChoiceModel)),
  child: types.maybe(types.array(types.late((): IAnyModelType => QuestionModel))),
  precheck_condition: types.maybe(types.string),
  subfix: types.maybe(types.string),
  default_answer_field: types.maybe(types.string),
  default_answer: types.maybe(types.string),
  answer: types.maybe(types.string),
  credit_scroll_criteria: types.maybe(types.string)
})
  .views((self: any) => ({
    get selectedChoice() {
      return self.choice_list.find((choice: IChoiceModel, index: number) =>
        (self.answer === choice.value)
      );
    }
  }))
  .actions((self: any) => ({
    setDefaultAnswerRadioChoice: () => {
      if (self.precheck_condition) {
        let rootStore: any;
        rootStore = getRoot(self);
        let limiting = 0; // กันติด while loop
        let condition = self.precheck_condition;
        let variable;
        do {
          variable = condition.substring(
            condition.indexOf("{") + 1,
            condition.indexOf("}")
          );
          if (variable) {
            const answer = getValueFromRequestObject(
              rootStore.toJSON(),
              variable
            );
            condition = condition.replace(`{${variable}}`, answer);
            limiting += 1;
          } else {
            break;
          }
        } while (variable && limiting < 100);

        try {
          // tslint:disable-next-line:no-eval
          const evalAnswer = eval(condition);
          self.setField({
            fieldname: "answer",
            value: evalAnswer
          });
          self.setField({
            fieldname: "default_answer",
            value: evalAnswer
          });
          if (self.selectedChoice && self.selectedChoice.default_info_value_field) {
            const choiceAnswer = getValueFromRequestObject(
              rootStore.toJSON(),
              self.selectedChoice.default_info_value_field
            );

            self.selectedChoice.setField({
              fieldname: "info_value",
              value: choiceAnswer
            });
            self.selectedChoice.setField({
              fieldname: "default_info_value",
              value: choiceAnswer
            });
          }
        } catch (e) {
          console.log(e);
          return undefined;
        }
      }
    },
    setDefaultAnswerTextChoice: () => {
      if (self.default_answer_field) {
        let rootStore: any;
        rootStore = getRoot(self);
        const answer = getValueFromRequestObject(
          rootStore.toJSON(),
          self.default_answer_field
        );

        try {
          self.setField({
            fieldname: "answer",
            value: `${answer}`
          });
          self.setField({
            fieldname: "default_answer",
            value: `${answer}`
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
  }));
export type IQuestionModel = typeof QuestionModel.Type;
export type IChoiceModel = typeof ChoiceModel.Type;
