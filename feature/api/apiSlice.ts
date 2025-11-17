
import { getCookieToken } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { URL } from "../../config/app.config"

export const apiSlice = createApi({
    reducerPath: `api`,
    baseQuery: fetchBaseQuery({
        baseUrl: `${URL}/api`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = getCookieToken()
            if (token) headers.set('Authorization', `Bearer ${token}`)
            return headers
        },
    }),
    tagTypes: ["difficulties", "topics", "languages", "serviceType","admin","question"],
    endpoints: (builder) => ({
        // Define endpoints here
        getDificulties: builder.query({
            query: ({ params }) => ({
                url: `/admin/difficulties?${params}`,
            }),
            providesTags: ["difficulties"]
        }),
        addDificulties: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/difficulties`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["difficulties"]
        }),
        updateDificulties: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/difficulties/${id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["difficulties"]
        }),
        deleteDificulties: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/difficulties/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["difficulties"]
        }),
        getLanguages: builder.query({
            query: ({params}) => ({
                url: `/admin/languages?${params}`,
            }),
            providesTags: ["languages"]
        }),
        getQuestionType: builder.query({
            query: () => ({
                url: `/admin/question-types`,
            }),
        }),
        addLanguages: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/languages`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["languages"]
        }),
        updateLanguages: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/languages/${id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["languages"]
        }),
        deleteLanguages: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/languages/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["languages"]
        }),

        getTopics: builder.query({
            query: ({ params }) => ({
                url: `/admin/categories?${params}`,
            }),
            providesTags: ["topics"]
        }),
        getTopicsExport: builder.query({
            query: () => ({
                url: `/admin/categories/export`,
            }),
            providesTags: ["topics"]
        }),
        addTopicsImport: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/categories/import`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["topics"]
        }),
        addTopics: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/categories`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["topics"]
        }),
        updateTopic: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/categories/${id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["topics"]
        }),
        deleteTopics: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/categories/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["topics"]
        }),
        getServiceType: builder.query({
            query: ({ params }) => ({
                url: `/admin/subscription-types?${params}`,
            }),
            providesTags: ["serviceType"]
        }),
        addServiceType: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/subscription-types`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["serviceType"]
        }),
        updateServiceType: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/subscription-types/${id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["serviceType"]
        }),
        deleteServiceType: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/subscription-types/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["serviceType"]
        }),
        getPreviousGame: builder.query({
            query: ({ params }) => ({
                url: `/admin/games?${params}`,
            }),
        }),
        getPlayers: builder.query({
            query: ({ params }) => ({
                url: `/admin/players?${params}`,
            }),
        }),
        getAdmin: builder.query({
            query: ({ params }) => ({
                url: `/admin/user?${params}`,
            }),
            providesTags:["admin"]
        }),
        getSubscription: builder.query({
            query: ({ params }) => ({
                url: `/admin/subscription/users?${params}`,
            }),
            providesTags:["admin"]
        }),
        getHost: builder.query({
            query: ({ params }) => ({
                url: `/admin/user?${params}`,
            }),
            providesTags:["admin"]
        }),
         addAdmin: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/user`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["admin"]
        }),
        updateAdmin: builder.mutation({
            query: ({ id,data }) => ({
                url: `/admin/user/${id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["admin"]
        }),
        deleteAdmin: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/user/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["admin"]
        }),
         getQuestion: builder.query({
            query: ({ params }) => ({
                url: `/admin/questions?${params}`,
            }),
            providesTags:["question"]
        }),
         addQuestion: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/questions`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["question"]
        }),
        updateQuestion: builder.mutation({
            query: ({ id ,data }:any) => ({
                url: `/admin/questions/${id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["question"]
        }),
        deleteQuestion: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/questions/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["question"]
        }),
          getQuestionExport: builder.query({
            query: () => ({
                url: `/admin/questions/export`,
            }),
            providesTags: ["question"]
        }),
      
        addQuestionImport: builder.mutation({
            query: ({ data }) => ({
                url: `/admin/questions/import`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["question"]
        }),
    }),
})

export const {
    useGetDificultiesQuery,
    useAddDificultiesMutation,
    useUpdateDificultiesMutation,
    useDeleteDificultiesMutation,
    useGetTopicsQuery,
    useAddTopicsMutation,
    useDeleteTopicsMutation,
    useUpdateTopicMutation,
    useGetLanguagesQuery,
    useAddLanguagesMutation,
    useAddTopicsImportMutation,
    useUpdateLanguagesMutation,
    useDeleteLanguagesMutation,
    useGetTopicsExportQuery,
    useGetServiceTypeQuery,
    useAddServiceTypeMutation,
    useDeleteServiceTypeMutation,
    useUpdateServiceTypeMutation,
    useGetPreviousGameQuery,
    useGetPlayersQuery,
    useGetAdminQuery,
    useAddAdminMutation,
    useDeleteAdminMutation,
    useUpdateAdminMutation,
    useGetSubscriptionQuery,
    useGetHostQuery,
    useAddQuestionImportMutation,
    useDeleteQuestionMutation,
    useGetQuestionQuery,
    useGetQuestionExportQuery,
    useGetQuestionTypeQuery,
    useUpdateQuestionMutation,
    useAddQuestionMutation

} = apiSlice