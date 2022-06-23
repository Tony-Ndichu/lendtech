import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import NewUserInput from "./NewUserInput";

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

const ResetButton = styled.button``;

const InputContainer = styled.div``;
const EvenState = styled.div``;

const DatasetButton = styled.button``;
const Dropzone = styled.div``;
const DropzoneInput = styled.input``;

const Home = () => {
  const [counterValue, setCounterValue] = useState(3);
  const [counterColor, setCounterColor] = useState("");
  const [counterValueIsEven, setCounterValueIsEven] = useState(false);
  const [counterInputValue, setCounterInputValue] = useState(2);
  const [maxCounterValue, setMaxCounterValue] = useState(999999);
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const {
    register,
    reset,
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
    if (counterValue < maxCounterValue && Number.isInteger(counterValue)) {
      checkIfCounterValueIsEven();
    } else {
      setError("multiply", {
        type: "custom",
        message: "Exceeded maximum value",
      });
    }
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

  return (
    <>
      <Counter>{counterValue}</Counter>
      {checkIfValueIsNumber(counterValue) ? (
        <>
          {!errors.multiply && (
            <EvenState>{`This number ${
              counterValueIsEven ? "IS" : "IS NOT"
            } an even number`}</EvenState>
          )}
          <MultiplicationWrapper>
            <InputContainer>
              Multiply by:
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
            </InputContainer>

            <MultiplyButton
              onClick={() => (errors.multiply ? {} : multiplyCounterValue())}
              disabled={!checkIfValueIsNumber(counterValue)}
            >
              Multiply
            </MultiplyButton>

            <ResetButton
              onClick={() => {
                resetField("multiply");
                setCounterValue(3);
              }}
            >
              Reset
            </ResetButton>
            {errors.multiply && <p>{errors.multiply.message}</p>}
          </MultiplicationWrapper>

          <SquareButton
            onClick={() => squareCounterValue()}
            disabled={!checkIfValueIsNumber(counterValue)}
          >
            Square
          </SquareButton>

          <Dropzone
            {...getRootProps({
              className: `dropzone 
          ${isDragAccept && "dropzoneAccept"} 
          ${isDragReject && "dropzoneReject"}`,
            })}
          >
            <DropzoneInput {...getInputProps()} />
            Click to select files
          </Dropzone>
        </>
      ) : (
        <NewUserInput checkIfValueIsNumber={checkIfValueIsNumber} />
      )}
    </>
  );
};

export default Home;
