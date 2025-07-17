// src/pages/MyCoursesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import courseApi from "../api/courseAPI";

const MyCoursesPage = () => {
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await courseApi.getMyCourses();
        const formatted = res.map(courseApi.formatCourse);
        setMyCourses(formatted);
      } catch (error) {
        console.error("❌ Failed to load courses:", error);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Khóa học của tôi
      </Typography>
      <Grid container spacing={2}>
        {myCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card sx={{ height: "100%" }}>
              {course.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image}
                  alt={course.title}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {course.description}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/learning/${course._id}`)}
                >
                  Học tiếp
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyCoursesPage;
