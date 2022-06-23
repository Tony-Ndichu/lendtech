import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import NewUserInput from "./components/NewUserInput";
import PreviousCounterValues from "./components/PreviousCounterValues";

const Counter = styled.div`
  color: white;
  width: 80%;
  display: flex;
  text-align: center;
  border-radius: 4px;
  justify-content: center;
  background-color: ${(props) =>
    props.counterColor === "red" ? "red" : "#2ba805"};
  box-shadow: ${(props) =>
    props.counterColor === "red" ? "0 0 5px red" : "0 0 5px #2ba805"};
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const MultiplyButton = styled.button`
  font-weight: bold;
  border: 1px solid blue;
  color: white;
  background-color: blue;
`;

const SquareButton = styled.button`
  margin-top: 10%;
  font-weight: bold;
  border: 1px solid blue;
  color: white;
  background-color: blue;
  padding: 10px;
`;

const MultiplicationInput = styled.input`
  width: 80%;
  border: 1px solid black;
  padding: 10px;
  font-size: 20px;
  color: black;
  font-weight: bold;
`;

const MultiplicationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const ResetButton = styled.button`
  margin-top: 10%;
  font-weight: bold;
  border: 1px solid blue;
  color: white;
  background-color: blue;
  padding: 10px;
`;

const InputContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const EvenState = styled.div`
  color: ${(props) => props.color};
  text-align: center;
  width: 100%;
  box-shadow: ${(props) => `0 0 5px ${props.color}`};
`;

const MultiplyText = styled.h2`
  width: 100%;
  text-align: center;
`;

const InputAndButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Dropzone = styled.div`
  margin-top: 10%;
  font-weight: bold;
  border: 1px solid blue;
  color: white;
  background-color: blue;
  padding: 10px;
  text-align: center;
`;
const DropzoneInput = styled.input``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;

  @media (min-width:801px)  {
    width: 30%;
  }
`;

const Home = () => {
  const [counterValue, setCounterValue] = useState(2);
  const [counterColor, setCounterColor] = useState("");
  const [counterValueIsEven, setCounterValueIsEven] = useState(false);
  const [counterInputValue, setCounterInputValue] = useState(2);
  const [maxCounterValue, setMaxCounterValue] = useState(999999);
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [formerCounterValues, setFormerCounterValues] = useState([]);
  const [currentRainbowIndex, setCurrentRainbowIndex] = useState(0);

  const {
    register,
    reset,
    clearErrors,
    formState: { errors },
    getValues,
    resetField,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      multiply: 2,
    },
  });

  const multiplyCounterValue = () => {
    const multiplyInputValue = getValues("multiply");
    let newValue = counterValue * multiplyInputValue;
    setCounterValue(newValue);
    setFormerCounterValues((formerCounterValues) => [
      ...formerCounterValues,
      newValue,
    ]);
  };

  const squareCounterValue = () => {
    const squaredValue = counterValue ** 2;

    setCounterValue(squaredValue);
    setFormerCounterValues((formerCounterValues) => [
      ...formerCounterValues,
      squaredValue,
    ]);
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
        clearErrors("isEven");
      })
      .catch((error) => {
        setError("isEven", {
          type: "custom",
          message: "Value cannot be used by isEven API",
        });
      });
  };

  useEffect(() => {
    const colorCounterValue = () => {
      if (Number.isInteger(counterValue)) {
        setCounterColor("green");
      } else if (!checkIfValueIsNumber(counterValue)) {
        setCounterColor("red");
      }
    };

    colorCounterValue();
    checkIfCounterValueIsEven();
    clearErrors("isEven");

    setCurrentRainbowIndex((currentRainbowIndex + 1) % rainbowColors.length);
  }, [counterValue]);

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setParsedCsvData(results.data);
        if (results.data.length > 0) {
          const firstObject = results.data[0];
          const firstObjectValue = firstObject[Object.keys(firstObject)[0]];
          setCounterValue(firstObjectValue);
          setFormerCounterValues((formerCounterValues) => [
            ...formerCounterValues,
            firstObjectValue,
          ]);
        }
      },
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      parseFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: "text/csv",
    });

  const rainbowColors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];

  return (
    <Wrapper>
      <Counter counterColor={counterColor}>{counterValue}</Counter>
      {checkIfValueIsNumber(counterValue) ? (
        <>
          {!errors.multiply && !errors.isEven && (
            <EvenState color={rainbowColors[currentRainbowIndex]}>{`This ${
              counterValueIsEven ? "IS" : "IS NOT"
            } an even number`}</EvenState>
          )}
          {errors.isEven && (
            <EvenState color="red">{errors.isEven.message}</EvenState>
          )}
          <MultiplicationWrapper>
            <InputContainer>
              <MultiplyText>Multiply counter value by:</MultiplyText>

              <InputAndButton>
                <MultiplicationInput
                  name="multiply"
                  defaultValue={counterInputValue}
                  {...register("multiply", {
                    validate: {
                      checkValueIsNumber: (v) =>
                        checkIfValueIsNumber(v) || "Please enter a number",
                    },
                    required: true,
                  })}
                />
                <MultiplyButton
                  onClick={() => multiplyCounterValue()}
                  disabled={!checkIfValueIsNumber(counterValue)}
                >
                  Multiply
                </MultiplyButton>
              </InputAndButton>
            </InputContainer>

            {errors.multiply && <p>{errors.multiply.message}</p>}
          </MultiplicationWrapper>

          <SquareButton
            onClick={() => squareCounterValue()}
            disabled={!checkIfValueIsNumber(counterValue)}
          >
            Square counter value
          </SquareButton>

          <ResetButton
            onClick={() => {
              resetField("multiply");
              setCounterValue(3);
              clearErrors("isEven");
            }}
          >
            Reset counter value
          </ResetButton>

          <Dropzone {...getRootProps()}>
            <DropzoneInput {...getInputProps()} />
            Click to select csv file
          </Dropzone>
        </>
      ) : (
        <NewUserInput
          formerCounterValues={formerCounterValues}
          setCounterValue={setCounterValue}
          setFormerCounterValues={setFormerCounterValues}
          checkIfValueIsNumber={checkIfValueIsNumber}
          resetField={resetField}
          setCounterColor={setCounterColor}
          clearErrors={clearErrors}
          checkIfCounterValueIsEven={checkIfCounterValueIsEven}
          maxCounterValue={maxCounterValue}
          counterValue={counterValue}
        />
      )}
      <PreviousCounterValues counterValues={formerCounterValues} />
    </Wrapper>
  );
};

export default Home;
