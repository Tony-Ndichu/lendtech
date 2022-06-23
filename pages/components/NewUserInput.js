import styled from "styled-components";
import { useForm } from "react-hook-form";

const UserInput = styled.input`
  width: 80%;
  border: 1px solid black;
  padding: 10px;
  font-size: 20px;
  color: black;
  font-weight: bold;
`;
const NewInputSubmit = styled.button`
  font-weight: bold;
  border: 1px solid blue;
  color: white;
  background-color: blue;
`;

const NewInputText = styled.h2`
  width: 100%;
  text-align: center;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputAndButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const StyledError = styled.div`
  color: #ff9494;
`;

const NewUserInput = ({
  checkIfValueIsNumber,
  setCounterValue,
  setFormerCounterValues,
  resetField,
  setCounterColor,
  clearErrors,
  checkIfCounterValueIsEven,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    if (!checkIfValueIsNumber(data.userInput)) {
      setError("userInput", {
        type: "custom",
        message: "Please enter a valid number",
      });
    } else {
      setCounterValue(data.userInput);
      setCounterColor("green");
      setFormerCounterValues((formerCounterValues) => [
        ...formerCounterValues,
        data.userInput,
      ]);
      resetField("multiply");
      clearErrors("isEven");
      checkIfCounterValueIsEven();
    }
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <NewInputText>Enter new numerical input:</NewInputText>
        <InputAndButton>
          <UserInput
            name="userInput"
            {...register("userInput", {
              required: true,
            })}
          />
          <NewInputSubmit type="submit">Submit</NewInputSubmit>
        </InputAndButton>
      </StyledForm>
      {errors?.userInput && (
        <StyledError>Please enter a valid number</StyledError>
      )}
    </>
  );
};

export default NewUserInput;
