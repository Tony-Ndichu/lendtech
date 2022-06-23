import styled from "styled-components";

const UserInput = styled.input``;
const NewInputSubmit = styled.button``;
import { useForm } from "react-hook-form";

const NewUserInput = ({ checkIfValueIsNumber }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data, e) => {
    if (!checkIfValueIsNumber(data.userInput)) {
      setError("userInput", {
        type: "custom",
        message: "Please enter a valid number",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        Enter new input:{" "}
        <UserInput
          name="userInput"
          {...register("userInput", {
            required: true,
          })}
        />
        <NewInputSubmit type="submit">Submit</NewInputSubmit>
      </form>
      {errors?.userInput && "Please enter a valid number"}
    </>
  );
};

export default NewUserInput;
