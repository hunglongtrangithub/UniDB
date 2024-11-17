import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";

interface PersonalInfoProps {
  userRole: "student" | "instructor" | "advisor" | "staff" | "admin";
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userRole }) => {
  const [isEditing, setIsEditing] = useState(false);

  // State for user information
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 123-456-7890",
    address: "123 Main Street, Anytown, USA",
    role: userRole,
  });

  // Handler to toggle editing
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // Handler to update user info state
  const handleChange = (key: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 600, margin: "auto", mt: 4 }}
    >
      <Typography variant="h6" align="center" sx={{ mt: 2, mb: 2 }}>
        Personal Information
      </Typography>
      <Table>
        <TableBody>
          {Object.entries(userInfo).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell variant="head">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </TableCell>
              <TableCell>
                {isEditing && key !== "role" ? ( // Make all fields editable except role
                  <TextField
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    size="small"
                    fullWidth
                  />
                ) : (
                  value
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleEdit}
        sx={{ margin: 2 }}
      >
        {isEditing ? "Save" : "Edit"}
      </Button>
    </TableContainer>
  );
};

export default PersonalInfo;
