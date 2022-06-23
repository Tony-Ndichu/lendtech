import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";

const Wrapper = styled.div``;
const Title = styled.h2`
  text-decoration: underline;
  margin-top: 30px;
`;
const HistoryList = styled.ul``;

const ListItem = styled.li`
  margin-top: 10px;
`;

const PreviousCounterValues = ({ counterValues, itemsPerPage = 5 }) => {
  const items = counterValues;
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  const Items = ({ currentItems }) => {
    return (
      <HistoryList>
        {currentItems &&
          currentItems.map((item, index) => (
            <ListItem key={`${item} - ${index}`}>{item}</ListItem>
          ))}{" "}
        <br />
      </HistoryList>
    );
  };

  return (
    <Wrapper>
      <Title>History</Title>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </Wrapper>
  );
};

export default PreviousCounterValues;
