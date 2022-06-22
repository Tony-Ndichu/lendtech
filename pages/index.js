import { useState, useEffect } from "react";
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
const EvenState = styled.div``;

const Home = () => {
  const [counterValue, setCounterValue] = useState(3);
  const [counterColor, setCounterColor] = useState("");
  const [counterValueIsEven, setCounterValueIsEven] = useState(false);
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

  const checkIfValueIsNumber = (multiplyInput) => {
    return new RegExp(/^-?\d*\.?\d+$/).test(multiplyInput);
  };

  const checkIfCounterValueIsEven = async () => {
    await fetch(`https://api.isevenapi.xyz/api/iseven/${counterValue}/`)
      .then((response) => {
        return response.json();
      })
      .then(function (data) {
        setCounterValueIsEven(data.iseven);
      });
  };

  useEffect(() => {
    const colorCounterValue = () => {
      if (Number.isInteger(counterValue)) {
        setCounterColor("green");
      } else if (!checkIfValueIsNumber(counterValue)) {
        setCounterColor("red");
      } else {
        setCounterColor("black");
      }
    };

    colorCounterValue();
    checkIfCounterValueIsEven();
  }, [counterValue]);

  return (
    <>
      <Counter>{counterValue}</Counter>
      <EvenState>{`The counter value ${
        counterValueIsEven ? "IS" : "IS NOT"
      } even`}</EvenState>
      <MultiplicationWrapper>
        <InputContainer>
          Multiply by:
          <MultiplicationInput
            name="multiply"
            defaultValue={2}
            {...register("multiply", {
              validate: {
                checkValueIsNumber: (v) =>
                  checkIfValueIsNumber(v) || "Please enter a number",
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
