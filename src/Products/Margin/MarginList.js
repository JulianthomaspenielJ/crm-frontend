import {
  Button,
  Box,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  TableCell,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MarginForm from "./MarginForm";
import userNotFound from "../../Image/useeNotfound.webp";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthService from "../../services/AuthService";
import { tableCellClasses } from "@mui/material/TableCell";
import DeleteComponentDialog from "./DeleteComponentDialog"; // Import the delete dialog
import CustomSnackbar from "../../Activities/SuccessSnackbar/Snackbar";
import Loading from "../../Loading/Loading";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#fff",
    color: "#000",
    fontSize: 14,
    padding:"15px 5px",
    border:'1px solid #fff'
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 12,
    padding: "12px",
    border:'1px solid #f0f0f0'
  },
}));
function MarginList() {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [addMarginDialogOpen, setAddMarginDialogOpen] = useState(false);
  const [editMarginDialogOpen, setEditMarginDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
  const [marginList, setMarginList] = useState([]);
  const [selectedMargin, setSelectedMargin] = useState(null);
  const [marginToDelete, setMarginToDelete] = useState(null);
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchMargin = async () => {
    setLoading(true);
    try {
      const res = await CRMBaseURL.get("getmargintabledata");
      setMarginList(res.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMargin();
  }, []);

  const handleMargin = () => {
    setSelectedMargin(null);
    setAddMarginDialogOpen(true);
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
        const res = await CRMBaseURL.post("deletemargin", params);
        if (res.data.message) {
          setSnackbarType("success");
          setSnackbarMessage(res && res.data.message);
          setErrorOpen(true);
          fetchMargin();
        } else {
          console.error(res.data.message);
          setSnackbarType("error");
          setSnackbarMessage("Something went wrong please try again !");
          setErrorOpen(true);
        }
      } catch (error) {
        console.error("Error deleting margin", error);
      }
    }
    setDeleteDialogOpen(false);
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
      <Box  sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color:"#000"
        }}>
        <h3 style={{ marginRight: "40%", color: "#000" }}>Margin Data</h3>
        <div  >
        <Button
            startIcon={<AddIcon />}
            // className="icon_container"
            onClick={handleMargin}
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
      </Box>
      <TableContainer
        component={Paper}
        // className="table_container"
        // sx={{ borderRadius: 5 }}
      >
   
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0",}}>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Margin Type</StyledTableCell>
              <StyledTableCell>Base Price Percentage</StyledTableCell>
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
            {marginList.length ? (
              marginList.map((data, index) => (
                <TableRow key={data.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{data.marginType}</StyledTableCell>
                  <StyledTableCell>{`${data.bpPercentage} %`}</StyledTableCell>
                  {storedUserData &&
                    storedUserData &&
                    (storedUserData.team === "Admin" ||
                      (storedUserData.team === "Pricing" &&
                        storedUserData.userRole !== "Senior Executive")) &&
                    (storedUserData.userRole === "Manager" ||
                      storedUserData.userRole === "Senior Executive" ||
                      storedUserData.userRole === "Admin" ||
                      storedUserData.userRole === "Super Admin") && (
                      <StyledTableCell>
                        <IconButton
                          onClick={() => handleEdit(data)}
                          color="success"
                        >
                          <EditIcon />
                        </IconButton>
                        {storedUserData &&
                        storedUserData &&
                        (storedUserData.team === "Admin" ||
                          (storedUserData.team === "Pricing" &&
                            storedUserData.userRole !== "Senior Executive")) &&
                        (storedUserData.userRole === "Manager" ||
                          storedUserData.userRole === "Senior Executive" ||
                          storedUserData.userRole === "Admin" ||
                          storedUserData.userRole === "Super Admin") && (
                            <IconButton
                              onClick={() => handleDeleteClick(data)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                      </StyledTableCell>
                    )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <div style={{ padding: "50px 0px" }}>
                    <img
                      src={userNotFound}
                      style={{ width: 200, height: 200 }}
                      alt="No data available"
                    />
                    <Typography>No data available</Typography>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <MarginForm
        open={addMarginDialogOpen}
        onClose={() => setAddMarginDialogOpen(false)}
        fetchMargin={fetchMargin}
      />
      <MarginForm
        open={editMarginDialogOpen}
        onClose={() => setEditMarginDialogOpen(false)}
        fetchMargin={fetchMargin}
        marginData={selectedMargin}
      />

      {/* Delete confirmation dialog */}
      <DeleteComponentDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        componentType="margin"
      />

      <CustomSnackbar
        errorOpen={errorOpen}
        setErrorOpen={setErrorOpen}
        snackbarType={snackbarType}
        snackbarMessage={snackbarMessage}
      />
    </div>
  );
} else {
  return <Loading />;
}
}

export default MarginList;
