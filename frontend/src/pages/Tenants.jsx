

import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import TenantTable from '../components/tenants/TenantsTable'

const Tenants = () => {
  return (
    <div>
    <div>
    <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex flex-col items-start">
                <CardTitle className="text-2xl">
                  Welcome to Real Estate Management
                </CardTitle>
                <CardDescription className="text-base">
                  Here you can manage you Tenants , add new listings, and update existing ones.
                </CardDescription>
              </div>
              {/* Trigger parent state */}
              
            </CardHeader>
          </Card>

          <div>
            <TenantTable/>
          </div>

    </div>

       
      
    </div>
  )
}

export default Tenants
