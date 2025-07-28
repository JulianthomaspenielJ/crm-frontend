import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Paper,
  TablePagination,
  Switch,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
  Button,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import userNotFound from "../../Image/useeNotfound.webp";
import {
  Add as AddIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import AuthService from "../../services/AuthService";
import ComponentForm from "./ComponentForm";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import DeleteComponentDialog from "./DeleteComponentDialog";
import Loading from "../../Loading/Loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#fff",
    color: "#000",
    fontSize: 14,
    padding: "15px 5px",
    border: "1px solid #fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 12,
    padding: "12px",
    border: "1px solid #f0f0f0",
  },
}));
const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    // color: "#e02b6a",
    color: "#2354e6",
  },
  "&.Mui-active": {
    // color: "#e02b6a",
    color: "#2354e6",
  },
}));
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ComponentList() {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const [componentListData, setComponentListData] = useState([]);
  const [componentFormOpen, setComponentFormOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(" ");
  const [orderBy, setOrderBy] = useState("");
  const [editData, setEditData] = useState(null);
  const [checked, setChecked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [loading, setLoading] = useState(false);
  const fetch = async () => {
    setLoading(true);
    try {
      const response = await CRMBaseURL.get("getcomponentlist");
      setComponentListData(response.data.components);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = async (id) => {
    setDeleteID(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteData = (event) => {
    setChecked(event.target.checked);
  };

  const filteredData =
    componentListData &&
    componentListData.filter(
      (component) =>
        component.componentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        component.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        component.productType.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      if (orderBy === "componentName") {
        return (
          (a.componentName < b.componentName ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "description") {
        return (
          (a.description < b.description ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "productType") {
        return (
          (a.productType < b.productType ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

  if (!loading) {
    return (
      <>
        <Box display="flex" justifyContent="space-between" mb={1}>
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
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#000",
          }}
        >
          <h3 style={{ marginRight: "40%", color: "#000" }}>
            Component's List
          </h3>
          {storedUserData &&
            (storedUserData.userRole === "Manager" ||
              storedUserData.userRole === "Senior Executive" ||
              storedUserData.team === "Admin") && (
              <div
              // className="icon_container"
              >
                <Button
                  startIcon={<AddIcon />}
                  // className="icon_container"
                  onClick={() => {
                    setEditData(null);
                    setComponentFormOpen(true);
                  }}
                  sx={{
                    borderRadius: "8px",
                    padding: "5px 12px",
                    color: "#fff",
                    background:
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                  }}
                >
                  ADD
                </Button>
              </div>
            )}
        </Box>
        <TableContainer
          // className="table_container"
          // sx={{ borderRadius: 5 }}
          component={Paper}
        >
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "componentName"}
                    direction={orderBy === "componentName" ? order : "asc"}
                    onClick={(event) =>
                      handleRequestSort(event, "componentName")
                    }
                  >
                    Component Name
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "description")}
                  >
                    Description
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "productType"}
                    direction={orderBy === "productType" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "productType")}
                  >
                    Product Type
                  </StyledTableSortLabel>
                </StyledTableCell>
                {storedUserData &&
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    (storedUserData.team === "Pricing" &&
                      storedUserData.userRole !== "Senior Executive")) &&
                  (storedUserData.userRole === "Manager" ||
                    storedUserData.userRole === "Senior Executive" ||
                    storedUserData.userRole === "Admin" ||
                    storedUserData.userRole === "Super Admin") && (
                    <StyledTableCell>Action</StyledTableCell>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData && sortedData.length > 0 ? (
                (rowsPerPage > 0
                  ? sortedData.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : sortedData
                ).map((row, index) => (
                  <TableRow key={index}>
                    <StyledTableCell sx={{ paddingY: 3 }}>
                      {index + 1 + page * rowsPerPage}
                    </StyledTableCell>
                    <StyledTableCell>{row.componentName}</StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        style={{
                          border:
                            row.productType === "AOP"
                              ? "1px solid #00E096 "
                              : row.productType === "Components"
                              ? "1px solid #8950FC "
                              : row.productType === "Laptop"
                              ? "1px solid #FFCF00"
                              : "",
                          color:
                            row.productType === "AOP"
                              ? "#00E096"
                              : row.productType === "Components"
                              ? "#8950FC"
                              : row.productType === "Laptop"
                              ? "#FFCF00"
                              : "",
                          padding: "2px 5px 2px 5px",
                          borderRadius: 5,
                        }}
                      >
                        {row.productType}
                      </span>
                    </StyledTableCell>
                    {storedUserData &&
                      storedUserData &&
                      (storedUserData.team === "Admin" ||
                        (storedUserData.team === "Pricing" &&
                          storedUserData.userRole === "Manager")) &&
                      (storedUserData.userRole === "Manager" ||
                        storedUserData.userRole === "Senior Executive" ||
                        storedUserData.userRole === "Admin" ||
                        storedUserData.userRole === "Super Admin") && (
                        <>
                          <StyledTableCell>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => {
                                  setEditData(row);
                                  setComponentFormOpen(true);
                                }}
                              >
                                <CreateIcon color="success" />
                              </IconButton>
                            </Tooltip>
                            {((storedUserData.team === "Admin" &&
                              (storedUserData.userRole === "Admin" ||
                                storedUserData.userRole === "Super Admin")) ||
                              (storedUserData.team === "Pricing" &&
                                storedUserData.userRole === "Manager")) && (
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </StyledTableCell>
                        </>
                      )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center" colSpan={5}>
                    <img
                      src={userNotFound}
                      style={{ width: 200, height: 200 }}
                      alt="User not found"
                    />
                    <Typography>No data found</Typography>
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <ComponentForm
          componentFormOpen={componentFormOpen}
          editData={editData}
          setComponentFormOpen={setComponentFormOpen}
          fetch={fetch}
          setEditData={setEditData}
        />

        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
        >
          {/* <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
          View Deleted List:
          <Switch
            checked={checked}
            onChange={handleDeleteData}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Typography> */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={sortedData && sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>

        <DeleteComponentDialog
          id={deleteID}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          fetch={fetch}
        />
      </>
    );
  } else {
    return <Loading />;
  }
}

export default ComponentList;
