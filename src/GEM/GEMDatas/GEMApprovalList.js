import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../../Image/useeNotfound.webp";
import SearchIcon from "@mui/icons-material/Search";
import AuthService from "../../services/AuthService";
import GEMApproveForm from "./GEMApproveForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "#884DFF",
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

function GEMApprovalList() {
  const CRMBaseURL = AuthService();

  // State for managing contact data and form
  const [contactDataList, setContactDataList] = useState([]);

  // State for search, sort, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(""); // Initially empty to indicate no sorting
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openGemDetails, setOpenGemDetails] = useState(false);
  const [gemID, setGemID] = useState("");




  const fetchContactData = async () => {
    try {
      const contactData = await CRMBaseURL.get("waitingforapprovalgem");
      setContactDataList(contactData.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchContactData();
  }, []);

  // Handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  const filteredData =
    contactDataList &&
    contactDataList.filter((contact) => {
      const lowerCaseQuery = searchQuery && searchQuery.toLowerCase();

      const formattedLastActivityDate = new Date(
        contact.lastActivityDate
      ).toLocaleDateString("en-GB");
      const formattedCreatedAt = new Date(
        contact.gemRaisedAt
      ).toLocaleDateString("en-GB");

      return (
        contact.dealerName.toLowerCase().includes(lowerCaseQuery) ||
        contact.gemNumber.toLowerCase().includes(lowerCaseQuery) ||
        contact.customerName.toString().includes(searchQuery) ||
        contact.dueDate.toLowerCase().includes(lowerCaseQuery) ||
        formattedLastActivityDate.includes(searchQuery) ||
        formattedCreatedAt.includes(searchQuery) ||
        contact.description.toLowerCase().includes(lowerCaseQuery) // Add this line
      );
    });

  const handleView = (id) => {
    setGemID(id);

    setOpenGemDetails(true);
  };


  // Sort data based on selected column and order
  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      if (orderBy === "dealerName") {
        return (
          (a.dealerName < b.dealerName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "gemNumber") {
        return (
          (a.gemNumber < b.gemNumber ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "customerName") {
        return (
          (a.customerName < b.customerName ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "dueDate") {
        return (
          (new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "description") {
        return (
          (a.description < b.description ? -1 : 1) * (order === "asc" ? 1 : -1)
        ); // Add this line
      } else if (orderBy === "createdBy") {
        return (
          (a.createdBy < b.createdBy ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "createdAt") {
        return (
          (new Date(a.gemRaisedAt) < new Date(b.gemRaisedAt) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <div>
          <TextField
            sx={{
              color: "red",
              width: 400,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#5D5FEF",
                fontSize: "14px",
              },
            }}
            placeholder="Search here..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#5D5FEF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Box>
      <Box className="top_header">
        <h3 style={{ marginRight: "50%", color: "#fff" }}>
         Awaiting Approval List 
          {` (${contactDataList ? contactDataList.length : 0})`}
        </h3>
       
      </Box>
      <TableContainer className="table_container">
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "dealerName"}
                  direction={orderBy === "dealerName" ? order : "asc"}
                  onClick={() => handleRequestSort("dealerName")}
                >
                  Dealer Name
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "gemNumber"}
                  direction={orderBy === "gemNumber" ? order : "asc"}
                  onClick={() => handleRequestSort("gemNumber")}
                >
                  GEM No
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "customerName"}
                  direction={orderBy === "customerName" ? order : "asc"}
                  onClick={() => handleRequestSort("customerName")}
                >
                  Customer
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "dueDate"}
                  direction={orderBy === "dueDate" ? order : "asc"}
                  onClick={() => handleRequestSort("dueDate")}
                >
                  Due Date
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleRequestSort("description")}
                >
                  Description
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "createdBy"}
                  direction={orderBy === "createdBy" ? order : "asc"}
                  onClick={() => handleRequestSort("createdBy")}
                >
                  Created By
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  Created At
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>View</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row._id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.dealerName}</StyledTableCell>
                    <StyledTableCell>{row.gemNumber}</StyledTableCell>
                    <StyledTableCell>{row.customerName}</StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.dueDate).toLocaleDateString("en-GB")}
                    </StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell>
                    <StyledTableCell>{row.createdBy}</StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.gemRaisedAt).toLocaleDateString("en-GB")}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography
                        onClick={() => {
                          handleView(row.id);
                        }}
                        sx={{
                          border: "1px solid #00E096 ",
                          color: "#00E096",
                          "&:hover": {
                            backgroundColor: "#00E096 ",
                            color: "#fff",
                          },
                          padding: "1px 8px 1px 8px",
                          borderRadius: 2,
                          cursor: "pointer",
                          width: 80,
                          textAlign: "center",
                        }}
                      >
                        View
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={8} align="center">
                  <img
                    src={userNotFound}
                    alt="User Not Found"
                    style={{ width: "300px", height: "250px" }}
                  />
                  <Typography variant="body1" sx={{ color: "#ee7171" }}>
                    No Contacts Found
                  </Typography>
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedData ? sortedData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <GEMApproveForm
        gemID={gemID}
        openGemDetails={openGemDetails}
        setOpenGemDetails={setOpenGemDetails}
        setGemID={setGemID}
       
      />
    </>
  );
}

export default GEMApprovalList;
