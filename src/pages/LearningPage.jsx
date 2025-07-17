// src/pages/LearningPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import courseApi from "../api/courseAPI"

const LearningPage = () => {
  const { id } = useParams(); // course id
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseApi.getCourseDetail(id);
        setCourse(response?.data); // giả sử response có .data là course detail
      } catch (error) {
        console.error("Failed to fetch course", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Đang tải nội dung học...</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box p={4}>
        <Typography color="error">Không tìm thấy khóa học.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Nội dung học
      </Typography>

      <List>
        {course.content?.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`Chương ${index + 1}: ${item.title}`}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LearningPage;
