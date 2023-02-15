import { useForm, SubmitHandler } from "react-hook-form";
import { useAddTodoMutation } from "../store/todos";

type Inputs = {
  newTodo: string;
};

export default function AddTodoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [addTodo] = useAddTodoMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    addTodo({ name: data.newTodo });
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input {...register("newTodo", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.newTodo && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}
