
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
    tagTypes: ["difficulties", "topics", "languages"],
    endpoints: (builder) => ({
        // Define endpoints here
        getDificulties: builder.query({
            query: ({ params }) => ({
                url: `/admin/difficulties?${params}`,

            }),
            providesTags: ["difficulties"]
        }),
        addDificulties: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/difficulties/${id}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: data
            })
        }),
        getLanguages: builder.query({
            query: () => ({
                url: `/admin/languages`,
            }),
            providesTags: ["languages"]
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
        getTopics: builder.query({
            query: ({ params }) => ({
                url: `/admin/topics?${params}`,
            }),
            providesTags: ["topics"]
        }),
        addTopics: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/topics/${id}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data
            }),
            invalidatesTags: ["topics"]
        }),
        deleteTopics: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/topics/${id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["topics"]
        })
    }),
})

export const { useGetDificultiesQuery, useAddDificultiesMutation, useDeleteDificultiesMutation, useGetTopicsQuery, useAddTopicsMutation, useDeleteTopicsMutation , useGetLanguagesQuery, useAddLanguagesMutation, useUpdateLanguagesMutation, useDeleteLanguagesMutation } = apiSlice