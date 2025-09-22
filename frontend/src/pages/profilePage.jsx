import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FiCamera, FiUser, FiMail } from "react-icons/fi"
import api from "../lib/api/CleintApi"
import { useSelector } from "react-redux"


const ProfilePage = () => {
  const queryClient = useQueryClient()
  const{user,token}=useSelector(state=>state.auth)

  // Local state
  const [username, setUsername] = useState("John Doe")
  const [avatarPreview, setAvatarPreview] = useState("") // for UI preview
  const [avatarFile, setAvatarFile] = useState(null) // actual file

  // Example user object (simulate logged-in user)
 

  // ✅ Mutation with FormData
  const mutation = useMutation({
    mutationFn: async (newProfile) => {
      const formData = new FormData()
      formData.append("username", newProfile.username)
      formData.append("email", newProfile.email)
      if (newProfile.avatar) formData.append("avatar", newProfile.avatar)

      const res = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profile"])
      alert("✅ Profile updated successfully!")
    },
    onError: (error) => {
      console.error("Profile update failed:", error)
      alert("❌ Failed to update profile. Try again.")
    },
  })

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file)) 
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      username,
      avatar: avatarFile, // send file directly
      email: user.email,
    })
  }

  return (
    <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 flex flex-col items-center py-8">
            <div className="relative group">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={
                    avatarPreview ||
                    "https://images.unsplash.com/photo-1495211895963-08d8812dcbf0?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt="Profile"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              {/* Camera Icon for Upload */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer
                 transform transition-transform duration-200 hover:scale-110"
              >
                <FiCamera className="w-5 h-5 text-orange-600" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* User Info */}
            <h2 className="mt-4 text-2xl font-bold text-white">{username}</h2>
            <p className="text-orange-100">{user.email}</p>
          </CardHeader>

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    className="pl-10 bg-muted"
                    disabled
                  />
                </div>
              </div>
            </CardContent>

            {/* Action Buttons */}
            <CardFooter className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
