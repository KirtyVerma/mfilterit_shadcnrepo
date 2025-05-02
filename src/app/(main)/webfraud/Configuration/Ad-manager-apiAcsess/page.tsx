"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook } from "lucide-react"
import { useState } from "react"

export default function AdManagerAccess() {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'googleForm' | 'googleConnect'>('main')
  const [packageName, setPackageName] = useState("")
  const [email, setEmail] = useState("")

  const handleGoogleConnect = () => {
    setCurrentScreen('googleForm')
  }

  const handleSubmitGoogleForm = () => {
    setCurrentScreen('googleConnect')
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-3xl p-8">
        <div className="flex flex-col items-center space-y-8">
          {currentScreen === 'main' && (
            <>
              <h1 className="text-2xl font-semibold text-center">
                Connect your Google Ads, Facebook Ads for automated blacklisting
              </h1>
              
              <div className="flex flex-col space-y-4 w-full max-w-md">
                <Button 
                  variant="outline" 
                  className="w-full p-6 flex items-center justify-center space-x-3 bg-white hover:bg-gray-50"
                  onClick={handleGoogleConnect}
                >
                  <div className="flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8.89l2.75 4.55H9.25L12 8.89zm0-8.05c-1.08 0-2.07.58-2.59 1.52L3.31 15.29c-.52.95-.5 2.1.06 3.02.56.93 1.54 1.46 2.53 1.46h12.2c.99 0 1.97-.53 2.53-1.46.57-.91.58-2.07.06-3.02L14.59 2.36C14.07 1.42 13.08.84 12 .84z" 
                        style={{ fill: '#4285F4' }}
                      />
                      <path d="M23.05 15.07l-6.09-10.54c-.35-.6-.92-1.04-1.58-1.25a2.95 2.95 0 0 0-2 .13c-.62.29-1.11.77-1.41 1.38A2.974 2.974 0 0 1 12 5.5c0 .46-.11.92-.31 1.34-.21.42-.52.78-.9 1.06l2.28 3.96h5.33l-3.9-6.75c.57.13 1.08.42 1.48.84.4.42.67.93.79 1.48l3.4 5.88c.39.68.39 1.5 0 2.18-.39.68-1.12 1.1-1.9 1.1h1.87c.61 0 1.17-.23 1.59-.65.41-.42.65-.97.65-1.56 0-.37-.09-.73-.23-1.06-.11-.22-.23-.42-.38-.61l.28.47z" 
                        style={{ fill: '#FBBC04' }}
                      />
                      <path d="M7.77 17.74l2.27-3.93H4.7c.47.82 1.33 1.34 2.28 1.34.46 0 .9-.11 1.3-.32.4-.21.74-.52 1.01-.89a2.95 2.95 0 0 1-1.04 2.01c-.43.36-.96.59-1.52.67-.56.08-1.13 0-1.65-.23-.51-.23-.96-.6-1.29-1.05L.95 16.68c-.14.26-.25.55-.3.85-.06.3-.05.6.03.9.08.29.21.56.39.8.18.24.4.45.66.61.51.32 1.11.49 1.73.49h4.31z" 
                        style={{ fill: '#34A853' }}
                      />
                    </svg>
                  </div>
                  <span>Connect Google Ads</span>
                </Button>

                <Button 
                  variant="outline"
                  className="w-full p-6 flex items-center justify-center space-x-3 bg-white hover:bg-gray-50"
                  onClick={() => {/* TODO: Implement Facebook Ads connection */}}
                >
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                  <span>Connect Facebook Ads</span>
                </Button>
              </div>
            </>
          )}

          {currentScreen === 'googleForm' && (
            <div className="w-full max-w-md bg-gray-100 p-6 rounded-md">
              <h2 className="text-xl font-medium text-center mb-6">Google Ads API Access</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name</Label>
                  <Input 
                    id="packageName" 
                    placeholder="com.testing" 
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <Button 
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                  onClick={handleSubmitGoogleForm}
                >
                  Start
                </Button>
              </div>
            </div>
          )}

          {currentScreen === 'googleConnect' && (
            <div className="w-full max-w-md flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-medium text-center">Connect with Google</h2>
              
              <p className="text-center text-gray-600">
                Link your email and in the following step,<br />
                sync the relevant Google Ads account
              </p>
              
              <Button 
                variant="outline" 
                className="px-8 py-3 flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 rounded-full border-gray-300"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-medium text-gray-700">Link with Google</span>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
