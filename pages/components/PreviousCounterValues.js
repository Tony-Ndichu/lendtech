import styled from "styled-components";

const PreviousCounterValues = ({
    counterValues
}) => {
    console.log("counterValues==========>", counterValues)
    return counterValues?.map(item => {
        return <>{item}<br /></>
    })
}

export default PreviousCounterValues;
