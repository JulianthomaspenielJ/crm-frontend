import {
  Button,
  Box,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  IconButton,
  TableBody,
  Paper,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import userNotFound from "../../Image/useeNotfound.webp";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import MarginTypeForm from "./MarginTypeForm";
import AuthService from "../../services/AuthService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteComponentDialog from "./DeleteComponentDialog"; // Import the delete dialog
import CustomSnackbar from "../../Activities/SuccessSnackbar/Snackbar"; // Import the CustomSnackbar
import Loading from "../../Loading/Loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "#000",
    fontSize: 14,
    padding: "15px 5px",
     border:'1px solid #fff'
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 12,
    padding: "12px",
     border:'1px solid #f0f0f0'
  },
}));

function MarginTypeList() {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [addMarginTypeDialogOpen, setAddMarginTypeDialogOpen] = useState(false);
  const [marginListType, setMarginListType] = useState([]);
  const [editMarginDialogOpen, setEditMarginDialogOpen] = useState(false);
  const [selectedMargin, setSelectedMargin] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marginToDelete, setMarginToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('MarginName');

  const fetchMarginType = async () => {
    setLoading(true);
    try {
      const res = await CRMBaseURL.get("getmarginvaluestabledata");
      setMarginListType(res.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  const handleEdit = (margin) => {

    setSelectedMargin(margin);
    setEditMarginDialogOpen(true);
  };

  const handleDeleteClick = (margin) => {
    setMarginToDelete(margin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (marginToDelete) {
      const params = {
        id: marginToDelete.id,
        updatedBy: storedUserData ? storedUserData.userName : "",
      };
      try {
        const res = await CRMBaseURL.post("deletemarginvalues", params);
        if (res.data.message === "Margin deleted successfully") {
          setSnackbarType("success");
          setSnackbarMessage(res.data.message);
          fetchMarginType();
        } else {
          setSnackbarType("error");
          setSnackbarMessage("Failed to delete margin. Please try again.");
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting margin", error);
        setSnackbarType("error");
        setSnackbarMessage("Error deleting margin. Please try again.");
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedMarginListType = [...marginListType].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchMarginType();
  }, []);

  const handleMarginType = () => {
    
    setAddMarginTypeDialogOpen(true);
  };

  if (!loading) {
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
            gap: 2,
          }}
        />
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color:"#000"
          }}>
          <h3 style={{ marginRight: "40%", color: "#000" }}>Margin Types Data</h3>
          <div>
            <Button
              startIcon={<AddIcon />}
              onClick={handleMarginType}
              sx={{
                borderRadius: "8px",
                padding: "5px 12px",
                color: "#fff",
                background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              }}
            >
              ADD
            </Button>
          </div>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'MarginName'}
                    direction={orderBy === 'MarginName' ? order : 'asc'}
                    onClick={() => handleRequestSort('MarginName')}
                  >
                    Margin Type
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'tier'}
                    direction={orderBy === 'tier' ? order : 'asc'}
                    onClick={() => handleRequestSort('tier')}
                  >
                    Tier
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'tierPercentage'}
                    direction={orderBy === 'tierPercentage' ? order : 'asc'}
                    onClick={() => handleRequestSort('tierPercentage')}
                  >
                    Percentage
                  </TableSortLabel>
                </StyledTableCell>
                {storedUserData &&
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
              {sortedMarginListType.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length ? (
                sortedMarginListType.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                    <StyledTableCell>{data.MarginName}</StyledTableCell>
                    <StyledTableCell>{data.tier}</StyledTableCell>
                    <StyledTableCell>{`${data.tierPercentage}%`}</StyledTableCell>
                    {storedUserData &&
                      (storedUserData.team === "Admin" ||
                        (storedUserData.team === "Pricing" &&
                          storedUserData.userRole !== "Senior Executive")) &&
                      (storedUserData.userRole === "Manager" ||
                        storedUserData.userRole === "Senior Executive" ||
                        storedUserData.userRole === "Admin" ||
                        storedUserData.userRole === "Super Admin") && (
                        <StyledTableCell>
                          <IconButton onClick={() => handleEdit(data)} color="success">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(data)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={6} align="center">
                    <Typography component="h5" variant="h5">
                      No records found
                    </Typography>
                    <img src={userNotFound} alt="not found" width="100" height="100" />
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedMarginListType.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {addMarginTypeDialogOpen && (
          <MarginTypeForm
            addMarginTypeDialogOpen={addMarginTypeDialogOpen}
            setAddMarginTypeDialogOpen={() => setAddMarginTypeDialogOpen(false)}
            fetchMarginType={fetchMarginType}
          />
        )}
        {editMarginDialogOpen && (
          <MarginTypeForm
            addMarginTypeDialogOpen={editMarginDialogOpen}
            setAddMarginTypeDialogOpen={() => setEditMarginDialogOpen(false)}
            marginData={selectedMargin}
            fetchMarginType={fetchMarginType}
          />
        )}
        {deleteDialogOpen && (
          <DeleteComponentDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Confirm Delete"
            message="Are you sure you want to delete this margin type?"
          />
        )}
        {snackbarOpen && (
          <CustomSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarType}
          />
        )}
      </div>
    );
  }

  return <Loading />;
}

export default MarginTypeList;
