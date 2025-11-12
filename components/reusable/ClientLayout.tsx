"use client"
import { DynamicLanguageProvider } from '@/contexts/DynamicLanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { store } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import CustomToastContainer from '../CustomToast/CustomToastContainer'

function ClientLayout({ children, lang }: { children: React.ReactNode, lang: any }) {
  return (
    <div>
      <Provider store={store}>
        <DynamicLanguageProvider initialLanguage={lang}>
          <ThemeProvider>
            <CustomToastContainer />
            {children}
          </ThemeProvider>
        </DynamicLanguageProvider>
      </Provider>
    </div>
  )
}

export default ClientLayout
