declare module 'inquirer' {
  export type QuestionCollection<T = Record<string, unknown>> = Array<Record<string, unknown>>;

  export interface InquirerModule {
    prompt<T = Record<string, unknown>>(questions: QuestionCollection<T>): Promise<T>;
  }

  const inquirer: InquirerModule;
  export default inquirer;
}
