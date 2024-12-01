interface TabLayoutProps {
  activeTab: 'data' | 'config'
  onTabChange: (tab: 'data' | 'config') => void
  children: React.ReactNode
}

export function TabLayout({ activeTab, onTabChange, children }: TabLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 ${
              activeTab === 'data'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => onTabChange('data')}
          >
            Input
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'config'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => onTabChange('config')}
          >
            Configuration
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
} 