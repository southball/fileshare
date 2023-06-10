import { DocumentInput, UseMutationResponse } from "urql";
import { OperationContext } from "urql";
import { AnyVariables } from "urql";
import { useMutation } from "urql";

export function useMutationWithError<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(query: DocumentInput<Data, Variables>): UseMutationResponse<Data, Variables> {
  const [state, execute] = useMutation<Data, Variables>(query);
  return [
    state,
    (variables: Variables, context?: Partial<OperationContext>) => {
      return execute(variables, context).then((data) => {
        if (data.error) {
          throw data.error;
        }
        return data;
      });
    },
  ];
}
