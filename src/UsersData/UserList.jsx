import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AuthService from "../services/AuthService"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IconButton, Tooltip } from '@mui/material';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:"#224193",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));



export default function CustomizedTables() {
    const CRMBaseURL = AuthService();

    const [userData, setUserData] = React.useState([]);
    const fetch = async () => {
        try {
          const UserData = await CRMBaseURL.get("approveuser");
    
          setUserData(UserData.data.users);
        } catch (err) {
          console.log("Error occurred", err);
        }
      };
    
      React.useEffect(() => {
        fetch();
      }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">S.NO</StyledTableCell>
            <StyledTableCell align="center">UserName</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
           
          </TableRow>
        </TableHead>
        
        <TableBody>
          {userData && userData.map((row,index) => (
          <TableRow key={index}>
            <TableCell align='center'>
              1
            </TableCell>
            <TableCell align='center'>
                {row.name}
            </TableCell>
            <TableCell align='center'>
                {row.email}
            </TableCell>
            <TableCell align='center'>
            <Tooltip title="View">
              <IconButton><RemoveRedEyeIcon color='warning'/></IconButton>
              </Tooltip>
            </TableCell>

          </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}