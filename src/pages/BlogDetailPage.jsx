import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import blogApi from "../api/blogApi";

import {
  Container,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const rawData = await blogApi.getBlogById(id);
        const formatted = blogApi.formatBlog(rawData); // ✅ định dạng thêm
        setBlog(formatted);
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

        {/* Thông tin tác giả và ngày */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ width: 32, height: 32 }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {blog.author?.name || "Tác giả không rõ"}
          </Typography>
          <Box display="flex" alignItems="center">
            <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {blog.formattedDate}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            • {blog.readingTime}
          </Typography>
        </Box>

        {/* Ảnh bìa */}
        <Box
          component="img"
          src={
            blog.imageCover?.startsWith("http")
              ? blog.imageCover
              : `https://prevention-api-tdt.onrender.com/img/blogs/${blog.imageCover}`
          }
          alt={blog.title}
          sx={{
            width: "100%",
            borderRadius: 2,
            maxHeight: 400,
            objectFit: "cover",
            mb: 3,
            boxShadow: 2,
          }}
          onError={(e) => (e.target.src = "/default.jpg")}
        />

        {/* Tags (nếu có) */}
        {blog.tags && blog.tags.length > 0 && (
          <Stack direction="row" spacing={1} mb={2}>
            {blog.tags.map((tag, index) => (
              <Chip key={index} label={tag} color="primary" size="small" />
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Nội dung chính */}
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
