import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import authApi from "../api/authApi";
import "../styles/Profile.scss";

const Profile = ({ show, onHide, user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    photo: ""
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        photo: user.photo || ""
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Gọi API update profile
      const updatedUser = await authApi.updateProfile(profileForm);
      onUserUpdate(updatedUser);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error) {
      setMessage({ type: "danger", text: error.message || "Có lỗi xảy ra khi cập nhật thông tin" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "danger", text: "Mật khẩu mới không khớp!" });
      setLoading(false);
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setMessage({ type: "danger", text: error.message || "Có lỗi xảy ra khi đổi mật khẩu" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setMessage({ type: "danger", text: "Vui lòng nhập 'DELETE' để xác nhận!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authApi.deleteAccount();
      authApi.logout();
      onHide();
      window.location.href = "/login";
    } catch (error) {
      setMessage({ type: "danger", text: error.message || "Có lỗi xảy ra khi xóa tài khoản" });
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="profile-tab">
      <div className="user-info mb-4">
        <div className="user-avatar">
          <img 
            src={user?.photo || "https://via.placeholder.com/100x100?text=Avatar"} 
            alt="User Avatar" 
            className="avatar-img"
          />
        </div>
        <div className="user-details">
          <h5 className="mb-2">Thông tin cá nhân</h5>
          <p><strong>ID:</strong> {user?.id || "N/A"}</p>
          <p><strong>Vai trò:</strong> {user?.role || "User"}</p>
        </div>
      </div>

      <Form onSubmit={handleProfileUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Họ tên</Form.Label>
          <Form.Control
            type="text"
            value={profileForm.name}
            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL Ảnh đại diện</Form.Label>
          <Form.Control
            type="url"
            value={profileForm.photo}
            onChange={(e) => setProfileForm({...profileForm, photo: e.target.value})}
            placeholder="https://example.com/avatar.jpg"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Cập nhật thông tin"}
        </Button>
      </Form>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="password-tab">
      <h5 className="mb-3">Đổi mật khẩu</h5>
      <Form onSubmit={handlePasswordChange}>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu hiện tại</Form.Label>
          <Form.Control
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            required
            minLength={6}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            required
          />
        </Form.Group>

        <Button type="submit" variant="warning" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Đổi mật khẩu"}
        </Button>
      </Form>
    </div>
  );

  const renderDeleteTab = () => (
    <div className="delete-tab">
      <div className="alert alert-danger">
        <h5>⚠️ Cảnh báo!</h5>
        <p>Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và không thể khôi phục.</p>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Nhập "DELETE" để xác nhận</Form.Label>
        <Form.Control
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="DELETE"
        />
      </Form.Group>

      <Button 
        variant="danger" 
        onClick={() => setShowDeleteModal(true)}
        disabled={deleteConfirm !== "DELETE" || loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Xóa tài khoản"}
      </Button>
    </div>
  );

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Hồ sơ cá nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message.text && (
            <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
              {message.text}
            </Alert>
          )}

          <div className="profile-tabs mb-3">
            <Button
              variant={activeTab === "profile" ? "primary" : "outline-primary"}
              onClick={() => setActiveTab("profile")}
              className="me-2"
            >
              Thông tin
            </Button>
            <Button
              variant={activeTab === "password" ? "primary" : "outline-primary"}
              onClick={() => setActiveTab("password")}
              className="me-2"
            >
              Đổi mật khẩu
            </Button>
            <Button
              variant={activeTab === "delete" ? "danger" : "outline-danger"}
              onClick={() => setActiveTab("delete")}
            >
              Xóa tài khoản
            </Button>
          </div>

          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "password" && renderPasswordTab()}
          {activeTab === "delete" && renderDeleteTab()}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Xóa tài khoản
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile; 