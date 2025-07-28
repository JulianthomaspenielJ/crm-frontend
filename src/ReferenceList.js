import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ReferenceDialog from "./ReferenceDialog";
import ReferenceDtsDialog from "./ReferenceDtsDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#224193",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ReferenceList() {
  const CRMBaseURL = AuthService();
  const [referenceDialog, setReferenceDialog] = useState(false);
  const [referenceDtsDialog, setReferenceDtsDialog] = useState(false);

  const [referenceData, setReferenceData] = useState([]);
  const [dataUpdateMsg, setDataUpdateMsg] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  const handleClose = () => {
    setDataUpdateMsg(false);
  };

  const fetch = async () => {
    try {
      const referenceData = await CRMBaseURL.get("/getproducts");

      
      
      const data = referenceData.data["Response "];
     
      setReferenceData(data);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const postData = async (id) => {
   
    try {
      const response = await CRMBaseURL.post(`getproductdata`, { id });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div style={{ textAlign: "end" }}>

        <Button
          variant="contained"
          color="primary"
          sx={{ textAlign: "end", marginBottom: 3, paddingX: 3 }}
          onClick={() => {
            setReferenceDialog(true);
          }}
        >
          + ADD
        </Button>
        
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S.NO</StyledTableCell>
              <StyledTableCell align="center">Reference Name</StyledTableCell>
              <StyledTableCell align="center">Created By</StyledTableCell>
              <StyledTableCell align="center">Created At</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? referenceData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : referenceData
            ).map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row.package}</TableCell>
                <TableCell align="center">{row.created_by}</TableCell>
                <TableCell align="center">{row.created_at}</TableCell>
                <TableCell align="center">
                  <Tooltip title="More Details">
                    <IconButton
                      onClick={() => {
                        postData(row.product_id);
                        setReferenceDtsDialog(true)
                        // setComponentFormOpen(true);
                      }}
                    >
                      <RemoveRedEyeIcon color="success" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={referenceData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ReferenceDialog setReferenceDialog={setReferenceDialog} referenceDialog={referenceDialog}/>
      <ReferenceDtsDialog setReferenceDtsDialog={setReferenceDtsDialog} referenceDtsDialog={referenceDtsDialog}/>

      
    </>
  );
}

export default ReferenceList;
