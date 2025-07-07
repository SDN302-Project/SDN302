import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/frontend-sdk";

import {
  Container,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.getBlog(id);
        setBlog(res.data.data); // lấy dữ liệu blog
      } catch (err) {
        console.error("Lỗi lấy blog:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ mt: { xs: 8, md: 10 }, textAlign: "center", py: 5 }}>
        <CircularProgress color="primary" />
        <Typography mt={2}>Đang tải bài viết...</Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ mt: { xs: 8, md: 10 }, textAlign: "center", py: 5 }}>
        <Typography color="error">Không tìm thấy bài viết.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: { xs: 8, md: 10 }, minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Tiêu đề */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {blog.title}
        </Typography>

        {/* Tác giả */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {blog.author?.name || "Tác giả không rõ"}
          </Typography>
        </Box>

        {/* Ảnh bìa */}
        <Box
          component="img"
          src={blog.imageCover || "/default.jpg"}
          alt={blog.title}
          sx={{
            width: "100%",
            borderRadius: 2,
            maxHeight: 400,
            objectFit: "cover",
            mb: 3,
            boxShadow: 2,
          }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Nội dung */}
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.1rem" }}
        >
          {blog.content}
        </Typography>
      </Container>
    </Box>
  );
};

export default BlogDetailPage;
