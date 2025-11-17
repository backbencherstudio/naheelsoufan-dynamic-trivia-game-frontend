import { Button } from '@/components/ui/button';
import { useAddQuestionMutation, useGetDificultiesQuery, useGetLanguagesQuery, useGetQuestionTypeQuery, useGetTopicsQuery, useUpdateQuestionMutation } from '@/feature/api/apiSlice';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaDownload } from 'react-icons/fa6';
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { Dialog, DialogContent } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
type FormValues = {
  language?: string;
  topic?: string;
  difficulty?: string;
  freeBundle?: string;
  firebaseQuestion?: string;
  questionType?: any;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  answer?: string;
  question?: string;
  answerTime: number;
  points: number;
  image?: File | null;
  optionAFile?: File | null;
  optionBFile?: File | null;
  optionCFile?: File | null;
  optionDFile?: File | null;
};

function QuestionViewDetails({ isOpen, onClose, editData, }: { isOpen: boolean, onClose: () => void, editData?: any, }) {

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-[95vw] md:w-[650px] lg:max-w-[700px] max-h-[95vh] overflow-y-auto'>
               details
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionViewDetails
