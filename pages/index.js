import { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

const Counter = styled.h1``;

const MultiplyButton = styled.button``;

const SquareButton = styled.button``;

const MultiplicationInput = styled.input``;

const MultiplicationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const InputContainer = styled.div``;

const Home = () => {
  const [counterValue, setCounterValue] = useState(2);
  const {
    register,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const multiplyCounterValue = () => {
    const multiplyInputValue = getValues("multiply");
    let newValue = counterValue * multiplyInputValue;
    setCounterValue(newValue);
  };

  const squareCounterValue = () => {
    const squaredValue = counterValue ** 2;

    setCounterValue(squaredValue);
  };

  const validateMultiplyValue = (multiplyInput) => {
    return new RegExp("^[0-9]*$").test(multiplyInput);
  };
  return (
    <>
      <Counter>{counterValue}</Counter>
      <MultiplicationWrapper>
        <InputContainer>
          Multiply by:
          <MultiplicationInput
            name="multiply"
            defaultValue={2}
            {...register("multiply", {
              validate: {
                checkValueIsNumber: (v) =>
                  validateMultiplyValue(v) || "Please enter a number",
              },
            })}
          />
        </InputContainer>
        <MultiplyButton
          onClick={() => (errors.multiply ? {} : multiplyCounterValue())}
        >
          Multiply
        </MultiplyButton>
        {errors.multiply && <p>{errors.multiply.message}</p>}
      </MultiplicationWrapper>
      <SquareButton onClick={() => squareCounterValue()}>Square</SquareButton>
    </>
  );
};

export default Home;
