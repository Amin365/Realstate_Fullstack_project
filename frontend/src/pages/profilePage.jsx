"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Bell,
  Globe,
  Lock,
  LogOut,
  Trash2,
  Save,
  Edit,
  X,
  FileText,
  BarChart,
  MessageSquare,
  Folder,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { useSelector } from "react-redux";
import api from "../lib/api/CleintApi";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tempData, setTempData] = useState(null);

  // ✅ Fetch Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?._id],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.user;
    },
    enabled: !!user,
    onSuccess: (data) => setTempData(data),
  });

  // ✅ Handle Profile Photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempData({ ...tempData, profile: file, preview: previewUrl });
    }
  };

  // ✅ Update Profile
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
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["profile", user?._id]);
      setEditMode(false);
    },
    onError: () => toast.error("Failed to update profile."),
  });

  // ✅ Delete Account
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/auth/delete");
    },
    onSuccess: () => {
      toast.success("Account deleted successfully!");
      setShowDeleteModal(false);
    },
    onError: () => toast.error("Failed to delete account."),
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 transition-colors">
      <motion.div
        className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* LEFT SIDE */}
        <Card className="rounded-2xl shadow-md p-4 md:col-span-1 dark:bg-slate-800">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={
                  tempData?.preview ||
                  (tempData?.profile?.startsWith("/uploads")
                    ? `http://localhost:5000${tempData.profile}`
                    : tempData?.profile) ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              {editMode && (
                <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center cursor-pointer text-white text-sm">
                  <Camera size={22} className="mb-1" />
                  Change
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-semibold">{profile?.name}</h2>
            <p className="text-gray-500 flex items-center gap-2">
              <Shield size={16} /> {profile?.role}
            </p>
            <p className="text-gray-500 flex items-center gap-2">
              <Calendar size={16} /> Member since{" "}
              {new Date(profile?.createdAt).toLocaleDateString()}
            </p>

            {/* Stats */}
            <div className="w-full border-t pt-4 space-y-3">
              <h3 className="text-lg font-semibold">Account Stats</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Folder, label: "Projects", value: 8 },
                  { icon: BarChart, label: "Logins", value: 27 },
                  { icon: MessageSquare, label: "Messages", value: 12 },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 text-center bg-gray-100 dark:bg-slate-700"
                  >
                    <stat.icon className="mx-auto mb-1 text-blue-500" size={18} />
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE */}
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
                      setTempData(profile);
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
                { icon: Phone, key: "phone", label: "Phone" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-gray-500 flex items-center gap-2">
                    <f.icon size={16} /> {f.label}
                  </label>
                  <Input
                    disabled={!editMode}
                    value={tempData?.[f.key] || ""}
                    onChange={(e) =>
                      setTempData({ ...tempData, [f.key]: e.target.value })
                    }
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
              <Button variant="outline" className="w-full flex gap-2">
                <Lock size={16} /> Change Password
              </Button>

              <div className="rounded-xl p-3 bg-gray-100 dark:bg-slate-700">
                <p className="text-sm font-medium mb-2 flex gap-2">
                  <LogOut size={16} /> Recent Logins
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>📍 Addis Ababa — Oct 11, 2025</li>
                  <li>📍 Nairobi — Oct 8, 2025</li>
                  <li>📍 Mobile Login — Oct 6, 2025</li>
                </ul>
              </div>
            </div>

            {/* Delete Account */}
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full flex gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={16} /> Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            className="p-6 rounded-2xl w-96 bg-white text-gray-800 dark:bg-slate-800 dark:text-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-semibold mb-3 flex gap-2">
              <Trash2 /> Confirm Delete
            </h3>
            <p className="text-sm mb-4 text-gray-500">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
