"use client";
import Image from 'next/image';
import { Clock, Zap, BookOpen, BarChart3, Globe, HelpCircle, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '../ui/dialog';

interface Category {
  id: string;
  name: string;
}

interface Language {
  id: string;
  name: string;
}

interface Difficulty {
  id: string;
  name: string;
}

interface QuestionType {
  id: string;
  name: string;
}

interface Answer {
  id: string;
  text: string;
  is_correct: boolean;
  file_url: string | null;
}

interface QuestionData {
  id: string;
  text: string;
  file_url: string;
  time: number;
  free_bundle: boolean;
  firebase: null;
  points: number;
  repeat_count: number;
  created_at: string;
  updated_at: string;
  category: Category;
  language: Language;
  difficulty: Difficulty;
  question_type: QuestionType;
  answers: Answer[];
  question_file_url: string;
}

interface QuestionCardProps {
  data: QuestionData;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


function QuestionViewDetails({ isOpen, onClose, data, }: { isOpen: boolean, onClose: () => void, data?: any, }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

   const detectMediaKind = (src: string, file?: File | null): 'image' | 'audio' | 'video' => {
    if (file && file.type) {
      if (file.type.startsWith('image')) return 'image';
      if (file.type.startsWith('audio')) return 'audio';
      if (file.type.startsWith('video')) return 'video';
    }
    const lower = src?.toLowerCase();
    if (/(mp4|webm|ogg|mov|m4v)$/.test(lower)) return 'video';
    if (/(mp3|wav|ogg|m4a)$/.test(lower)) return 'audio';
    return 'image';
  };
    const kind = detectMediaKind(data.question_file_url, typeof data.question_file_url !== 'string' ? (data.question_file_url as File | null) : null);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-[95vw] md:!max-w-[650px] lg:!max-w-[900px] w-full px-4 lg:px-6 max-h-[95vh] overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Header with background gradient */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 translate-y-16"></div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:px-8 md:px-4 px-2 pb-8  -mt-16 relative z-10">
              {/* Question image and metadata top section */}
              <div className="flex gap-3 md:gap-6 mb-6">
                {/* Question Image */}
                <div className="flex-shrink-0">
                  {
                               data.question_file_url == null || data.question_file_url== "" ? <span className="text-sm border rounded-sm bg-grayColor1/60 w-full h-17 flex items-center justify-center text-gray-500">No Image</span> :
                                <div className=" rounded-md ">
                               {kind === 'image' && (
                                <div className='md:w-32 w-16 h-16 md:h-32 bg-white rounded-lg shadow-md overflow-hidden border-4 border-white'>
                                 <Image src={data.question_file_url} alt="preview" width={100} height={100} className=" h-full w-full object-contain" />
                                   </div>
                               )}
                               {kind === 'audio' && (
                                 <div className="relative">
                                   {data.question_file_url.startsWith('blob:') ? (
                                     // Local preview audio (blob URL)
                                     <audio controls src={data.question_file_url} className="w-full" />
                                   ) : (
                                     // Server audio with CORS handling
                                     <div className="relative">
                                       <audio
                                         controls
                                         className="w-full"
                                         preload="none"
                                         crossOrigin="anonymous"
                                         onLoadStart={() => console.log('Audio loading started for:', data.question_file_url)}
                                         onCanPlay={() => console.log('Audio can play:', data.question_file_url)}
                                         onLoadedData={() => console.log('Audio data loaded:', data.question_file_url)}
                                         onError={(e) => {
                                           // Try without CORS
                                           if (e.currentTarget.crossOrigin) {
                                             console.log('Retrying audio without CORS...');
                                             e.currentTarget.crossOrigin = null;
                                             e.currentTarget.load();
                                           }
                                         }}
                                       >
                                         <source src={data.question_file_url} type="audio/mpeg" />
                                         <source src={data.question_file_url} type="audio/wav" />
                                         <source src={data.question_file_url} type="audio/ogg" />
                                         Your browser does not support the audio element.
                                       </audio>
                 
                 
                                     </div>
                                   )}
                                 </div>
                               )}
                               {kind === 'video' && (
                                 <div className="relative w-20 h-16  md:w-48 md:h-30">
                                   {data.question_file_url.startsWith('blob:') ? (
                                     // Local preview video (blob URL)
                                     <video
                                       controls
                                       src={data.question_file_url}
                                       className="h-full w-full object-contain rounded-lg "
                                       width={200}
                                       height={100}
                                       preload="metadata"
                                       playsInline
                                       muted
                                       style={{ maxWidth: '100%', maxHeight: '100%' }}
                                     />
                                   ) : (
                                     // Server video with CORS handling
                                     <div className="relative  w-22 h-16  md:w-48 md:h-30">
                                       <video
                                         controls
                                         className="h-full w-full object-contain rounded-lg  bg-gray-100"
                                         width={200}
                                         height={100}
                                         preload="none"
                                         playsInline
                                         crossOrigin="anonymous"
                                         onLoadStart={() => console.log('Video loading started for:', data.question_file_url)}
                                         onCanPlay={() => console.log('Video can play:', data.question_file_url)}
                                         onLoadedData={() => console.log('Video data loaded:', data.question_file_url)}
                                         onLoadedMetadata={() => console.log('Video metadata loaded:', data.question_file_url)}
                                         onError={(e) => {
                 
                                           // Try without CORS
                                           if (e.currentTarget.crossOrigin) {
                                             console.log('Retrying without CORS...');
                                             e.currentTarget.crossOrigin = null;
                                             e.currentTarget.load();
                                           }
                                         }}
                                         style={{ maxWidth: '100%', maxHeight: '100%' }}
                                       >
                                         <source src={data.question_file_url} type="video/mp4" />
                                         <source src={data.question_file_url} type="video/webm" />
                                         Your browser does not support the video tag.
                                       </video>
                                     </div>
                                   )}
                                 </div>
                               )}
                             </div>
                             }
                </div>

                {/* Top metadata badges */}
                <div className="flex-grow pt-4">

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-whiteColor mb-1">Difficulty </p>
                      <Badge className={getDifficultyColor(data.difficulty.name)}>
                        {data.difficulty.name}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-whiteColor mb-1"> Category</p>
                      <Badge className="bg-blue-100 text-blue-800">
                        {data.category.name}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-whiteColor mb-1">Question Type</p>
                      <Badge className="bg-purple-100 text-purple-800">
                        {data.question_type.name}
                      </Badge>
                    </div>
                  
                  </div>
                  <h2 className="md:text-2xl text-base font-bold text-gray-900">{data.text}</h2>
                </div>
              </div>

              {/* Question details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-6 border-t border-gray-200">
                {/* Time */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Time Limit</p>
                    <p className="text-lg font-bold text-gray-900">{data.time}s</p>
                  </div>
                </div>

                {/* Points */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Points</p>
                    <p className="text-lg font-bold text-gray-900">{data.points}</p>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Language</p>
                    <p className="text-lg font-bold text-gray-900">{data.language.name}</p>
                  </div>
                </div>

                {/* Repeat Count */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Attempts</p>
                    <p className="text-lg font-bold text-gray-900">{data.repeat_count}</p>
                  </div>
                </div>
              </div>

              {data.answers && data.answers.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Answers</h3>
                  <div className="space-y-3">
                    {data.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${answer.is_correct
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-300'
                          }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${answer.is_correct ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-grow">
                          <p className={`font-semibold ${answer.is_correct ? 'text-green-900' : 'text-gray-900'
                            }`}>
                            {answer.text}
                          </p>
                        </div>
                        {answer.is_correct && (
                          <Badge className="bg-green-500 text-white">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer with timestamps */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 text-sm text-gray-600">
                <div className="mb-4 sm:mb-0">
                  <p>Created: <span className="font-semibold text-gray-900">{formatDate(data.created_at)}</span></p>
                </div>
                <div>
                  <p>ID: <span className="font-mono text-xs text-gray-500 break-all">{data.id}</span></p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionViewDetails
