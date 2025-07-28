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
import { useNavigate } from "react-router-dom";
import ApproveDialog from "./ApproveDialog";
import dayjs from "dayjs";

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

const styles = {
  flagLabel: {
    color: "white",
    fontSize: "14px",
    padding: "3px 30px 3px 5px",
    clipPath: "polygon(100% 0%, 75% 50%, 100% 100%, 0 100%, 0% 50%, 0 1%)",
    fontFamily: "Arial, sans-serif",
    border: "none", // Add border if needed
    cursor: "pointer",
    width:"110px"
  },
};

function ApproveDealList() {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();

  const [approveDataList, setApproveDataList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [approveDialog, setApproveDialog] = useState(false);
  const [approveID, setApproveID] = useState("");

  const fetchDealsData = async () => {
    try {
      const approveData = await CRMBaseURL.get("getapprovaldeal");
      setApproveDataList(approveData.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  useEffect(() => {
    fetchDealsData();
  }, []);

  const getContactDetails = (id) => {
    navigate("/dashboard/contact_details", {
      state: { ID: id },
    });
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = async (ID) => {
    setApproveDialog(true);
    setApproveID(ID);
  };

  const filteredData =
    approveDataList &&
    approveDataList.filter((list) => {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const formattedCreatedAt = new Date(list.createdAt).toLocaleDateString(
        "en-GB"
      );

      return (
        list.companyName.toLowerCase().includes(lowerCaseQuery) ||
        list.priority.toLowerCase().includes(lowerCaseQuery) ||
        list.productType.toLowerCase().includes(lowerCaseQuery) ||
        list.quantity.toLowerCase().includes(lowerCaseQuery) ||
        list.dealOwnerName.toLowerCase().includes(lowerCaseQuery) ||
        list.status.toLowerCase().includes(lowerCaseQuery) ||
        formattedCreatedAt.includes(searchQuery) // Search in formatted creation date
      );
    });

  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      if (orderBy === "Contact") {
        return (
          (a.companyName < b.companyName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "priority") {
        return (a.priority < b.priority ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "productType") {
        return (
          (a.productType < b.productType ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "quantity") {
        return (a.quantity < b.quantity ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "dealOwner") {
        return (
          (a.dealOwnerName < b.dealOwnerName ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "status") {
        return (a.status < b.status ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "createdAt") {
        return (
          (new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1) *
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
          Awaiting for Approval{" "}
          {`(${approveDataList ? approveDataList.length : 0})`}
        </h3>

        {/* <div
          className="icon_container"
          onClick={() => {
            setOpenContactsForm(true);
          }}
        >
          <AddIcon />
        </div> */}
      </Box>
      <TableContainer className="table_container">
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "dealOwner"}
                  direction={orderBy === "dealOwner" ? order : "asc"}
                  onClick={() => handleRequestSort("dealOwner")}
                >
                  Deal Owner
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "priority"}
                  direction={orderBy === "priority" ? order : "asc"}
                  onClick={() => handleRequestSort("priority")}
                >
                  Priority
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "productType"}
                  direction={orderBy === "productType" ? order : "asc"}
                  onClick={() => handleRequestSort("productType")}
                >
                  Product Type
                </StyledTableSortLabel>
              </StyledTableCell>

              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "quantity"}
                  direction={orderBy === "quantity" ? order : "asc"}
                  onClick={() => handleRequestSort("quantity")}
                >
                  Quantity
                </StyledTableSortLabel>
              </StyledTableCell>

              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "Contact"}
                  direction={orderBy === "Contact" ? order : "asc"}
                  onClick={() => handleRequestSort("Contact")}
                >
                  Company / Contact
                </StyledTableSortLabel>
              </StyledTableCell>

              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  Created Date
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, i) => {
                  // Calculate the difference in days between today and the approximate closing date
                  const today = dayjs();
                  const dueDate = dayjs(data.approximateClosingDate);
                  const daysDifference = dueDate.diff(today, "day");
                  const weeksDifference = dueDate.diff(today, "week");
                  const CloseDifference = today.diff(dueDate, 'day');

                  // Define background color based on the difference in weeks
                  let priorityColor = "";
                  if (weeksDifference > 3) {
                    priorityColor = "green"; // More than 3 weeks difference
                  } else if (weeksDifference >= 2 && weeksDifference <= 3) {
                    priorityColor = "orange"; // 2 to 3 weeks difference
                  } else if (weeksDifference <= 1 && daysDifference > 0) {
                    priorityColor = "#385680"; // 1 week or less
                  } else if (dueDate.isBefore(today)) {
                    priorityColor = "#ff0404cc"; // Due date has passed
                  }
                  return (
                    <TableRow key={data.id}>
                      <StyledTableCell>{i + 1}</StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: "#3aa2ef",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => {
                          getContactDetails(data.contactID);
                        }}
                      >
                        {data.dealOwnerName}
                      </StyledTableCell>
                      <StyledTableCell >
                        <Box sx={{display:"flex",alignItems:"center"}}>
                        <Box
                          sx={{
                            ...styles.flagLabel,
                            backgroundColor: priorityColor, // Use the priority color dynamically
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 16, // Adjust size for a bigger dot
                              height: 16, // Adjust size for a bigger dot
                              border:"1px solid #fff",
                              backgroundColor:
                                data.priority === "High"
                                  ? "#f0a000"
                                  : data.priority === "Normal"
                                  ? "#7a7a7a"
                                  : data.priority === "Low"
                                  ? "#905027"
                                  : "", // Use dynamic color based on priority
                              borderRadius: "50%", // Makes it a circle
                              display: "inline-block", // Keeps it inline
                            }}
                          />
                         {daysDifference ? `${daysDifference} days` : "-"}
                          {/* {daysDifference > 0 ? `${daysDifference} days` : "closed"} */}
                        </Box>
                        {CloseDifference ? CloseDifference : "-"}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{data.productType}</StyledTableCell>
                      <StyledTableCell>{data.quantity} Nos</StyledTableCell>
                      <StyledTableCell>{data.companyName}</StyledTableCell>
                      <StyledTableCell>{data.createdAt}</StyledTableCell>
                      <StyledTableCell>
                        <Typography
                          onClick={() => {
                            handleActionClick(data.id);
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
                  );
                })            ) : (
              <TableRow>
                <StyledTableCell colSpan={8} align="center">
                  <img
                    src={userNotFound}
                    alt="User Not Found"
                    style={{ width: "200px", height: "180px" }}
                  />
                  <Typography variant="body1">
                    No Deals at the moment
                  </Typography>
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <ApproveDialog
        approveDialog={approveDialog}
        setApproveDialog={setApproveDialog}
        approveID={approveID}
        fetchDealsData={fetchDealsData}
      />
    </>
  );
}

export default ApproveDealList;
