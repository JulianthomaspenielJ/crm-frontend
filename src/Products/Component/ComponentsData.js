import React, { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthService from "../../services/AuthService";
import {
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  TablePagination,
  TableSortLabel,
  TextField,
  Box,
  Typography,
  Switch,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ComponentForm from "./ComponentForm";
import CreateIcon from "@mui/icons-material/Create";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import SearchIcon from "@mui/icons-material/Search";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Slide,
} from "@mui/material";
import userNotFound from "../../Image/useeNotfound.webp";
import Loading from "../../Loading/Loading";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [dataUpdateMsg, setDataUpdateMsg] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(" ");
  const [orderBy, setOrderBy] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [checked, setChecked] = useState(false);
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setDataUpdateMsg(false);
  };

  const fetchComponentsName = async () => {
    setLoading(true);
    try {
      const components = await CRMBaseURL.get("getproductlist");
      const data = components.data;
      const datas = data["Data "];
      setProductName(datas);
    } catch (err) {
      console.error("Error fetching components", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComponentsName();
  }, []);

  const getMatchingProductName = (description) => {
    const lowerCaseDescription = description.toLowerCase();
    const matchingProduct = productName.find((data) =>
      lowerCaseDescription.startsWith(data.productName.toLowerCase())
    );
    return matchingProduct ? matchingProduct.productName : "-";
  };

  const fetch = useCallback(async () => {
    try {
      const componentListData = await CRMBaseURL.get("getcomponents");

      const data = componentListData.data;
      const datas = data["DATA : "];

      setComponentListData(datas);
    } catch (err) {
      console.log("Error occurred", err);
    }
  }, [CRMBaseURL, setComponentListData]);

  const fetchDeleteData = useCallback(async () => {
    try {
      const DeletedList = await CRMBaseURL.get("productdeleteddata");
      const data = DeletedList.data;
      setComponentListData(data?.Data);
    } catch (err) {
      console.log("Error occurred", err);
    }
  }, [CRMBaseURL, setComponentListData]);

  useEffect(() => {
    if (checked) {
      fetchDeleteData();
    } else {
      fetch();
    }
  }, []);

  const handleDeleteData = (event) => {
    setChecked(event.target.checked);
    setPage(0);
  };

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

  const filteredData =
    componentListData &&
    componentListData.filter(
      (component) =>
        component.variantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        component.variantDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        component.variantPrice.toString().includes(searchQuery) ||
        component.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      if (orderBy === "variantName") {
        return (
          (a.variantName < b.variantName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "productName") {
        return (
          (getMatchingProductName(a.variantDescription) <
          getMatchingProductName(b.variantDescription)
            ? -1
            : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "variantDescription") {
        return (
          (a.variantDescription < b.variantDescription ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "variantPrice") {
        return (
          (a.variantPrice < b.variantPrice ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "brand") {
        return (a.brand < b.brand ? -1 : 1) * (order === "asc" ? 1 : -1);
      }
      return 0;
    });

  const handleDelete = (id) => {
    setDeleteDialog(true);
    setDeleteID(id);
  };

  const deleteComponentData = async (id) => {
    if (checked) {
      const values = {
        id: id,
        recoveredBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };
      try {
        const res = await CRMBaseURL.post("recovercomponent", values);
        if (res.status === 200) {
          setSnackbarMessage(res && res.data?.message);
          setSnackbarType("success");
        } else {
          setSnackbarMessage("Something went wrong. Please try again.");
          setSnackbarType("error");
        }
        setDataUpdateMsg(true);
        fetchDeleteData();
      } catch (e) {
        console.error("Error deleting component:", e);
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarType("error");
        setDataUpdateMsg(true);
      }
    } else {
      const values = {
        id: id,
        deletedBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };

      try {
        const response = await CRMBaseURL.post("deletecomponent", values);

        if (response.status === 200) {
          setSnackbarMessage(response && response.data?.message);
          setSnackbarType("success");
        } else {
          setSnackbarMessage("Something went wrong. Please try again.");
          setSnackbarType("error");
        }
        setDataUpdateMsg(true);
        fetch();
      } catch (e) {
        console.error("Error deleting component:", e);
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarType("error");
        setDataUpdateMsg(true);
      }
    }

    setDeleteDialog(false);
  };
  if (!loading) {
    return (
      <>
        <Box display="flex" justifyContent="space-between">
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
                color: "#5D5FEF", // change to your desired color
                fontSize: "14px", // change to your desired size
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
          sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
        >
          {storedUserData &&
            storedUserData.team === "Admin" &&
            (storedUserData.userRole === "Admin" ||
              storedUserData.userRole === "Super Admin") && (
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                View Deleted List :
                <Switch
                  checked={checked}
                  onChange={handleDeleteData}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Typography>
            )}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#000",
          }}
        >
          <h3 style={{ marginRight: "40%", color: "#000" }}>
            Component's Data
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
          component={Paper}
          // className="table_container"
          // sx={{ borderRadius: 5 }}
        >
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>
                  {" "}
                  <StyledTableSortLabel
                    active={orderBy === "productName"}
                    direction={orderBy === "productName" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "productName")}
                  >
                    Product Names
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "variantName"}
                    direction={orderBy === "variantName" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "variantName")}
                  >
                    Variant Name
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "variantDescription"}
                    direction={orderBy === "variantDescription" ? order : "asc"}
                    onClick={(event) =>
                      handleRequestSort(event, "variantDescription")
                    }
                  >
                    Variant Description
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "variantPrice"}
                    direction={orderBy === "variantPrice" ? order : "asc"}
                    onClick={(event) =>
                      handleRequestSort(event, "variantPrice")
                    }
                  >
                    Variant Price
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "brand"}
                    direction={orderBy === "brand" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "brand")}
                  >
                    Variant Brand
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
                    <StyledTableCell>
                      {index + 1 + page * rowsPerPage}
                    </StyledTableCell>

                    <StyledTableCell>
                      {getMatchingProductName(row.variantDescription) && (
                        <Typography>
                          {getMatchingProductName(row.variantDescription)}
                        </Typography>
                      )}
                    </StyledTableCell>

                    <StyledTableCell>{row.variantName}</StyledTableCell>
                    <StyledTableCell>
                      {" "}
                      {row.variantDescription?.length > 25
                        ? `${row.variantDescription.substring(0, 25)}...`
                        : row.variantDescription}
                    </StyledTableCell>
                    <StyledTableCell>{row.variantPrice}</StyledTableCell>
                    <StyledTableCell>{row.brand || "-"}</StyledTableCell>
                    <StyledTableCell>
                      {checked ? (
                        <>
                          <Typography
                            onClick={() => handleDelete(row.id)}
                            sx={{
                              border: "1px solid #FFCF01",
                              color: "#FFCF01",
                              "&:hover": {
                                backgroundColor: "#FFCF01",
                                color: "#fff",
                              },
                              padding: "2px 5px 2px 5px",
                              borderRadius: 5,
                              cursor: "pointer",
                              width: 80,
                              textAlign: "center",
                            }}
                          >
                            Restore
                          </Typography>
                        </>
                      ) : (
                        <>
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
                                    storedUserData.userRole ===
                                      "Super Admin")) ||
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
                              </>
                            )}
                        </>
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center" colSpan={6}>
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
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
          setDataUpdateMsg={setDataUpdateMsg}
        />

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={dataUpdateMsg}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackbarType}
            iconMapping={{
              success: <CheckCircleIcon />,
              error: <ErrorIcon />,
            }}
            sx={{ backgroundColor: snackbarType === "error" ? "red" : "green" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={deleteDialog}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth="sm"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`Are you sure you want ${
                checked ? "recover" : "delete"
              } this variant data?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteDialog(false);
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                deleteComponentData(deleteID);
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return <Loading />;
  }
}

export default ComponentList;
