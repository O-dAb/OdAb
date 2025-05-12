import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileImageUploaderProps {
  onImageUploaded?: (imageUrl: string) => void;
  profileImage?: string;
  name?: string;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ onImageUploaded, profileImage, name }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile_img`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (onImageUploaded) {
        onImageUploaded(response.data.imageUrl);
      }
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
      console.error('이미지 업로드 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <Avatar className="w-24 h-24 border-2 border-blue-200">
        <AvatarImage src={profileImage || ""} />
        <AvatarFallback className="bg-blue-100 text-blue-500 text-xl">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      <label
        htmlFor="profile-image"
        className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer"
        title="프로필 이미지 변경"
      >
        <Camera className="h-4 w-4" />
      </label>
      <input
        id="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        className="mt-2"
        onClick={() => document.getElementById('profile-image')?.click()}
      >
        프로필 이미지 업로드
      </Button>
    </div>
  );
}; 