"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Lock,
  LogOut,
  Trash2,
  Save,
  Edit,
  X,
  FileText,
  Laptop,
  Smartphone,
  Activity,
  Battery,
  CheckCircle,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { useSelector } from "react-redux";
import api from "../lib/api/CleintApi";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempData, setTempData] = useState(user || {});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔹 Profile completion logic (example)
  const profileCompletion = Math.min(
    100,
    [
      user?.name,
      user?.email,
      user?.phone,
      user?.bio,
      user?.profile,
    ].filter(Boolean).length * 20
  );

  // 🔹 Mock data
  const recentActivities = [
    { id: 1, action: "Updated profile picture", time: "2 hours ago" },
    { id: 2, action: "Changed password", time: "1 day ago" },
    { id: 3, action: "Logged in from Chrome", time: "2 days ago" },
  ];

  const loginDevices = [
    { id: 1, device: "Windows 11 - Chrome", icon: Laptop, active: true },
    { id: 2, device: "iPhone 13 - Safari", icon: Smartphone, active: false },
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempData({ ...tempData, profile: file, preview: previewUrl });
    }
  };

  // 🔹 Update Profile
  const updateMutation = useMutation({
    mutationFn: async (updatedProfile) => {
      const formData = new FormData();
      for (const key in updatedProfile) {
        if (key === "preview") continue;
        formData.append(key, updatedProfile[key]);
      }
      const res = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.user;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["profile"]);
      setEditMode(false);
    },
    onError: () => toast.error("Failed to update profile."),
  });

  // 🔹 Delete Account
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/auth/delete");
    },
    onSuccess: () => {
      toast.success("Account deleted successfully!");
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onError: () => toast.error("Failed to delete account."),
  });

  // 🔹 Change Password
  const passwordMutation = useMutation({
    mutationFn: async (passwords) => {
      const res = await api.put("/auth/change-password", passwords);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: () => toast.error("Failed to change password."),
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100">
      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* LEFT SIDE - Profile Overview */}
        <Card className="rounded-2xl shadow-md p-4 dark:bg-slate-800 md:col-span-1">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={tempData.preview || user?.profile || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              {editMode && (
                <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center cursor-pointer text-white text-sm">
                  <Camera size={22} className="mb-1" />
                  Change
                  <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500 flex items-center gap-2">
              <Shield size={16} /> {user?.role}
            </p>
            <p className="text-gray-500 flex items-center gap-2">
              <Calendar size={16} /> Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>

            {/* 🔹 Profile Completion */}
            <div className="w-full border-t pt-4 space-y-2">
              <h3 className="text-lg font-semibold">Profile Completion</h3>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-sm text-gray-500">{profileCompletion}% Complete</p>
            </div>

            {/* 🔹 Profile Insights */}
            <div className="w-full border-t pt-4 space-y-3">
              <h3 className="text-lg font-semibold flex gap-2 items-center">
                <Activity size={18} /> Profile Insights
              </h3>

              {/* Recent Activities */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Recent Activities</h4>
                {recentActivities.map((a) => (
                  <div
                    key={a.id}
                    className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm flex justify-between"
                  >
                    <span>{a.action}</span>
                    <span className="text-gray-400">{a.time}</span>
                  </div>
                ))}
              </div>

              {/* Login Devices */}
              <div className="space-y-2 pt-2">
                <h4 className="font-medium text-sm text-gray-500">Login Devices</h4>
                {loginDevices.map((d) => (
                  <div
                    key={d.id}
                    className={`p-2 rounded-lg flex items-center justify-between ${
                      d.active ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <d.icon size={16} /> {d.device}
                    </div>
                    {d.active && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE - Profile Details */}
        <Card className="md:col-span-2 rounded-2xl shadow-md dark:bg-slate-800">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Profile Details</CardTitle>
            <div className="flex items-center gap-3">
              <ModeToggle />
              {!editMode ? (
                <Button onClick={() => setEditMode(true)} className="rounded-xl flex gap-2">
                  <Edit size={16} /> Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    onClick={() => updateMutation.mutate(tempData)}
                    className="rounded-xl flex gap-2"
                    disabled={updateMutation.isPending}
                  >
                    <Save size={16} />
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTempData(user);
                      setEditMode(false);
                    }}
                    className="rounded-xl flex gap-2"
                  >
                    <X size={16} /> Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[{ icon: User, key: "name", label: "Full Name" },
                { icon: Mail, key: "email", label: "Email" },
                { icon: Phone, key: "phone", label: "Phone" }].map((f) => (
                <div key={f.key}>
                  <label className="text-gray-500 flex items-center gap-2">
                    <f.icon size={16} /> {f.label}
                  </label>
                  <Input
                    disabled={f.key === "email" || !editMode}
                    value={tempData?.[f.key] || ""}
                    onChange={(e) => setTempData({ ...tempData, [f.key]: e.target.value })}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>

            {/* Bio */}
            <div>
              <label className="text-gray-500 flex items-center gap-2">
                <FileText size={16} /> About Me
              </label>
              <Textarea
                disabled={!editMode}
                value={tempData?.bio || ""}
                onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Security */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-semibold">Security</h3>
              <Button variant="outline" className="w-full flex gap-2" onClick={() => setShowPasswordModal(true)}>
                <Lock size={16} /> Change Password
              </Button>
            </div>

            {/* Delete Account */}
            <div className="pt-4 border-t">
              <Button variant="destructive" className="w-full flex gap-2" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={16} /> Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
